using cs.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register WebSocketService as singleton
builder.Services.AddSingleton<WebSocketService>();

// Add services
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddControllers();

// Add CORS service
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowReactApp", policy =>
  {
    policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
  });
});


var app = builder.Build();

// Use CORS policy
app.UseCors("AllowReactApp");

// Use WS
app.UseWebSockets();


var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://*:{port}");

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// WebSocket endpoint
app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var wsManager = context.RequestServices.GetRequiredService<WebSocketService>();
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        wsManager.AddSocket(webSocket);

        var dbContext = context.RequestServices.GetRequiredService<AppDbContext>();

        var buffer = new byte[1024 * 4];
        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!result.CloseStatus.HasValue)
        {
            var message = System.Text.Encoding.UTF8.GetString(buffer, 0, result.Count);

            // 1️-Update DB with the WS message
            var existing = await dbContext.Messages.FirstOrDefaultAsync(m => m.Id == 1);
            if (existing != null)
            {
                existing.Content = message;
                await dbContext.SaveChangesAsync();
            }

            // 2️-Broadcast to all WS clients
            await wsManager.BroadcastAsync(message);

            result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        wsManager.RemoveSocket(webSocket);
        await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});


app.Run();
