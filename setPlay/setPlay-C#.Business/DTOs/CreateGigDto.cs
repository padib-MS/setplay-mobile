namespace setPlay_C_.Business.DTOs
{
    public class CreateGigDto
    {
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string EventName { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
        public int Bid { get; set; }
        public string BackgroundImage { get; set; } = string.Empty;
        public Guid SongId { get; set; }
        public List<int> SongLengthRange { get; set; } = new List<int>();
        public List<int> BpmRange { get; set; } = new List<int>();
        public string Genre { get; set; } = string.Empty;
    }
}
