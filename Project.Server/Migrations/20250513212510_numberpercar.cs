using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class numberpercar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_Sale_User_User_ID",
                table: "Cars_Sale");

            migrationBuilder.AlterColumn<int>(
                name: "User_ID",
                table: "Cars_Sale",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Contact_Number",
                table: "Cars_Sale",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_Sale_User_User_ID",
                table: "Cars_Sale",
                column: "User_ID",
                principalTable: "User",
                principalColumn: "User_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_Sale_User_User_ID",
                table: "Cars_Sale");

            migrationBuilder.DropColumn(
                name: "Contact_Number",
                table: "Cars_Sale");

            migrationBuilder.AlterColumn<int>(
                name: "User_ID",
                table: "Cars_Sale",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_Sale_User_User_ID",
                table: "Cars_Sale",
                column: "User_ID",
                principalTable: "User",
                principalColumn: "User_ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
