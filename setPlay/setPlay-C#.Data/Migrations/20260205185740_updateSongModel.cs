using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateSongModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "SongLength",
                table: "Songs",
                type: "double",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time(6)");

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"),
                column: "SongLength",
                value: 204.0);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
                column: "SongLength",
                value: 250.0);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"),
                column: "SongLength",
                value: 305.0);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"),
                column: "SongLength",
                value: 238.0);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5"),
                column: "SongLength",
                value: 210.0);

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6"),
                column: "SongLength",
                value: 318.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "SongLength",
                table: "Songs",
                type: "time(6)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"),
                column: "SongLength",
                value: new TimeSpan(0, 0, 3, 24, 0));

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
                column: "SongLength",
                value: new TimeSpan(0, 0, 4, 10, 0));

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"),
                column: "SongLength",
                value: new TimeSpan(0, 0, 5, 5, 0));

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4"),
                column: "SongLength",
                value: new TimeSpan(0, 0, 2, 58, 0));

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5"),
                column: "SongLength",
                value: new TimeSpan(0, 0, 3, 45, 0));

            migrationBuilder.UpdateData(
                table: "Songs",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6"),
                column: "SongLength",
                value: new TimeSpan(0, 0, 4, 20, 0));
        }
    }
}
