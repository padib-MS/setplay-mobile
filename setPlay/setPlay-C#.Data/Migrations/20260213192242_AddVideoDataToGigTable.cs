using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace setPlay_C_.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddVideoDataToGigTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "UploadedVideo",
                table: "Gigs",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VideoFileType",
                table: "Gigs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
                columns: new[] { "UploadedVideo", "VideoFileType" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc2"),
                columns: new[] { "UploadedVideo", "VideoFileType" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Gigs",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-ccccccccccc3"),
                columns: new[] { "UploadedVideo", "VideoFileType" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UploadedVideo",
                table: "Gigs");

            migrationBuilder.DropColumn(
                name: "VideoFileType",
                table: "Gigs");
        }
    }
}
