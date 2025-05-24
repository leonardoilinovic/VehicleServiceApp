using System.ComponentModel.DataAnnotations;

namespace VehicleServiceApp.Models
{
    public class ServiceTask
    {
        public int Id { get; set; }
        [Required]
        public string Description { get; set; }
        [Range(0.01, double.MaxValue)]
        public decimal Cost { get; set; }

        public ICollection<ServiceRecord> ServiceRecords { get; set; } = new List<ServiceRecord>();
    }

}
