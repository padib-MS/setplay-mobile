using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class SplitBpmRange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BpmRange",
                table: "Gigs");

            migrationBuilder.AddColumn<int>(
                name: "BpmRangeEnd",
                table: "Gigs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BpmRangeStart",
                table: "Gigs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                columns: new[] { "BpmRangeEnd", "BpmRangeStart" },
                values: new object[] { 128, 120 });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                columns: new[] { "BpmRangeEnd", "BpmRangeStart" },
                values: new object[] { 135, 128 });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                columns: new[] { "BpmRangeEnd", "BpmRangeStart" },
                values: new object[] { 142, 136 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BpmRangeEnd",
                table: "Gigs");

            migrationBuilder.DropColumn(
                name: "BpmRangeStart",
                table: "Gigs");

            migrationBuilder.AddColumn<string>(
                name: "BpmRange",
                table: "Gigs",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                column: "BpmRange",
                value: "[120,128]");

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                column: "BpmRange",
                value: "[128,135]");

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                column: "BpmRange",
                value: "[136,142]");
        }
    }
}
