using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dtos.UserFont
{
    public class UserFontResponseDto
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
    }
}