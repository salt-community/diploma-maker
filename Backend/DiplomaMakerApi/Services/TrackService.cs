using DiplomaMakerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services;

public class TrackService
{
    private readonly DiplomaMakingContext _context;

    public TrackService(DiplomaMakingContext context)
    {
        _context = context;
    }

    public async Task<List<Track>> GetAllTracks() => await _context.Tracks
        .Include(t => t.Bootcamps)
        .ThenInclude(b=>b.Students)
        .ToListAsync();

}