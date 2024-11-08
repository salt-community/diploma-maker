using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi._2.Database;
using DiplomaMakerApi._2.Dto;
using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrackController(
    DiplomaMakerContext _context,
    IMapper _mapper
) : ControllerBase
{
    [HttpGet("GetTracks")]
    [ProducesResponseType<List<TrackDto>>(StatusCodes.Status200OK)]
    public List<TrackDto> GetTracks() =>
        _mapper.Map<List<TrackDto>>(_context.Tracks);

    [HttpPost("PostTrack")]
    [ProducesResponseType<TrackDto>(StatusCodes.Status200OK)]
    public TrackDto PostTrack(TrackDto trackDto)
    {
        var track = _mapper.Map<Track>(trackDto);
        _context.Add(track);
        _context.SaveChanges();

        return _mapper.Map<TrackDto>(track);
    }

    // [HttpPut("PutTrack/{guid}")]
    // public ActionResult<TrackDto> PutTrack(string guid)
    // {
    //     var track = _context.Tracks.FirstOrDefault(track => track.Guid.ToString() == guid);

    //     if (track is null)
    //         return NotFound($"Track with guid {guid} could not be found");


    // }

    [HttpDelete("DeleteTrack/{guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteTrack(string guid)
    {
        var track = _context.Tracks.FirstOrDefault(track => track.Guid.ToString() == guid);

        if (track is null)
            return NotFound($"Track with guid {guid} could not be found");

        _context.Remove(track);
        _context.SaveChanges();

        return NoContent();
    }
}