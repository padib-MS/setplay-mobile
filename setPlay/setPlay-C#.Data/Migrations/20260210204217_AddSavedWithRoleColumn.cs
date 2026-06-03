using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSavedWithRoleColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SavedWithRole",
                table: "GigSavedByUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "GigSavedByUsers",
                keyColumn: "Id",
                keyValue: new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1"),
                column: "SavedWithRole",
                value: 1);

            migrationBuilder.UpdateData(
                table: "GigSavedByUsers",
                keyColumn: "Id",
                keyValue: new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2"),
                column: "SavedWithRole",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "Avatar",
                value: "https://randomuser.me/api/portraits/women/3.jpg");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SavedWithRole",
                table: "GigSavedByUsers");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "Avatar",
                value: "https://i.pravatar.cc/300?img=8");
        }
    }
}
