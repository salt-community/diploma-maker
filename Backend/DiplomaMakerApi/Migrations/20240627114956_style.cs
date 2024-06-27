using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiplomaMakerApi.Migrations
{
    /// <inheritdoc />
    public partial class style : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Style",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    XPos = table.Column<double>(type: "float", nullable: true),
                    YPos = table.Column<double>(type: "float", nullable: true),
                    Width = table.Column<double>(type: "float", nullable: true),
                    Height = table.Column<double>(type: "float", nullable: true),
                    FontSize = table.Column<double>(type: "float", nullable: true),
                    FontColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FontName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Alignment = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Style", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Template",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    templateName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    footer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    footerStylingId = table.Column<int>(type: "int", nullable: true),
                    intro = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    introStylingId = table.Column<int>(type: "int", nullable: true),
                    main = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    mainStylingId = table.Column<int>(type: "int", nullable: true),
                    basePdf = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Template", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Template_Style_footerStylingId",
                        column: x => x.footerStylingId,
                        principalTable: "Style",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Template_Style_introStylingId",
                        column: x => x.introStylingId,
                        principalTable: "Style",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Template_Style_mainStylingId",
                        column: x => x.mainStylingId,
                        principalTable: "Style",
                        principalColumn: "Id");
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
                    EmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
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

            migrationBuilder.CreateIndex(
                name: "IX_Template_footerStylingId",
                table: "Template",
                column: "footerStylingId");

            migrationBuilder.CreateIndex(
                name: "IX_Template_introStylingId",
                table: "Template",
                column: "introStylingId");

            migrationBuilder.CreateIndex(
                name: "IX_Template_mainStylingId",
                table: "Template",
                column: "mainStylingId");
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

            migrationBuilder.DropTable(
                name: "Style");
        }
    }
}
