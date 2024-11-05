using System.Text;
using DiplomaMakerApi.Dtos;

namespace DiplomaMakerApi.Tests.Integration
{
    public static class TestData
    {
        public static byte[] GetFileMockData()
        {
            return Encoding.UTF8.GetBytes("mockData");
        }
        public static TemplateRequestDto getPutTemplateData()
        {
            return new TemplateRequestDto()
            {
                TemplateName = "jfs2025",
                Footer = "has successfully completed\nthe {classname} Bootcamp of \n {datebootcamp} at School of Applied Technology.",
                FooterStyling = new TemplateStyle
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
                Intro = "This certifies that\n",
                IntroStyling = new TemplateStyle
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
                Main = "{studentname}",
                MainStyling = new TemplateStyle
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
                BasePdf = "data:application/pdf;base64,testdata",
            };
        }
    }
}