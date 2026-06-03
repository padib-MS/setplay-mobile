using Microsoft.AspNetCore.Mvc;

namespace setPlay_C_.Business.DTOs
{
    public class GigFilterDto
    {
        [FromQuery(Name = "genres")]
        public List<string>? Genres { get; set; }

        [FromQuery(Name = "bpmRangeMin")]
        public int? BpmRangeStart { get; set; }

        [FromQuery(Name = "bpmRangeMax")]
        public int? BpmRangeEnd { get; set; }

        [FromQuery(Name = "location")]
        public string? Location { get; set; }

        [FromQuery(Name = "dateFrom")]
        public DateTime? GigStartDateFrom { get; set; }

        [FromQuery(Name = "dateTo")]
        public DateTime? GigStartDateTo { get; set; }

        [FromQuery(Name = "minBid")]
        public int? PriceStart { get; set; }

        [FromQuery(Name = "maxBid")]
        public int? PriceEnd { get; set; }

        [FromQuery(Name = "venue")]
        public string? VenueType { get; set; }

        [FromQuery(Name = "djName")]
        public string? DjName { get; set; }

        [FromQuery(Name = "showCompleted")]
        public bool? ShowCompleted { get; set; }

        [FromQuery(Name = "pageNumber")]
        public int PageNumber { get; set; } = 1;

        [FromQuery(Name = "pageSize")]
        public int PageSize { get; set; } = 3;

        [FromQuery(Name = "isSearch")]
        public bool? IsSearch { get; set; } = false;

        public override string ToString()
        {
            return $"{string.Join(", ", Genres ?? [])}{DjName}{BpmRangeStart}{BpmRangeEnd}{Location}{GigStartDateFrom}{GigStartDateTo}{PriceStart}{PriceEnd}{VenueType}{ShowCompleted}{PageNumber}{PageSize}";
        }

    }
}
