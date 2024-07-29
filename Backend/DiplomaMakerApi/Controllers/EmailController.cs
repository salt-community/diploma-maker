namespace DiplomaMakerApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Models;

[Route("api/[controller]")]
[ApiController]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("email-student/{guidID}")]
    public async Task<IActionResult> SendEmailToStudent( Guid guidID, SendEmailRequest req)
    {
        try
        {
            await _emailService.SendEmailWithAttachmentAsync(guidID, req.File, req.Email, req.Password);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok("The Diploma has been successfully sent to your email");
    }
    
}

