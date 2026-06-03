using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRaitingToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Users",
                type: "double",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Users");
        }
    }
}
