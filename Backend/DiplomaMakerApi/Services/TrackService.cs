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

    public Task<List<Track>> GetAllTracks() => _context.Tracks.ToListAsync();

}