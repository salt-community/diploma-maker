using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Exceptions;


namespace DiplomaMakerApi.Services;


public class StudentService
{
    private readonly DiplomaMakingContext _context;
    private readonly ILogger<StudentService> _logger;
    private readonly HistorySnapshotService _historySnapshotService;

    public StudentService(DiplomaMakingContext context, ILogger<StudentService> logger, HistorySnapshotService historySnapshotService)
    {
        _context = context;
        _logger = logger;
        _historySnapshotService = historySnapshotService;
    }
    public async Task<List<Student>> ReplaceStudents(BootcampRequestUpdateDto requestDto, Guid BootcampGuidId)
    {
        var bootcamp = await _context.Bootcamps.Include(b => b.Students)
                .FirstOrDefaultAsync(b => b.GuidId == BootcampGuidId)
                ?? throw new Exception($"Bootcamp with ID {BootcampGuidId} does not exist");
        
        if (requestDto.students.Count == 0)
        {
            throw new NotFoundByGuidException("You need to add students to perform this update"); 
        }

        _context.Students.RemoveRange(bootcamp.Students);
        await _context.SaveChangesAsync();

        var Students = new List<Student>();
        foreach (var Student in requestDto.students)
        {
                var newStudent = new Student
                {
                    GuidId = Student.GuidId,
                    Name = Student.Name,
                    Email = Student.Email,
                    Bootcamp = bootcamp,
                    VerificationCode = Student.VerificationCode,
                    LastGenerated = DateTime.UtcNow,
                };
                _context.Students.Add(newStudent);
                Students.Add(newStudent);
        }
        await _context.SaveChangesAsync();

        await _historySnapshotService.CreateHistorySnapshotFromBootcamp(requestDto, bootcamp);

        return Students;
    }
    public async Task<List<Student>> GetAllStudents(){
        return await _context.Students
            .Include(s => s.Bootcamp)
            .ToListAsync();
    }

    public async Task<List<Student>> GetStudentsByKeyword(string keyword){
        keyword = keyword.ToLower();
        var Students = await _context.Students
            .Include(d => d.Bootcamp)
            .Where(d => d.Name.ToLower().Contains(keyword) 
                || d.Bootcamp.Track.Name.Contains(keyword))
            .ToListAsync();
        return Students;
    }

    public async Task<Student?> GetStudentByGuidId(Guid guidId)
    {
        var Student = await _context.Students
            .Include(d => d.Bootcamp)
            .FirstOrDefaultAsync(b => b.GuidId == guidId);

        return Student ?? throw new NotFoundByGuidException("Student", guidId);
    }

    public async Task<Student?> GetStudentByVerificationCode(string verificationCode)
    {
        var Student = await _context.Students
            .Include(d => d.Bootcamp)
            .FirstOrDefaultAsync(b => b.VerificationCode == verificationCode);
        return Student;
    }

    public async Task<Student> DeleteStudentByGuidId(Guid guidId)
    {
        var Student = await _context.Students.
            FirstOrDefaultAsync(b => b.GuidId == guidId)
            ?? throw new NotFoundByGuidException("Student", guidId);

        _ = _context.Students.Remove(Student);
        await _context.SaveChangesAsync();
        return Student;
    }
    public async Task<Student> UpdateStudent(Guid GuidID, StudentUpdateRequestDto updateDto)
    {
        var Student = await _context.Students.FirstOrDefaultAsync(b => b.GuidId == GuidID);

        if (Student == null) 
        {
            throw new NotFoundByGuidException("Student", GuidID);    
        } 
        
        Student.Name = updateDto.Name;
        Student.Email = updateDto.Email;
        await _context.SaveChangesAsync();
        return Student;
        
    }
    
}


