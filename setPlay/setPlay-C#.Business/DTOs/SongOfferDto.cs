namespace setPlay_C_.Business.DTOs
{
    public class SongOfferDto
    {
        public string Name { get; set; } = string.Empty;
        public double SongLength { get; set; }
        public int Bpm { get; set; }
        public string Uri { get; set; } = string.Empty;
        public bool IsArchived { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
