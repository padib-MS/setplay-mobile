using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Socials",
                keyColumn: "Id",
                keyValue: new Guid("ffffffff-ffff-ffff-ffff-fffffffffff2"));

            migrationBuilder.DeleteData(
                table: "Socials",
                keyColumn: "Id",
                keyValue: new Guid("ffffffff-ffff-ffff-ffff-fffffffffff3"));

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                columns: new[] { "CashReward", "Genre" },
                values: new object[] { 35, 13 });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                columns: new[] { "CashReward", "Genre" },
                values: new object[] { 50, 28 });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                columns: new[] { "CashReward", "Genre" },
                values: new object[] { 75, 29 });

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"),
                column: "Genre",
                value: 13);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
                column: "Genre",
                value: 28);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"),
                column: "Genre",
                value: 29);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"),
                column: "Genre",
                value: 7);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "Username",
                value: "Pulse");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "Rating", "Username" },
                values: new object[] { 0.0, "Echo" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277"),
                column: "Username",
                value: "Pharaoh");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "Username",
                value: "Luna");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                columns: new[] { "CashReward", "Genre" },
                values: new object[] { 350, 0 });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                columns: new[] { "CashReward", "Genre" },
                values: new object[] { 500, 1 });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                columns: new[] { "CashReward", "Genre" },
                values: new object[] { 275, 2 });

            migrationBuilder.InsertData(
                table: "Socials",
                columns: new[] { "Id", "Key", "Platform", "Url", "UserId" },
                values: new object[,]
                {
                    { new Guid("ffffffff-ffff-ffff-ffff-fffffffffff2"), "dj-pulse", "SoundCloud", "https://soundcloud.com/dj-pulse", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("ffffffff-ffff-ffff-ffff-fffffffffff3"), "producer-echo", "Bandcamp", "https://bandcamp.com/producer-echo", new Guid("33333333-3333-3333-3333-333333333333") }
                });

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"),
                column: "Genre",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
                column: "Genre",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"),
                column: "Genre",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"),
                column: "Genre",
                value: 3);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "Username",
                value: "DJ Pulse");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "Rating", "Username" },
                values: new object[] { 4.5999999999999996, "Producer Echo" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277"),
                column: "Username",
                value: "DJ Nova");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "Username",
                value: "Producer Luna");
        }
    }
}
