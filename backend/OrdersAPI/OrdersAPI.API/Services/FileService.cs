public class FileService : IFileService
{
    private readonly string _uploadDirectory;
    private readonly IConfiguration _configuration;

    public FileService(IWebHostEnvironment environment, IConfiguration configuration)
    {
        _configuration = configuration;
        var uploadPath = configuration["UploadSettings:Path"];
        if (string.IsNullOrEmpty(uploadPath))
        {
            throw new ArgumentException("Upload path não configurado");
        }

        _uploadDirectory = uploadPath;
        
        var profilesPath = Path.Combine(_uploadDirectory, "profiles");
        Directory.CreateDirectory(profilesPath);
    }

    public async Task<string> SaveProfilePhotoAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return null;

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
        {
            throw new InvalidOperationException("Tipo de arquivo não permitido");
        }

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var profilesPath = Path.Combine(_uploadDirectory, "profiles");
        var filePath = Path.Combine(profilesPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileInfo = new FileInfo(filePath);
        fileInfo.Attributes &= ~FileAttributes.ReadOnly;

        return $"/uploads/profiles/{fileName}";
    }
}