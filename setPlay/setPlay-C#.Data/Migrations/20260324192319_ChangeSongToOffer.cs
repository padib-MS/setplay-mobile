using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeSongToOffer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                 name: "FK_Offers_Songs_SongId",
                 table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_SongId",
                table: "Offers");

            migrationBuilder.CreateIndex(
      name: "IX_Offers_SongId",
      table: "Offers",
      column: "SongId");

            migrationBuilder.AddForeignKey(
    name: "FK_Offers_Songs_SongId",
    table: "Offers",
    column: "SongId",
    principalTable: "Songs",
    principalColumn: "Id",
    onDelete: ReferentialAction.Cascade);

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                column: "BpmRangeEnd",
                value: 125);

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                column: "BpmRangeStart",
                value: 120);


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
            name: "FK_Offers_Songs_SongId",
            table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_SongId",
                table: "Offers");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_SongId",
                table: "Offers",
                column: "SongId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Songs_SongId",
                table: "Offers",
                column: "SongId",
                principalTable: "Songs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                column: "BpmRangeEnd",
                value: 128);

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                column: "BpmRangeStart",
                value: 128);
        }
    }
}
