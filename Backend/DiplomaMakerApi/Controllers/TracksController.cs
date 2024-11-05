using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Services;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class TracksController(TrackService _trackservice, IMapper _mapper) : Controller
{
    [HttpGet("GetTracks")]
    public async Task<ActionResult<List<TracksResponseDto>>> GetTracks()
    {
        var tracks = await _trackservice.GetAllTracks();
        return _mapper.Map<List<TracksResponseDto>>(tracks);
    }

}