using AutoMapper;
using DiplomaMakerApi.Models;

namespace JokesAPI.Configuration;
public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampRequestDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampResponseDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampInDiplomaDto, Bootcamp>().ReverseMap();
        CreateMap<DiplomaRequestDto, Student>().ReverseMap();
        CreateMap<DiplomaResponseDto, Student>().ReverseMap();
        CreateMap<DiplomaInBootcampDto, Student>().ReverseMap();
        CreateMap<TemplateResponseDto, TemplateStyle>().ReverseMap();
        CreateMap<DiplomaPutRequestDto, Student>().ReverseMap();
    }
}