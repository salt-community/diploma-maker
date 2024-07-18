using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TrackController : Controller
{
    private readonly TrackService _trackservice;

    public TrackController(TrackService trackservice)
    {
        _trackservice = trackservice;
    }

    [HttpGet]
    public async Task<List<Track>> GetTracks() => await _trackservice.GetAllTracks();

}