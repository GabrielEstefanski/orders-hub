using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace OrdersAPI.Core.DTOs.Request
{
    public class RegisterRequestDTO
    {
        [Required(ErrorMessage = "O nome é obrigatório")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve ter entre 3 e 100 caracteres")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "O email é obrigatório")]
        [EmailAddress(ErrorMessage = "Formato de email inválido")]
        [StringLength(100, ErrorMessage = "O email deve ter no máximo 100 caracteres")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "A senha deve ter entre 8 e 100 caracteres")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
            ErrorMessage = "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial")]
        public required string Password { get; set; }

        [Compare("Password", ErrorMessage = "As senhas não conferem")]
        [Required(ErrorMessage = "A confirmação de senha é obrigatória")]
        public required string ConfirmPassword { get; set; }

        public IFormFile? ProfilePhoto { get; set; }
    }
} 