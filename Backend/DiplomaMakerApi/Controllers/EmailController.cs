namespace DiplomaMakerApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Services;


[Route("api/[controller]")]
[ApiController]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("{guidID}")]
    public async Task<IActionResult> SendEmail(IFormFile file, Guid guidID)
    {
        try
        {
            await _emailService.SendEmailWithAttachmentAsync(guidID, file);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok("The Diploma has been successfully sent to your email");
    }
}

