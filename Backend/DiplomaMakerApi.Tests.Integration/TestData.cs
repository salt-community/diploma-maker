using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Tests.Integration
{
    public static class TestData
    {
        public static TemplateRequestDto getPutTemplateData()
        {
            return new TemplateRequestDto()
            {
                templateName = "jfs2025",
                footer = "has successfully completed\nthe {classname} Bootcamp of \n {datebootcamp} at School of Applied Technology.",
                footerStyling = new TemplateStyle
                {
                    XPos = 41.17,
                    YPos = 165.35,
                    Width = 145.76,
                    Height = 21.08,
                    FontSize = 16,
                    FontColor = "#8100ff",
                    FontName = "notoSerifJP-regular",
                    Alignment = "center"
                },
                intro = "This certifies that\n",
                introStyling = new TemplateStyle
                {
                    XPos = 83.106014341953,
                    YPos = 115.83,
                    Width = 48.13,
                    Height = 10.23,
                    FontSize = 16,
                    FontColor = "#ffffff",
                    FontName = "notoSerifJP-regular-italic",
                    Alignment = "center"
                },
                main = "{studentname}",
                mainStyling = new TemplateStyle
                {
                    XPos = 43.28,
                    YPos = 42.76,
                    Width = 145.76,
                    Height = 16.83,
                    FontSize = 33,
                    FontColor = "#ffffff",
                    FontName = "futura",
                    Alignment = "left"
                },
                Link = "{Id}",
                LinkStyling = new TemplateStyle
                {
                    XPos = 190,
                    YPos = 290,
                    Width = 20,
                    Height = 8,
                    FontSize = 14,
                    FontColor = "#ffffff",
                    FontName = "notoSerifJP-regular",
                    Alignment = "center"
                },
                basePdf = "data:application/pdf;base64,testdata",
            };
        }
    }
}