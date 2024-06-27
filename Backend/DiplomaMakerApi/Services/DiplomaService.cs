
using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos;

namespace DiplomaMakerApi.Services;

public class DiplomaService
{
    private readonly DiplomaMakingContext _context;
    private readonly ILogger<DiplomaService> _logger;


    public DiplomaService(DiplomaMakingContext context, ILogger<DiplomaService> logger)
    {
        _context = context;
        _logger = logger;
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
            Bootcamp = bootcamp 
        };
        _context.Diploma.Add(diploma);
        await _context.SaveChangesAsync();

        return diploma;
    }
    // <-- THIS
    public async Task<List<Diploma>> PostDiplomas(DiplomasRequestDto requestDto)
    {
        var diplomas = new List<Diploma>();
        foreach (var diplomaDto in requestDto.Diplomas)
        {
            var bootcamp = await _context.Bootcamp
                .FirstOrDefaultAsync(b => b.GuidId.ToString() == diplomaDto.BootcampGuidId)
                ?? throw new BootcampNotFoundException($"Bootcamp with ID {diplomaDto.BootcampGuidId} does not exist");
            _logger.LogInformation("thus far good");
            var existingDiploma = await _context.Diploma
                .FirstOrDefaultAsync(d => d.GuidId == diplomaDto.GuidId);

            if (existingDiploma != null)
            {
                existingDiploma.StudentName = diplomaDto.StudentName;
                existingDiploma.Bootcamp = bootcamp;
                _context.Diploma.Update(existingDiploma);
                diplomas.Add(existingDiploma);
            }
            else
            {
                var newDiploma = new Diploma
                {
                    GuidId = diplomaDto.GuidId,
                    StudentName = diplomaDto.StudentName,
                    Bootcamp = bootcamp
                };
                _context.Diploma.Add(newDiploma);
                diplomas.Add(newDiploma);
            }
        }

        await _context.SaveChangesAsync();

        return diplomas;
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

    public async Task<Diploma?> GetDiplomaByGuidId(string guidId)
    {
        var diploma = await _context.Diploma
            .Include(d => d.Bootcamp)
            .FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId);
        return diploma;
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
    public async Task<Diploma> UpdateDiploma(Diploma updateRequest)
    {
        var diploma = await _context.Diploma.FirstOrDefaultAsync(b => b.GuidId == updateRequest.GuidId);

        if (diploma != null)
        {
            diploma.StudentName = updateRequest.StudentName;
            diploma.EmailAddress = updateRequest.EmailAddress;

            await _context.SaveChangesAsync();
            return diploma;
        }
        throw new BootcampNotFoundException("This diploma does not exist");
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