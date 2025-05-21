using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class permiresimtableusers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_Sale_User_User_ID",
                table: "Cars_Sale");

            migrationBuilder.DropIndex(
                name: "IX_Cars_Sale_User_ID",
                table: "Cars_Sale");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User",
                table: "User");

            migrationBuilder.DropColumn(
                name: "User_ID",
                table: "Cars_Sale");

            migrationBuilder.DropColumn(
                name: "Contact_number",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "User");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "Users");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Users",
                newName: "Phone");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "User_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "User");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "User",
                newName: "Password");

            migrationBuilder.AddColumn<int>(
                name: "User_ID",
                table: "Cars_Sale",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contact_number",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "User",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User",
                table: "User",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Cars_Sale_User_ID",
                table: "Cars_Sale",
                column: "User_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_Sale_User_User_ID",
                table: "Cars_Sale",
                column: "User_ID",
                principalTable: "User",
                principalColumn: "User_ID");
        }
    }
}
