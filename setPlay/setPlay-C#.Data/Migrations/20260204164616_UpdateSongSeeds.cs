using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSongSeeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                column: "AcceptedSongId",
                value: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"));

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                column: "AcceptedSongId",
                value: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"));

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: new Guid("dddddddd-dddd-dddd-dddd-ddddddddddd2"),
                column: "SongId",
                value: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Avatar", "PreferedUserType", "Rating", "Username" },
                values: new object[] { new Guid("55555555-5555-5555-5555-555555555555"), "https://i.pravatar.cc/300?img=15", 2, 4.0, "ExampleDJ" });

            migrationBuilder.InsertData(
                table: "Songs",
                columns: new[] { "Id", "AuthorId", "BpmRange", "CreatedMoment", "Genre", "IsArchived", "SongLength", "Title", "Uri" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5"), new Guid("55555555-5555-5555-5555-555555555555"), "[115,122]", new DateTime(2026, 1, 5, 12, 0, 0, 0, DateTimeKind.Utc), 5, false, new TimeSpan(0, 0, 3, 45, 0), "Starlit Path", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6"), new Guid("55555555-5555-5555-5555-555555555555"), "[125,130]", new DateTime(2026, 1, 6, 12, 0, 0, 0, DateTimeKind.Utc), 9, false, new TimeSpan(0, 0, 4, 20, 0), "Electric Horizon", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5"));

            migrationBuilder.DeleteData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                column: "AcceptedSongId",
                value: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"));

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                column: "AcceptedSongId",
                value: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"));

            migrationBuilder.UpdateData(
                table: "Offers",
                keyColumn: "Id",
                keyValue: new Guid("dddddddd-dddd-dddd-dddd-ddddddddddd2"),
                column: "SongId",
                value: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"));
        }
    }
}
