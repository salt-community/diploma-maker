using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dtos.UserFont
{
    public class UserFontRequestDto
    {
        public required string Name { get; set; }
        public required FontType FontType { get; set; }
        public string FileName
        {
            get
            {
                if(FontType == FontType.regular){
                    return Name;
                }
                else{
                    return $"{Name}-{FontType}";
                }
            }
        }
        public required IFormFile File { get; set; }
    }
}