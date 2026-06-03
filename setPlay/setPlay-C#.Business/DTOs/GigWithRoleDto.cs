namespace setPlay_C_.Business.DTOs
{
    public class GigResponseDto
    {
        public Guid Id { get; set; }
        public string Location { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
        public int Bid { get; set; }
        public string? BackgroundImage { get; set; }
        public string Genre { get; set; } = string.Empty;
        public Guid SongId { get; set; }
        public List<int>? SongLengthRange { get; set; }
        public List<int>? BpmRange { get; set; }
        public UserGigDto? Producer { get; set; }
        public SongDto Song { get; set; } = default!;
        public OfferDto? OfferOnGig { get; set; }
        public OffersDto? Offers { get; set; }
        public UserGigDto Dj { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public bool IsSaved { get; set; }
        public string? Role { get; set; }
        public bool HasVideo { get; set; }
        public bool HasProducerRated { get; set; }
        public bool HasDjRated { get; set; }
    }

    public class GigsResponseDto
    {
        public IEnumerable<GigResponseDto> GigCards { get; set; } = [];

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;

        public int TotalCount { get; set; }

        public int TotalPages { get; set; }
    }
}
