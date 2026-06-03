using Microsoft.AspNetCore.Mvc;

namespace setPlay_C_.Business.DTOs
{
    public class ProducersCardsFilterDto
    {
        [FromQuery(Name = "genres")]
        public List<string>? Genres { get; set; }

        [FromQuery(Name = "bpmRangeMin")]
        public int? BpmRangeStart { get; set; }

        [FromQuery(Name = "bpmRangeMax")]
        public int? BpmRangeEnd { get; set; }

        [FromQuery(Name = "minRating")]
        public double? MinRating { get; set; }

        [FromQuery(Name = "completedGigsMin")]
        public int? CompletedGigsMin { get; set; }

        [FromQuery(Name = "completedGigsMax")]
        public int? CompletedGigsMax { get; set; }

        [FromQuery(Name = "location")]
        public string? Location { get; set; }

        [FromQuery(Name = "name")]
        public string? Name { get; set; }

        public override string ToString()
        {
            return $"{string.Join(", ", Genres ?? [])}{BpmRangeStart}{BpmRangeEnd}{MinRating}{CompletedGigsMin}{CompletedGigsMax}{Location}{Name}";
        }

    }
}
