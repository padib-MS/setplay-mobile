using Microsoft.AspNetCore.Mvc;

namespace setPlay_C_.Business.DTOs
{
    public class GigToSaveDto
    {
        [FromRoute]
        public Guid GigId { get; set; }
    }
}
