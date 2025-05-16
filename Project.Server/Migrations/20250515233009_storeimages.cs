using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class storeimages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImagePath",
                table: "Car_Images",
                newName: "ContentType");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Car_Images",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Car_Images");

            migrationBuilder.RenameColumn(
                name: "ContentType",
                table: "Car_Images",
                newName: "ImagePath");
        }
    }
}
