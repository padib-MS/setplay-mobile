namespace setPlay_C_.Data.Entities
{
    public class Venue : DbEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        public virtual ICollection<Gig> Gigs { get; set; } = new HashSet<Gig>();
    }
}
