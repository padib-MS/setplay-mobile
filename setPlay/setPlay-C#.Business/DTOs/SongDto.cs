namespace setPlay_C_.Business.DTOs
{
    public class SongDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double SongLength { get; set; }
        public int? Bpm { get; set; }
        public string? Uri { get; set; }
        public string? Genre { get; set; }
        public bool? IsArchived { get; set; }
        public bool? IsExample { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
