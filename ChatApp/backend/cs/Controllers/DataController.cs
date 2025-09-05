using Microsoft.AspNetCore.Mvc;
using cs.Models;
using cs.Services;
using Npgsql; 

namespace cs.Controllers
{
    [ApiController]
    [Route("api")]
    public class DataController : ControllerBase
    {
        private readonly DataService _dataService;
        private readonly WebSocketHandler _wsHandler;

            public DataController(DataService dataService, WebSocketHandler wsHandler)
            {
                _dataService = dataService;
                _wsHandler = wsHandler;
            }


        // GET /api/data
        [HttpGet("data")]
        public async Task<ActionResult<DataModel>> GetData()
        {
            var data = await _dataService.LoadDataAsync();
            return Ok(data);
        }

        // POST /api/messages
        [HttpPost("messages")]
        public async Task<ActionResult<Message>> AddMessage([FromBody] Message newMsg)
        {
            if (newMsg == null || newMsg.ChatId == 0 || newMsg.UserId == 0 || string.IsNullOrWhiteSpace(newMsg.Text))
                return BadRequest("Invalid message data.");

            var savedMsg = await _dataService.AddMessageAsync(newMsg);

            // Broadcast to all connected clients
            await _wsHandler.BroadcastMessageAsync(savedMsg);

            return Ok(savedMsg);
        }

        // POST /api/register
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] User newUser)
        {
            if (newUser == null ||
                string.IsNullOrWhiteSpace(newUser.Login) ||
                string.IsNullOrWhiteSpace(newUser.FullName))
            {
                return BadRequest("Invalid user data.");
            }

            // quick existence check
            var existing = await _dataService.GetUserByLoginAsync(newUser.Login);
            if (existing != null)
                return Conflict("Login already exists.");

            try
            {
                var saved = await _dataService.AddUserAsync(newUser);
                return Ok(saved);
            }
            // safety net in case of race condition & unique constraint on DB
            catch (PostgresException ex) when (ex.SqlState == "23505")
            {
                return Conflict("Login already exists.");
            }
        }
    

        // POST /api/test
        [HttpPost("test")]
        public IActionResult Test()
        {
            return Ok("Test POST works");
        }
    }
}
