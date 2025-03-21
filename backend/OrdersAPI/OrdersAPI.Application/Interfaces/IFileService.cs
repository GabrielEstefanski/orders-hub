using Microsoft.AspNetCore.Http;

public interface IFileService
{
    Task<string> SaveProfilePhotoAsync(IFormFile file);
}