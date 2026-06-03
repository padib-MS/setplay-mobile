using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class gigComplete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "GigDjRating",
                table: "Gigs",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GigProducerRating",
                table: "Gigs",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Gigs",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                columns: new[] { "GigDjRating", "GigProducerRating", "IsCompleted" },
                values: new object[] { 0.0, 0.0, false });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                columns: new[] { "GigDjRating", "GigProducerRating", "IsCompleted" },
                values: new object[] { 0.0, 0.0, false });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                columns: new[] { "GigDjRating", "GigProducerRating", "IsCompleted" },
                values: new object[] { 0.0, 0.0, false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GigDjRating",
                table: "Gigs");

            migrationBuilder.DropColumn(
                name: "GigProducerRating",
                table: "Gigs");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Gigs");
        }
    }
}
