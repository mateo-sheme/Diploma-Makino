using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class permiresimtableusrsdheshtimiuseridtecars : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "User_ID",
                table: "Cars_Sale",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Cars_Sale_User_ID",
                table: "Cars_Sale",
                column: "User_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_Sale_Users_User_ID",
                table: "Cars_Sale",
                column: "User_ID",
                principalTable: "Users",
                principalColumn: "User_ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_Sale_Users_User_ID",
                table: "Cars_Sale");

            migrationBuilder.DropIndex(
                name: "IX_Cars_Sale_User_ID",
                table: "Cars_Sale");

            migrationBuilder.DropColumn(
                name: "User_ID",
                table: "Cars_Sale");
        }
    }
}
