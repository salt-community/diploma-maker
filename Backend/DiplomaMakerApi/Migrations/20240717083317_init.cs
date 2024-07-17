using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DiplomaMakerApi.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TemplateStyles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    XPos = table.Column<double>(type: "double precision", nullable: true),
                    YPos = table.Column<double>(type: "double precision", nullable: true),
                    Width = table.Column<double>(type: "double precision", nullable: true),
                    Height = table.Column<double>(type: "double precision", nullable: true),
                    FontSize = table.Column<double>(type: "double precision", nullable: true),
                    FontColor = table.Column<string>(type: "text", nullable: true),
                    FontName = table.Column<string>(type: "text", nullable: true),
                    Alignment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateStyles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiplomaTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Footer = table.Column<string>(type: "text", nullable: false),
                    FooterStylingId = table.Column<int>(type: "integer", nullable: true),
                    Intro = table.Column<string>(type: "text", nullable: false),
                    IntroStylingId = table.Column<int>(type: "integer", nullable: true),
                    Main = table.Column<string>(type: "text", nullable: false),
                    MainStylingId = table.Column<int>(type: "integer", nullable: true),
                    Link = table.Column<string>(type: "text", nullable: false),
                    LinkStylingId = table.Column<int>(type: "integer", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiplomaTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiplomaTemplates_TemplateStyles_FooterStylingId",
                        column: x => x.FooterStylingId,
                        principalTable: "TemplateStyles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DiplomaTemplates_TemplateStyles_IntroStylingId",
                        column: x => x.IntroStylingId,
                        principalTable: "TemplateStyles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DiplomaTemplates_TemplateStyles_LinkStylingId",
                        column: x => x.LinkStylingId,
                        principalTable: "TemplateStyles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DiplomaTemplates_TemplateStyles_MainStylingId",
                        column: x => x.MainStylingId,
                        principalTable: "TemplateStyles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Bootcamps",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuidId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    GraduationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DiplomaTemplateId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bootcamps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bootcamps_DiplomaTemplates_DiplomaTemplateId",
                        column: x => x.DiplomaTemplateId,
                        principalTable: "DiplomaTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GuidId = table.Column<Guid>(type: "uuid", nullable: false),
                    VerificationCode = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    BootcampId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Students_Bootcamps_BootcampId",
                        column: x => x.BootcampId,
                        principalTable: "Bootcamps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bootcamps_DiplomaTemplateId",
                table: "Bootcamps",
                column: "DiplomaTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Bootcamps_Name",
                table: "Bootcamps",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiplomaTemplates_FooterStylingId",
                table: "DiplomaTemplates",
                column: "FooterStylingId");

            migrationBuilder.CreateIndex(
                name: "IX_DiplomaTemplates_IntroStylingId",
                table: "DiplomaTemplates",
                column: "IntroStylingId");

            migrationBuilder.CreateIndex(
                name: "IX_DiplomaTemplates_LinkStylingId",
                table: "DiplomaTemplates",
                column: "LinkStylingId");

            migrationBuilder.CreateIndex(
                name: "IX_DiplomaTemplates_MainStylingId",
                table: "DiplomaTemplates",
                column: "MainStylingId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_BootcampId",
                table: "Students",
                column: "BootcampId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Bootcamps");

            migrationBuilder.DropTable(
                name: "DiplomaTemplates");

            migrationBuilder.DropTable(
                name: "TemplateStyles");
        }
    }
}
