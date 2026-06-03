using System.ComponentModel.DataAnnotations;

namespace setPlay_C_.Data.Entities
{
    public abstract class DbEntity
    {
        [Key]
        public Guid Id { get; set; }
    }
}
