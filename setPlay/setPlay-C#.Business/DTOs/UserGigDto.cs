namespace setPlay_C_.Business.DTOs
{
    public class UserGigDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string Avatar { get; set; } = string.Empty;
    }
}
