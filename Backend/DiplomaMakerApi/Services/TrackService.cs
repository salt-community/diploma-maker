using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi.Data;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;

public class TrackService(DiplomaMakingContext _context)
{
    public async Task<List<Track>> GetAllTracks() => await _context.Tracks
        .Include(t => t.Bootcamps)
        .ThenInclude(b => b.Students)
        .Include(t => t.Bootcamps)
        .ThenInclude(b => b.DiplomaTemplate)
        .ToListAsync();

}