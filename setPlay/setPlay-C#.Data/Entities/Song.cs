using setPlay_C_.Data.Contracts;

namespace setPlay_C_.Data.Entities
{
    public class Song : DbEntity
    {
        public Guid AuthorId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedMoment { get; set; }
        public GenreType Genre { get; set; }
        public double SongLength { get; set; }
        public int Bpm { get; set; }
        public string? Uri { get; set; }
        public bool IsArchived { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
        public byte[]? SongData { get; set; }

        public virtual User Author { get; set; } = default!;
        public virtual ICollection<Offer> Offers { get; set; } = [];
        public virtual ICollection<Gig> Gigs { get; set; } = [];
    }
}
