namespace cs.Models
{
    public class DataModel
    {
        public List<User> Users { get; set; } = new();
        public List<Chat> Chats { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
    }
}
