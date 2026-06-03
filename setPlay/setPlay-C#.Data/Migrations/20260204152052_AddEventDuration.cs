using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEventDuration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EventDuration",
                table: "Gigs",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                columns: new[] { "EventDuration", "EventMoment" },
                values: new object[] { "12am-4pm", new DateTime(2026, 2, 14, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                columns: new[] { "EventDuration", "EventMoment" },
                values: new object[] { "11am-2pm", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                columns: new[] { "EventDuration", "EventMoment" },
                values: new object[] { "9pm-11pm", new DateTime(2026, 4, 6, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"),
                column: "Uri",
                value: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3");

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
                column: "Uri",
                value: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"),
                column: "Uri",
                value: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3");

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"),
                column: "Uri",
                value: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventDuration",
                table: "Gigs");

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                column: "EventMoment",
                value: new DateTime(2026, 2, 14, 22, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                column: "EventMoment",
                value: new DateTime(2026, 3, 1, 23, 30, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                column: "EventMoment",
                value: new DateTime(2026, 4, 6, 5, 30, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"),
                column: "Uri",
                value: "https://example.com/audio/neon-drive");

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
                column: "Uri",
                value: "https://example.com/audio/midnight-circuit");

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"),
                column: "Uri",
                value: "https://example.com/audio/sunrise-bloom");

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"),
                column: "Uri",
                value: "https://example.com/audio/low-tide");
        }
    }
}
