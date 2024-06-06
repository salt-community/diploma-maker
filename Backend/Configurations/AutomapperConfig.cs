using AutoMapper;
using Backend.Models;

namespace JokesAPI.Configuration;
public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampRequestDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampResponseDto, Bootcamp>().ReverseMap();
        CreateMap<DiplomaRequestDto, Bootcamp>().ReverseMap();
        CreateMap<DiplomaResponseDto, Bootcamp>().ReverseMap();
    }
}