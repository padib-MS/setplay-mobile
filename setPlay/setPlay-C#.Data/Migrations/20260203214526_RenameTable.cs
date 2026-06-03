using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GigProducers");

            migrationBuilder.CreateTable(
                name: "GigSavedByUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    GigId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GigSavedByUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GigSavedByUsers_Gigs_GigId",
                        column: x => x.GigId,
                        principalTable: "Gigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GigSavedByUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "GigSavedByUsers",
                columns: new[] { "Id", "GigId", "UserId" },
                values: new object[,]
                {
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1"), new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"), new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2"), new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"), new Guid("44444444-4444-4444-4444-444444444444") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_GigSavedByUsers_GigId",
                table: "GigSavedByUsers",
                column: "GigId");

            migrationBuilder.CreateIndex(
                name: "IX_GigSavedByUsers_UserId",
                table: "GigSavedByUsers",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GigSavedByUsers");

            migrationBuilder.CreateTable(
                name: "GigProducers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    GigId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ProducerId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GigProducers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GigProducers_Gigs_GigId",
                        column: x => x.GigId,
                        principalTable: "Gigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GigProducers_Users_ProducerId",
                        column: x => x.ProducerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "GigProducers",
                columns: new[] { "Id", "GigId", "ProducerId" },
                values: new object[,]
                {
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1"), new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"), new Guid("33333333-3333-3333-3333-333333333333") },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2"), new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"), new Guid("44444444-4444-4444-4444-444444444444") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_GigProducers_GigId",
                table: "GigProducers",
                column: "GigId");

            migrationBuilder.CreateIndex(
                name: "IX_GigProducers_ProducerId",
                table: "GigProducers",
                column: "ProducerId");
        }
    }
}
