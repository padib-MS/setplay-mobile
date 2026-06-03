using Microsoft.AspNetCore.Http;

namespace setPlay_C_.Business.DTOs
{
    public class UpdateProfileInfoDto
    {
        public string? Name { get; set; }
        public string? Avatar { get; set; }
    }

    public class UpdateProfileInfoDtoWithImage : UpdateProfileInfoDto
    {
        public new IFormFile? Avatar { get; set; }
    }
}
