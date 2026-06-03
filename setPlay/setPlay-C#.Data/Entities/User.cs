using setPlay_C_.Data.Contracts;
using System.ComponentModel.DataAnnotations.Schema;

namespace setPlay_C_.Data.Entities
{
    public class User : DbEntity
    {
        public string Username { get; set; } = string.Empty;

        [Column(TypeName = "longtext")]
        public string Avatar { get; set; } = string.Empty;
        public double DjRating { get; set; } = 0.0;
        public double ProducerRating { get; set; } = 0.0;
        public int DjRatingCount { get; set; }
        public int ProducerRatingCount { get; set; }
        public Roles PreferedUserType { get; set; }

        public virtual ICollection<Socials> Socials { get; set; } = new HashSet<Socials>();
        public virtual ICollection<Song> Songs { get; set; } = new HashSet<Song>();
        public virtual ICollection<Gig> DJGigs { get; set; } = new HashSet<Gig>();
        public virtual ICollection<GigSavedUser> ProducerGigs { get; set; } = new HashSet<GigSavedUser>();
        public virtual ICollection<ChatMessage> SentMessages { get; set; } = new HashSet<ChatMessage>();
        public virtual ICollection<ChatMessage> ReceivedMessages { get; set; } = new HashSet<ChatMessage>();

    }
}
