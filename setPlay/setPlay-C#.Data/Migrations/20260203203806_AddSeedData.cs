using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Avatar", "PreferedUserType", "Rating", "Username" },
                values: new object[,]
                {
                    { new Guid("22222222-2222-2222-2222-222222222222"), "https://i.pravatar.cc/300?img=32", 0, 4.2999999999999998, "DJ Pulse" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "https://i.pravatar.cc/300?img=5", 1, 4.5999999999999996, "Producer Echo" },
                    { new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277"), "https://i.pravatar.cc/300?img=12", 0, 4.7000000000000002, "DJ Nova" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "https://i.pravatar.cc/300?img=8", 1, 4.2000000000000002, "Producer Luna" }
                });

            migrationBuilder.InsertData(
                table: "Venues",
                columns: new[] { "Id", "Location", "Name" },
                values: new object[,]
                {
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1"), "Berlin, DE", "Club Aurora" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"), "Amsterdam, NL", "Warehouse19" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3"), "Lisbon, PT", "Skyline Rooftop" }
                });

            migrationBuilder.InsertData(
                table: "Socials",
                columns: new[] { "Id", "Key", "Platform", "Url", "UserId" },
                values: new object[,]
                {
                    { new Guid("ffffffff-ffff-ffff-ffff-fffffffffff1"), "djnova", "Instagram", "https://instagram.com/djnova", new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277") },
                    { new Guid("ffffffff-ffff-ffff-ffff-fffffffffff2"), "dj-pulse", "SoundCloud", "https://soundcloud.com/dj-pulse", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("ffffffff-ffff-ffff-ffff-fffffffffff3"), "producer-echo", "Bandcamp", "https://bandcamp.com/producer-echo", new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("ffffffff-ffff-ffff-ffff-fffffffffff4"), "producer-luna", "YouTube", "https://youtube.com/@producer-luna", new Guid("44444444-4444-4444-4444-444444444444") }
                });

            migrationBuilder.InsertData(
                table: "Songs",
                columns: new[] { "Id", "AuthorId", "BpmRange", "CreatedMoment", "Genre", "IsArchived", "SongLength", "Title", "Uri" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"), new Guid("33333333-3333-3333-3333-333333333333"), "[120,128]", new DateTime(2026, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), 0, false, new TimeSpan(0, 0, 3, 24, 0), "Neon Drive", "https://example.com/audio/neon-drive" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"), new Guid("44444444-4444-4444-4444-444444444444"), "[128,135]", new DateTime(2026, 1, 2, 12, 0, 0, 0, DateTimeKind.Utc), 1, false, new TimeSpan(0, 0, 4, 10, 0), "Midnight Circuit", "https://example.com/audio/midnight-circuit" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"), new Guid("33333333-3333-3333-3333-333333333333"), "[136,142]", new DateTime(2026, 1, 3, 12, 0, 0, 0, DateTimeKind.Utc), 2, false, new TimeSpan(0, 0, 5, 5, 0), "Sunrise Bloom", "https://example.com/audio/sunrise-bloom" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"), new Guid("44444444-4444-4444-4444-444444444444"), "[170,176]", new DateTime(2026, 1, 4, 12, 0, 0, 0, DateTimeKind.Utc), 3, false, new TimeSpan(0, 0, 2, 58, 0), "Low Tide", "https://example.com/audio/low-tide" }
                });

            migrationBuilder.InsertData(
                table: "Gigs",
                columns: new[] { "Id", "AcceptedSongId", "BackgroundImage", "BpmRange", "CashReward", "DJId", "EventMoment", "EventName", "Genre", "IsCancelled", "PostedMoment", "SongLengthRange", "VenueId" },
                values: new object[,]
                {
                    { new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"), "https://picsum.photos/seed/gig1/1200/600", "[120,128]", 350, new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277"), new DateTime(2026, 2, 14, 22, 0, 0, 0, DateTimeKind.Utc), "Aurora Nights", 0, false, new DateTime(2026, 2, 1, 10, 0, 0, 0, DateTimeKind.Utc), "[180,240]", new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1") },
                    { new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"), "https://picsum.photos/seed/gig2/1200/600", "[128,135]", 500, new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 3, 1, 23, 30, 0, 0, DateTimeKind.Utc), "Circuit Breaker", 1, false, new DateTime(2026, 2, 10, 10, 0, 0, 0, DateTimeKind.Utc), "[240,330]", new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2") },
                    { new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"), new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"), "https://picsum.photos/seed/gig3/1200/600", "[136,142]", 275, new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277"), new DateTime(2026, 4, 6, 5, 30, 0, 0, DateTimeKind.Utc), "Rooftop Sunrise", 2, false, new DateTime(2026, 3, 20, 10, 0, 0, 0, DateTimeKind.Utc), "[240,360]", new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3") }
                });

            migrationBuilder.InsertData(
                table: "GigProducers",
                columns: new[] { "Id", "GigId", "ProducerId" },
                values: new object[,]
                {
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1"), new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"), new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2"), new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"), new Guid("44444444-4444-4444-4444-444444444444") }
                });

            migrationBuilder.InsertData(
                table: "Offers",
                columns: new[] { "Id", "GigId", "IsHidden", "SongId" },
                values: new object[,]
                {
                    { new Guid("dddddddd-dddd-dddd-dddd-ddddddddddd1"), new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"), false, new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4") },
                    { new Guid("dddddddd-dddd-dddd-dddd-ddddddddddd2"), new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"), false, new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GigProducers",
                keyColumn: "Id",
                keyValue: new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1"));

            migrationBuilder.DeleteData(
                table: "GigProducers",
                keyColumn: "Id",
                keyValue: new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2"));

            migrationBuilder.DeleteData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: new Guid("dddddddd-dddd-dddd-dddd-ddddddddddd1"));

            migrationBuilder.DeleteData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: new Guid("dddddddd-dddd-dddd-dddd-ddddddddddd2"));

            migrationBuilder.DeleteData(
                table: "Socials",
                keyColumn: "Id",
                keyValue: new Guid("ffffffff-ffff-ffff-ffff-fffffffffff1"));

            migrationBuilder.DeleteData(
                table: "Socials",
                keyColumn: "Id",
                keyValue: new Guid("ffffffff-ffff-ffff-ffff-fffffffffff2"));

            migrationBuilder.DeleteData(
                table: "Socials",
                keyColumn: "Id",
                keyValue: new Guid("ffffffff-ffff-ffff-ffff-fffffffffff3"));

            migrationBuilder.DeleteData(
                table: "Socials",
                keyColumn: "Id",
                keyValue: new Guid("ffffffff-ffff-ffff-ffff-fffffffffff4"));

            migrationBuilder.DeleteData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"));

            migrationBuilder.DeleteData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"));

            migrationBuilder.DeleteData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"));

            migrationBuilder.DeleteData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"));

            migrationBuilder.DeleteData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"));

            migrationBuilder.DeleteData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"));

            migrationBuilder.DeleteData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277"));

            migrationBuilder.DeleteData(
                table: "Venues",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1"));

            migrationBuilder.DeleteData(
                table: "Venues",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"));

            migrationBuilder.DeleteData(
                table: "Venues",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));
        }
    }
}
