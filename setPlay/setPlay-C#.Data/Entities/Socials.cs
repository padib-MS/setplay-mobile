namespace setPlay_C_.Data.Entities
{
    public class Socials : DbEntity
    {
        public Guid UserId { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;

        public virtual User User { get; set; } = default!;
    }
}
