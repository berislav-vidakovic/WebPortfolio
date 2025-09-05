using System.Net.WebSockets;
using System.Text;
using System.Text.Json;


public class WebSocketHandler
{
    private readonly List<WebSocket> _clients = new();

    public async Task HandleClient(WebSocket ws)
    {
        lock (_clients) _clients.Add(ws);

        var buffer = new byte[1024 * 4];
        try
        {
            while (ws.State == WebSocketState.Open)
            {
                var result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }
            }
        }
        finally
        {
            lock (_clients) _clients.Remove(ws);
            if (ws.State == WebSocketState.Open)
                await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
        }
    }

    public async Task BroadcastMessageAsync(object message)
    {
        var json = JsonSerializer.Serialize(message);
        var bytes = Encoding.UTF8.GetBytes(json);

        List<WebSocket> clientsCopy;
        lock (_clients)
        {
            clientsCopy = _clients.Where(c => c.State == WebSocketState.Open).ToList();
        }

        var tasks = clientsCopy.Select(async c =>
        {
            try
            {
                await c.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send to a client: {ex.Message}");
                lock (_clients)
                {
                    _clients.Remove(c);
                }
            }
        });

        await Task.WhenAll(tasks);
        Console.WriteLine($"Broadcasted message to {clientsCopy.Count} clients: {json}");
    }
}
