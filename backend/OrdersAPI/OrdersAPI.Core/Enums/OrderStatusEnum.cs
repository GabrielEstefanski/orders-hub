using System.ComponentModel.DataAnnotations;

namespace OrdersAPI.Core.Enums
{
    public enum OrderStatusEnum
    {
        [Display(Name = "Pendente")]
        Pendente = 0,

        [Display(Name = "Processando")]
        Processando = 1,

        [Display(Name = "Finalizado")]
        Finalizado = 2
    }
}
