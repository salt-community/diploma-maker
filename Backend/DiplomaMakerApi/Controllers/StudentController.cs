using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Models;
using AutoMapper;
using DiplomaMakerApi.Services;

namespace StudentMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StudentsController(StudentService service, IMapper mapper) : ControllerBase
{
    private readonly StudentService _service = service;
    private readonly IMapper _mapper = mapper;

    [HttpPost]
    public async Task<ActionResult<List<StudentResponseDto>>> PostStudents(StudentsRequestDto requestDto)
    {
        try
        {
            var Students = await _service.ReplaceStudents(requestDto);
            var responseDtos = Students.Select(d => _mapper.Map<StudentResponseDto>(d)).ToList();
            return CreatedAtAction(nameof(GetStudents), responseDtos);
      
        }
        catch (StudentNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (StudentExistsException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{GuidID}")]
    public async Task<ActionResult<StudentResponseDto>> UpdateStudents(Guid GuidID, StudentUpdateRequestDto updateDto)
    {
        try
        {
            var updatedStudent = await _service.UpdateStudent(GuidID, updateDto);
            if (updatedStudent == null)
            {
                return NotFound("Student not found");
            }
            var responseDto = _mapper.Map<StudentResponseDto>(updatedStudent);
            return Ok(responseDto);
        }
        catch (StudentNotFoundException)
        {
            return NotFound("Bootcamp not found");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<StudentResponseDto>>> GetStudents([FromQuery] string keyword = "")
    {
        List<Student> students;

        if (string.IsNullOrWhiteSpace(keyword))
        {
            students = await _service.GetAllStudents();
        }
        else
        {
            students = await _service.GetStudentsByKeyword(keyword);
        }

        var studentResponseDtos = _mapper.Map<List<StudentResponseDto>>(students);
        return Ok(studentResponseDtos);
    }

    [HttpGet("{guidId}")]
    public async Task<ActionResult<StudentResponseDto>> GetStudentByGuidId(string guidId)
    {
        var Student = await _service.GetStudentByGuidId(guidId);
        if (Student == null)
            return NotFound();
        var responseDto = _mapper.Map<StudentResponseDto>(Student);

        return responseDto;
    }

    // DELETE: api/Student/5
    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteStudent(string guidId)
    {
        try
        {
            await _service.DeleteStudentByGuidId(guidId);
        }
        catch(StudentNotFoundException)
        {
            return NotFound("Bootcamp not found");
        }

        return NoContent();
    }

}

