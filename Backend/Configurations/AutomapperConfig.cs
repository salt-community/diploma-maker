using AutoMapper;
using Backend.Models;

namespace JokesAPI.Configuration;
public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampRequestDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampResponseDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampInDiplomaDto, Bootcamp>().ReverseMap();
        CreateMap<DiplomaRequestDto, Diploma>().ReverseMap();
        CreateMap<DiplomaResponseDto, Diploma>().ReverseMap();
    }
}