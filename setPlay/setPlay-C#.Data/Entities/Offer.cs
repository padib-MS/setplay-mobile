namespace setPlay_C_.Data.Entities
{
    public class Offer : DbEntity
    {
        public Guid GigId { get; set; }
        public Guid SongId { get; set; }
        public bool IsHidden { get; set; } = false;

        public virtual Gig Gig { get; set; } = default!;
        public virtual Song Song { get; set; } = default!;
    }
}
