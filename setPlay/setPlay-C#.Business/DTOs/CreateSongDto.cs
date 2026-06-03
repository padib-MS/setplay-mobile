using Microsoft.AspNetCore.Http;

namespace setPlay_C_.Business.DTOs
{
    public class CreateSongDto
    {
        public string Name { get; set; }
        public string Genre { get; set; }
        public double SongLength { get; set; }
        public int Bpm { get; set; }
        public string Uri { get; set; } = string.Empty;
    }

    public class CreateSongDtoWithFile : CreateSongDto
    {
        public IFormFile? SongFile { get; set; }
    }
}
