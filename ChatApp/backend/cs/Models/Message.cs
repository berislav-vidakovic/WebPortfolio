namespace cs.Models
{
    public class Message
    {
        public int MsgId { get; set; }
        public int ChatId { get; set; }
        public int UserId { get; set; }
        public DateTime DateTime { get; set; }
        public string? Text { get; set; }
    }
}
