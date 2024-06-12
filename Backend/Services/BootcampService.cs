using Microsoft.EntityFrameworkCore;
using Backend.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Backend.Services;

public class BootcampService
{
    private readonly DiplomaMakingContext _context;
    private readonly IMapper _mapper;


    public BootcampService(DiplomaMakingContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Bootcamp> PostBootcamp(Bootcamp bootcamp)
    {
        var existingBootcamp = await _context.Bootcamp
            .FirstOrDefaultAsync(b => b.Name == bootcamp.Name);
        if (existingBootcamp != null)
            throw new ArgumentException("Bootcamp with this name exists");

        bootcamp.GuidId = Guid.NewGuid();
        _context.Bootcamp.Add(bootcamp);
        await _context.SaveChangesAsync();

        return bootcamp;
    }

    public async Task<List<Bootcamp>> GetBootcamps()
    {
        return await _context.Bootcamp
            .Include(b => b.Diplomas)
            .ToListAsync();
    }


    public async Task<Bootcamp?> GetBootcampByGuidId(string guidId)
    {
        var bootcamp = await _context.Bootcamp
            .Include(b => b.Diplomas)
            .FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId);
        return bootcamp;

    }

    public async Task<Bootcamp> DeleteBootcampByGuidId(string guidId)
    {
        var bootcamp = await _context.Bootcamp.
            FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId)
            ?? throw new ArgumentException("Bootcamp does not exist");

        _ = _context.Bootcamp.Remove(bootcamp);
        await _context.SaveChangesAsync();
        return bootcamp;
    }

    public async Task PutBootcamp(string guidId, BootcampRequestDto requestDto)
    {
        var bootcamp = await _context.Bootcamp
            .FirstOrDefaultAsync(b => b.GuidId == requestDto.GuidId);
        if(bootcamp == null)
            throw new ArgumentException("Bootcamp not found");

        bootcamp.Name = requestDto.Name;
        bootcamp.StartDate = requestDto.StartDate;
        bootcamp.GraduationDate = requestDto.GraduationDate;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException("Failed to save changes");
        }
    }

    private bool BootcampExists(int id)
    {
        return _context.Bootcamp.Any(e => e.Id == id);
    }


}