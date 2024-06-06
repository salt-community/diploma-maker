using Microsoft.EntityFrameworkCore;
using Backend.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Backend.Services;

public class DiplomaService
{
    private readonly DiplomaMakingContext _context;


    public DiplomaService(DiplomaMakingContext context)
    {
        _context = context;
    }

    public async Task<Diploma> PostDiploma(Diploma diploma, string bootcampGuidId)
    {
        var existingDiploma = await _context.Diploma
            .FirstOrDefaultAsync(d => d.StudentName == d.StudentName 
                && d.Bootcamp.GuidId == diploma.Bootcamp.GuidId);
        if (existingDiploma != null)
            throw new ArgumentException("This student has already earned a diploma in this bootcamp");

        var bootcamp = await _context.Bootcamp
            .FirstOrDefaultAsync(b => b.GuidId.ToString() == bootcampGuidId)
            ?? throw new ArgumentException("Bootcamp you are trying to add this diploma to, does not exist");
        
        diploma.Bootcamp = bootcamp;
        _context.Diploma.Add(diploma);
        await _context.SaveChangesAsync();

        return diploma;
    }

    // public async Task<List<Diploma>> GetBootcamps()
    // {
    //     return await _context.Diploma
    //         .Include(b => b.Diplomas)
    //         .ToListAsync();
    // }
    // public async Task<Diploma> DeleteBootcampByGuidId(string guidId)
    // {
    //     var bootcamp = await _context.Diploma.
    //         FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId);

    //     _ = _context.Diploma.Remove(bootcamp);
    //     await _context.SaveChangesAsync();
    //     return bootcamp;
    // }
}