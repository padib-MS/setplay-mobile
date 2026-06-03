using setPlay_C_.Data.Contracts;

namespace setPlay_C_.Data.Entities
{
    public class GigSavedUser : DbEntity
    {
        public Guid GigId { get; set; }
        public Guid UserId { get; set; }
        public Roles SavedWithRole { get; set; }

        public virtual User User { get; set; } = default!;
        public virtual Gig Gig { get; set; } = default!;
    }
}
