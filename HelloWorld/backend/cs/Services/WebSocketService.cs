using System.Net.WebSockets;
using System.Text;

namespace cs.Services
{
    public class WebSocketService
    {
        private readonly List<WebSocket> _sockets = new();

        public void AddSocket(WebSocket socket)
        {
            lock (_sockets)
            {
                _sockets.Add(socket);
            }
        }

        public void RemoveSocket(WebSocket socket)
        {
            lock (_sockets)
            {
                _sockets.Remove(socket);
            }
        }

        public async Task BroadcastAsync(string message)
        {
            var buffer = Encoding.UTF8.GetBytes(message);
            var tasks = new List<Task>();

            lock (_sockets)
            {
                foreach (var socket in _sockets.ToList())
                {
                    if (socket.State == WebSocketState.Open)
                    {
                        tasks.Add(socket.SendAsync(
                            new ArraySegment<byte>(buffer),
                            WebSocketMessageType.Text,
                            true,
                            CancellationToken.None));
                    }
                }
            }

            await Task.WhenAll(tasks);
        }
    }
}
