namespace setPlay_C_.Business.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Avatar { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public List<SocialLinkDto>? SocialLinks { get; set; }
    }
}
