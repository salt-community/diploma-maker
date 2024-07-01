using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;


public class StudentService
{
    private readonly DiplomaMakingContext _context;
    private readonly ILogger<StudentService> _logger;


    public StudentService(DiplomaMakingContext context, ILogger<StudentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Student> PostStudent(StudentRequestDto requestDto)
    {

        var bootcamp = await _context.Bootcamps
            .FirstOrDefaultAsync(b => b.GuidId.ToString() == requestDto.BootcampGuidId)
            ?? throw new BootcampNotFoundException("Bootcamp you are trying to add this Student to, does not exist");
        
        var existingStudent = await _context.Students
            .FirstOrDefaultAsync(s => s.Name == requestDto.Name
            && s.Bootcamp.GuidId == bootcamp.GuidId);
        if (existingStudent != null)
            throw new StudentExistsException("This student has already earned a Student in this bootcamp");

        var Student = new Student
        { 
            Name = requestDto.Name, 
            Bootcamp = bootcamp 
        };
        _context.Students.Add(Student);
        await _context.SaveChangesAsync();

        return Student;
    }
    public async Task<List<Student>> PostStudents(List<StudentRequestDto> requestDto)
    {
        var Students = new List<Student>();
        foreach (var StudentDto in requestDto)
        {
            var bootcamp = await _context.Bootcamps
                .FirstOrDefaultAsync(b => b.GuidId.ToString() == StudentDto.BootcampGuidId)
                ?? throw new BootcampNotFoundException($"Bootcamp with ID {StudentDto.BootcampGuidId} does not exist");
            
            var existingStudent = await _context.Students
                .FirstOrDefaultAsync(d => d.GuidId == StudentDto.GuidId);

            if (existingStudent != null)
            {
                existingStudent.Name = StudentDto.Name;
                existingStudent.Bootcamp = bootcamp;
                existingStudent.Email = StudentDto.Email;
                _context.Students.Update(existingStudent);
                Students.Add(existingStudent);
            }
            else
            {
                var newStudent = new Student
                {
                    GuidId = StudentDto.GuidId,
                    Name = StudentDto.Name,
                    Bootcamp = bootcamp
                };
                _context.Students.Add(newStudent);
                Students.Add(newStudent);
            }
        }

        await _context.SaveChangesAsync();

        return Students;
    }
    public async Task<List<Student>> GetStudents(){
        return await _context.Students
            .Include(s => s.Bootcamp)
            .ToListAsync();

    }

    public async Task<List<Student>> GetStudentsByKeyword(string keyword){
        keyword = keyword.ToLower();
        var Students = await _context.Students
            .Include(d => d.Bootcamp)
            .Where(d => d.Name.ToLower().Contains(keyword) 
                || d.Bootcamp.Name.ToLower().Contains(keyword))
            .ToListAsync();
        return Students;
    }

    public async Task<Student?> GetStudentByGuidId(string guidId)
    {
        var Student = await _context.Students
            .Include(d => d.Bootcamp)
            .FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId);
        return Student;
    }

    public async Task<Student> DeleteStudentByGuidId(string guidId)
    {
        var Student = await _context.Students.
            FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId)
            ?? throw new BootcampNotFoundException("this bootcamp does not exist");

        _ = _context.Students.Remove(Student);
        await _context.SaveChangesAsync();
        return Student;
    }


}

public class BootcampNotFoundException : Exception
{
    public BootcampNotFoundException(string message) : base(message) { }
}

public class StudentExistsException : Exception
{
    public StudentExistsException(string message) : base(message) { }
}