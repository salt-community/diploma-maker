using AutoMapper;
using Backend.Models;

namespace JokesAPI.Configuration;
public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampRequestDto, Bootcamp>().ReverseMap();
    }
}