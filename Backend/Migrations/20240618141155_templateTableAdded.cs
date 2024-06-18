using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class templateTableAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Template",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    templateName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    footer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    intro = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    studentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    basePdf = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Template", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Bootcamp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GuidId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    graduationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    templateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bootcamp", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bootcamp_Template_templateId",
                        column: x => x.templateId,
                        principalTable: "Template",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Diploma",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GuidId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BootcampId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diploma", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Diploma_Bootcamp_BootcampId",
                        column: x => x.BootcampId,
                        principalTable: "Bootcamp",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bootcamp_Name",
                table: "Bootcamp",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bootcamp_templateId",
                table: "Bootcamp",
                column: "templateId");

            migrationBuilder.CreateIndex(
                name: "IX_Diploma_BootcampId",
                table: "Diploma",
                column: "BootcampId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Diploma");

            migrationBuilder.DropTable(
                name: "Bootcamp");

            migrationBuilder.DropTable(
                name: "Template");
        }
    }
}
