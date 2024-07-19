using AutoMapper;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TracksController : Controller
{
    private readonly TrackService _trackservice;
    private readonly IMapper _mapper;

    public TracksController(TrackService trackservice, IMapper mapper)
    {
        _trackservice = trackservice;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<TracksResponseDto>>> GetTracks(){
      var tracks = await _trackservice.GetAllTracks();
        return _mapper.Map<List<TracksResponseDto>>(tracks);

    } 

}