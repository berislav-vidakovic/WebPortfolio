using Microsoft.AspNetCore.Mvc;
using cs.Services;
using cs.Models;
using Microsoft.EntityFrameworkCore;

namespace cs.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class DataController : ControllerBase
  {
    private readonly AppDbContext _context;

    public DataController(AppDbContext context)
    {
      _context = context;
    }

    [HttpPost("message")]
    public async Task<IActionResult> UpdateMessage([FromBody] Message newMessage)
    {
      Console.WriteLine($"Received message: '{newMessage.Content}'");

      // Load the first row (id=1)
      var existing = await _context.Messages.FirstOrDefaultAsync(m => m.Id == 1);

      if (existing == null)
      {
        return NotFound("Message row not found.");
      }

      // Update content
      existing.Content = newMessage.Content;
      await _context.SaveChangesAsync();

      // Return updated row
      return Ok(existing);
    }
        
    // GET: api/data/message
    [HttpGet("message")]
    public async Task<IActionResult> GetMessage()
    {
        var existing = await _context.Messages.FirstOrDefaultAsync(m => m.Id == 1);

        if (existing == null)
        {
            return NotFound("Message row not found.");
        }

        return Ok(existing);
    }
  }
}
