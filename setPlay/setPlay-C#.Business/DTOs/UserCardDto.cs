namespace setPlay_C_.Business.DTOs
{
    public class UserCardDto
    {
        public Guid Id { get; set; }
        public string Avatar { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public IEnumerable<SocialLinkDto> Links { get; set; } = [];
        public double DjRating { get; set; }
        public double ProducerRating { get; set; }
        public GigsResponseDto? DjCompletedGigs { get; set; }
        public GigsResponseDto? ProducerCompletedGigs { get; set; }
    }

    public class ProducerCardsDto
    {
        public IEnumerable<UserCardDto> ProducerCards { get; set; } = [];
    }
}
