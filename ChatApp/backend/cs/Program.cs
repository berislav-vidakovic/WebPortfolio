using cs.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Read AllowedOrigins from appsettings.json
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

// Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (allowedOrigins != null && allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

// Get DATABASE_URL from Render, or fall back to appsettings.json
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
string connectionString;

if (!string.IsNullOrEmpty(databaseUrl))
{
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');

    int port = uri.Port > 0 ? uri.Port : 5432; // default Postgres port

    connectionString =
        $"Host={uri.Host};Port={port};Database={uri.AbsolutePath.TrimStart('/')};" +
        $"Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true;";
}
else
{
    connectionString = builder.Configuration.GetConnectionString("PostgresConnection");
}

// Register services
builder.Services.AddSingleton(new DataService(connectionString));
builder.Services.AddSingleton<WebSocketHandler>();
builder.Services.AddControllers();

var app = builder.Build();

// Use CORS policy
app.UseCors("AllowReactApp");

// app.UseHttpsRedirection();

app.UseWebSockets();
app.MapControllers();

// Map /ws endpoint
app.Map("/ws", async (HttpContext context, WebSocketHandler wsHandler) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await wsHandler.HandleClient(webSocket);
    }
    else
    {
        context.Response.StatusCode = 400; // not a WebSocket request
    }
});

app.Run();
