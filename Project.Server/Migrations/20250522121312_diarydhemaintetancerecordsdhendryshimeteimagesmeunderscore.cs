using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class diarydhemaintetancerecordsdhendryshimeteimagesmeunderscore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsPrimary",
                table: "Car_Images",
                newName: "Is_Primary");

            migrationBuilder.RenameColumn(
                name: "ImageData",
                table: "Car_Images",
                newName: "Image_Data");

            migrationBuilder.RenameColumn(
                name: "ContentType",
                table: "Car_Images",
                newName: "Content_Type");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Car_Images",
                newName: "Image_ID");

            migrationBuilder.CreateTable(
                name: "Diary_Car",
                columns: table => new
                {
                    User_Car_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_ID = table.Column<int>(type: "int", nullable: false),
                    VIN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    License_Plate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Current_Kilometers = table.Column<int>(type: "int", nullable: false),
                    Fuel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Car_Image = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Content_Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Insurance_Expiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Inspection_Expiry = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diary_Car", x => x.User_Car_ID);
                    table.ForeignKey(
                        name: "FK_Diary_Car_Users_User_ID",
                        column: x => x.User_ID,
                        principalTable: "Users",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Maintenance_Record",
                columns: table => new
                {
                    Record_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Car_ID = table.Column<int>(type: "int", nullable: false),
                    Record_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Kilometers = table.Column<int>(type: "int", nullable: false),
                    Maintenance_Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Next_Maintenance_Km = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maintenance_Record", x => x.Record_ID);
                    table.ForeignKey(
                        name: "FK_Maintenance_Record_Diary_Car_User_Car_ID",
                        column: x => x.User_Car_ID,
                        principalTable: "Diary_Car",
                        principalColumn: "User_Car_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Diary_Car_User_ID",
                table: "Diary_Car",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Maintenance_Record_User_Car_ID",
                table: "Maintenance_Record",
                column: "User_Car_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Maintenance_Record");

            migrationBuilder.DropTable(
                name: "Diary_Car");

            migrationBuilder.RenameColumn(
                name: "Is_Primary",
                table: "Car_Images",
                newName: "IsPrimary");

            migrationBuilder.RenameColumn(
                name: "Image_Data",
                table: "Car_Images",
                newName: "ImageData");

            migrationBuilder.RenameColumn(
                name: "Content_Type",
                table: "Car_Images",
                newName: "ContentType");

            migrationBuilder.RenameColumn(
                name: "Image_ID",
                table: "Car_Images",
                newName: "ID");
        }
    }
}
