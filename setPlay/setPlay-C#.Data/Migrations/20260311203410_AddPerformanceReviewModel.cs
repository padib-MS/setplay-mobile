using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceReviewModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GigDjRating",
                table: "Gigs");

            migrationBuilder.DropColumn(
                name: "GigProducerRating",
                table: "Gigs");

            migrationBuilder.CreateTable(
                name: "GigPerformanceReview",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    GigId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    GigDjRating = table.Column<double>(type: "double", nullable: false, defaultValue: 0.0),
                    GigProducerRating = table.Column<double>(type: "double", nullable: false, defaultValue: 0.0),
                    DjNote = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProducerNote = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GigPerformanceReview", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GigPerformanceReview_Gigs_GigId",
                        column: x => x.GigId,
                        principalTable: "Gigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_GigPerformanceReview_GigId",
                table: "GigPerformanceReview",
                column: "GigId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GigPerformanceReview");

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

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                columns: new[] { "GigDjRating", "GigProducerRating" },
                values: new object[] { 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                columns: new[] { "GigDjRating", "GigProducerRating" },
                values: new object[] { 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                columns: new[] { "GigDjRating", "GigProducerRating" },
                values: new object[] { 0.0, 0.0 });
        }
    }
}
