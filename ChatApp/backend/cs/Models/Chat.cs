namespace cs.Models
{
    public class Chat
    {
        public int ChatId { get; set; }
        public List<int> UserIds { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
    }
}
