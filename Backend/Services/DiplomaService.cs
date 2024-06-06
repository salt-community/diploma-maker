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

    public async Task<Diploma> PostDiploma(DiplomaRequestDto requestDto)
    {

        var bootcamp = await _context.Bootcamp
            .FirstOrDefaultAsync(b => b.GuidId.ToString() == requestDto.BootcampGuidId)
            ?? throw new BootcampNotFoundException("Bootcamp you are trying to add this diploma to, does not exist");
        
        var existingDiploma = await _context.Diploma
            .FirstOrDefaultAsync(d => d.StudentName == requestDto.StudentName
            && d.Bootcamp.GuidId == bootcamp.GuidId);
        if (existingDiploma != null)
            throw new DiplomaExistsException("This student has already earned a diploma in this bootcamp");

        var diploma = new Diploma
        { 
            StudentName = requestDto.StudentName, 
            GraduationDate = requestDto.GraduationDate,
            Bootcamp = bootcamp 
        };
        _context.Diploma.Add(diploma);
        await _context.SaveChangesAsync();

        return diploma;
    }

    public async Task<List<Diploma>> GetDiplomas(){
        return await _context.Diploma
            .Include(d => d.Bootcamp)
            .ToListAsync();

    }

    public async Task<List<Diploma>> GetDiplomasByKeyword(string keyword){
        keyword = keyword.ToLower();
        var diplomas = await _context.Diploma
            .Include(d => d.Bootcamp)
            .Where(d => d.StudentName.ToLower().Contains(keyword) 
                || d.Bootcamp.Name.ToLower().Contains(keyword))
            .ToListAsync();
        return diplomas;
    }


    public async Task<Diploma> DeleteDiplomaByGuidId(string guidId)
    {
        var diploma = await _context.Diploma.
            FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId)
            ?? throw new BootcampNotFoundException("this bootcamp does not exist");

        _ = _context.Diploma.Remove(diploma);
        await _context.SaveChangesAsync();
        return diploma;
    }
}

public class BootcampNotFoundException : Exception
{
    public BootcampNotFoundException(string message) : base(message) { }
}

public class DiplomaExistsException : Exception
{
    public DiplomaExistsException(string message) : base(message) { }
}