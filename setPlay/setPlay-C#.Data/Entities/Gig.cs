using setPlay_C_.Data.Contracts;

namespace setPlay_C_.Data.Entities
{
    public class Gig : DbEntity
    {
        public DateTime PostedMoment { get; set; }
        public Guid DJId { get; set; }
        public Guid VenueId { get; set; }
        public Guid AcceptedSongId { get; set; }
        public string EventName { get; set; } = string.Empty;
        public DateTime EventMoment { get; set; }
        public string EventDuration { get; set; } = string.Empty;
        public GenreType Genre { get; set; }
        public List<int> SongLengthRange { get; set; } = [];
        public int BpmRangeStart { get; set; }
        public int BpmRangeEnd { get; set; }
        public int CashReward { get; set; }
        public string BackgroundImage { get; set; } = string.Empty;
        public bool IsCancelled { get; set; } = false;
        public bool IsCompleted { get; set; } = false;
        public DateTime? CancelledAt { get; set; }
        public byte[]? UploadedVideo { get; set; }
        public string? VideoFileType { get; set; }

        public virtual User DJ { get; set; } = default!;
        public virtual Venue Venue { get; set; } = default!;
        public virtual Song AcceptedSong { get; set; } = default!;
        public virtual ICollection<Offer> Offers { get; set; } = [];
        public virtual ICollection<GigSavedUser> GigSavedByUser { get; set; } = [];
        public virtual GigPerformanceReview? GigPerformanceReview { get; set; }
    }
}
