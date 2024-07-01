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
    public async Task<ActionResult<List<StudentResponseDto>>> PostStudents(List<StudentRequestDto> requestDto)
    {
        try
        {
            var Students = await _service.PostStudents(requestDto);
            var responseDtos = Students.Select(d => _mapper.Map<StudentResponseDto>(d)).ToList();

            if (responseDtos.Any())
            {
                return CreatedAtAction(nameof(GetStudentByGuidId), new { guidId = responseDtos.First().GuidId }, responseDtos);
            }
            else
            {
                return BadRequest("No Students were created.");
            }
        }
        catch (BootcampNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (StudentExistsException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{guidID}")]
    public async Task<ActionResult<StudentResponseDto>> UpdateStudents(Guid guidID, StudentUpdateRequestDto updateDto)
    {
        try
        {
            var StudentRequest = _mapper.Map<Student>(updateDto);
            var updatedStudent = await _service.UpdateStudent(guidID, StudentRequest);
            if (updatedStudent == null)
            {
                return NotFound("Student not found");
            }
            var responseDto = _mapper.Map<StudentResponseDto>(updatedStudent);
            return Ok(responseDto);
        }
        catch (BootcampNotFoundException)
        {
            return NotFound("Bootcamp not found");
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentResponseDto>>> GetStudents([FromQuery] string keyword = "")
    {
        IEnumerable<Student> students;

        if (string.IsNullOrWhiteSpace(keyword))
        {
            students = await _service.GetStudents();
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
        catch(BootcampNotFoundException)
        {
            return NotFound("Bootcamp not found");
        }

        return NoContent();
    }

}

