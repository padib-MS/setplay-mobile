using Microsoft.EntityFrameworkCore;
using setPlay_C_.Data.Contracts;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data
{
    public static class SeedData
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            var dj1Id = Guid.Parse("3ed3c11d-f4ad-4749-b30b-6466e9e40277");
            var dj2Id = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var producer1Id = Guid.Parse("33333333-3333-3333-3333-333333333333");
            var producer2Id = Guid.Parse("44444444-4444-4444-4444-444444444444");
            var exampleUserId = Guid.Parse("55555555-5555-5555-5555-555555555555");

            modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = dj1Id,
                Username = "Pharaoh",
                Avatar = "https://i.pravatar.cc/300?img=12",
                PreferedUserType = Roles.DJ,
                DjRating = 4.7,
                ProducerRating = 0,
            },
            new User
            {
                Id = dj2Id,
                Username = "Pulse",
                Avatar = "https://i.pravatar.cc/300?img=32",
                PreferedUserType = Roles.DJ,
                DjRating = 4.3,
                ProducerRating = 3.7
            },
            new User
            {
                Id = producer1Id,
                Username = "Echo",
                Avatar = "https://i.pravatar.cc/300?img=5",
                PreferedUserType = Roles.Producer,
                DjRating = 0,
                ProducerRating = 4
            },
            new User
            {
                Id = producer2Id,
                Username = "Luna",
                Avatar = "https://randomuser.me/api/portraits/women/3.jpg",
                PreferedUserType = Roles.Producer,
                DjRating = 4.2,
                ProducerRating = 4.6
            },
            new User
            {
                Id = exampleUserId,
                Username = "ExampleDJ",
                Avatar = "https://i.pravatar.cc/300?img=15",
                PreferedUserType = Roles.ExampleProvider,
                DjRating = 4.0
            }
            );

            var song1Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1");
            var song2Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2");
            var song3Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3");
            var song4Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4");
            var song5Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5");
            var song6Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6");

            modelBuilder.Entity<Song>().HasData(
            new Song
            {
                Id = song1Id,
                Title = "Neon Drive",
                Uri = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                AuthorId = producer1Id,
                Genre = GenreType.House,
                Bpm = 120,
                SongLength = 204,
                IsArchived = false,
                CreatedMoment = new DateTime(2026, 01, 01, 12, 00, 00, DateTimeKind.Utc)
            },
            new Song
            {
                Id = song2Id,
                Title = "Midnight Circuit",
                Uri = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                AuthorId = producer2Id,
                Genre = GenreType.Techno,
                Bpm = 135,
                SongLength = 250,
                IsArchived = false,
                CreatedMoment = new DateTime(2026, 01, 02, 12, 00, 00, DateTimeKind.Utc)
            },
            new Song
            {
                Id = song3Id,
                Title = "Sunrise Bloom",
                Uri = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                AuthorId = producer1Id,
                Genre = GenreType.Trance,
                Bpm = 150,
                SongLength = 305,
                IsArchived = false,
                CreatedMoment = new DateTime(2026, 01, 03, 12, 00, 00, DateTimeKind.Utc)
            },
            new Song
            {
                Id = song4Id,
                Title = "Low Tide",
                Uri = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                AuthorId = producer2Id,
                Genre = GenreType.Drum_and_Bass,
                Bpm = 160,
                SongLength = 238,
                IsArchived = false,
                CreatedMoment = new DateTime(2026, 01, 04, 12, 00, 00, DateTimeKind.Utc)
            },
            new Song
            {
                Id = song5Id,
                Title = "Starlit Path",
                Uri = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                AuthorId = exampleUserId,
                Genre = GenreType.Deep_House,
                Bpm = 120,
                SongLength = 210,
                IsArchived = false,
                CreatedMoment = new DateTime(2026, 01, 05, 12, 00, 00, DateTimeKind.Utc)
            },
            new Song
            {
                Id = song6Id,
                Title = "Electric Horizon",
                Uri = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                AuthorId = exampleUserId,
                Genre = GenreType.Electronica,
                Bpm = 145,
                SongLength = 318,
                IsArchived = false,
                CreatedMoment = new DateTime(2026, 01, 06, 12, 00, 00, DateTimeKind.Utc)
            }
            );

            var venue1Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1");
            var venue2Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2");
            var venue3Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3");

            modelBuilder.Entity<Venue>().HasData(
            new Venue
            {
                Id = venue1Id,
                Name = "Club Aurora",
                Location = "Berlin, DE"
            },
            new Venue
            {
                Id = venue2Id,
                Name = "Warehouse19",
                Location = "Amsterdam, NL"
            },
            new Venue
            {
                Id = venue3Id,
                Name = "Skyline Rooftop",
                Location = "Lisbon, PT"
            }
            );


            var gig1Id = Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc1");
            var gig2Id = Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc2");
            var gig3Id = Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc3");

            modelBuilder.Entity<Gig>().HasData(
            new Gig
            {
                Id = gig1Id,
                DJId = dj1Id,
                VenueId = venue1Id,
                EventName = "Aurora Nights",
                EventMoment = new DateTime(2026, 02, 14, 0, 0, 0, DateTimeKind.Utc),
                EventDuration = "12am-4pm",
                PostedMoment = new DateTime(2026, 02, 01, 10, 00, 00, DateTimeKind.Utc),
                CashReward = 35,
                BackgroundImage = "https://picsum.photos/seed/gig1/1200/600",
                Genre = GenreType.House,
                SongLengthRange = new List<int> { 180, 240 },
                BpmRangeStart = 120,
                BpmRangeEnd = 125,
                AcceptedSongId = song4Id,
                IsCancelled = false
            },
            new Gig
            {
                Id = gig2Id,
                DJId = dj2Id,
                VenueId = venue2Id,
                EventName = "Circuit Breaker",
                EventMoment = new DateTime(2026, 03, 01, 0, 0, 0, DateTimeKind.Utc),
                EventDuration = "11am-2pm",
                PostedMoment = new DateTime(2026, 02, 10, 10, 00, 00, DateTimeKind.Utc),
                CashReward = 50,
                BackgroundImage = "https://picsum.photos/seed/gig2/1200/600",
                Genre = GenreType.Techno,
                SongLengthRange = new List<int> { 240, 330 },
                BpmRangeStart = 120,
                BpmRangeEnd = 135,
                AcceptedSongId = song4Id,
                IsCancelled = false
            },
            new Gig
            {
                Id = gig3Id,
                DJId = dj1Id,
                VenueId = venue3Id,
                EventName = "Rooftop Sunrise",
                EventMoment = new DateTime(2026, 04, 06, 0, 0, 0, DateTimeKind.Utc),
                EventDuration = "9pm-11pm",
                PostedMoment = new DateTime(2026, 03, 20, 10, 00, 00, DateTimeKind.Utc),
                CashReward = 75,
                BackgroundImage = "https://picsum.photos/seed/gig3/1200/600",
                Genre = GenreType.Trance,
                SongLengthRange = new List<int> { 240, 360 },
                BpmRangeStart = 136,
                BpmRangeEnd = 142,
                AcceptedSongId = song3Id,
                IsCancelled = false
            }
            );


            var offer1Id = Guid.Parse("dddddddd-dddd-dddd-dddd-ddddddddddd1");
            var offer2Id = Guid.Parse("dddddddd-dddd-dddd-dddd-ddddddddddd2");

            modelBuilder.Entity<Offer>().HasData(
            new Offer
            {
                Id = offer1Id,
                GigId = gig1Id,
                SongId = song4Id,
                IsHidden = false
            },
            new Offer
            {
                Id = offer2Id,
                GigId = gig2Id,
                SongId = song2Id,
                IsHidden = false
            }
            );

            var save1Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1");
            var save2Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2");

            modelBuilder.Entity<GigSavedUser>().HasData(
            new GigSavedUser
            {
                Id = save1Id,
                GigId = gig1Id,
                UserId = producer1Id,
                SavedWithRole = Roles.Producer,
            },
            new GigSavedUser
            {
                Id = save2Id,
                GigId = gig3Id,
                UserId = producer2Id,
                SavedWithRole = Roles.Producer,
            }
            );

            var socials1Id = Guid.Parse("ffffffff-ffff-ffff-ffff-fffffffffff1");
            var socials2Id = Guid.Parse("ffffffff-ffff-ffff-ffff-fffffffffff2");
            var socials3Id = Guid.Parse("ffffffff-ffff-ffff-ffff-fffffffffff3");
            var socials4Id = Guid.Parse("ffffffff-ffff-ffff-ffff-fffffffffff4");

            modelBuilder.Entity<Socials>().HasData(
            new Socials
            {
                Id = socials1Id,
                UserId = dj1Id,
                Platform = "Instagram",
                Key = "djnova",
                Url = "https://instagram.com/djnova"
            },
            new Socials
            {
                Id = socials4Id,
                UserId = producer2Id,
                Platform = "YouTube",
                Key = "producer-luna",
                Url = "https://youtube.com/@producer-luna"
            }
            );
        }
    }
}
