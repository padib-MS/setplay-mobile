using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateRatingBasedOnRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "Users",
                newName: "ProducerRating");

            migrationBuilder.AddColumn<double>(
                name: "DjRating",
                table: "Users",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "DjRating", "ProducerRating" },
                values: new object[] { 4.2999999999999998, 3.7000000000000002 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "DjRating", "ProducerRating" },
                values: new object[] { 0.0, 4.0 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277"),
                columns: new[] { "DjRating", "ProducerRating" },
                values: new object[] { 4.7000000000000002, 0.0 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                columns: new[] { "DjRating", "ProducerRating" },
                values: new object[] { 4.2000000000000002, 4.5999999999999996 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "DjRating", "ProducerRating" },
                values: new object[] { 4.0, 0.0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DjRating",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "ProducerRating",
                table: "Users",
                newName: "Rating");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "Rating",
                value: 4.2999999999999998);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "Rating",
                value: 0.0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3ed3c11d-f4ad-4749-b30b-6466e9e40277"),
                column: "Rating",
                value: 4.7000000000000002);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "Rating",
                value: 4.2000000000000002);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "Rating",
                value: 4.0);
        }
    }
}
