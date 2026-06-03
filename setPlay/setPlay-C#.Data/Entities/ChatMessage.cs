namespace setPlay_C_.Data.Entities
{
    public class ChatMessage : DbEntity
    {
        public Guid SenderId { get; set; }
        public Guid RecipientId { get; set; }
        public string MessageText { get; set; } = string.Empty;
        public DateTime SentDatetime { get; set; }

        public virtual User Sender { get; set; } = default!;
        public virtual User Recipient { get; set; } = default!;
    }
}
