using System.Text.Json.Serialization;

namespace cs.Models
{
  public class Message
  {
    public int Id { get; set; }   // primary key

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
  }
}
