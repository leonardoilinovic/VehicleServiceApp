using System.ComponentModel.DataAnnotations;

namespace VehicleServiceApp.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        [Required]
        public string Make { get; set; }
        [Required]
        public string Model { get; set; }
        public int Year { get; set; }
        [Required]
        public string LicensePlate { get; set; }

        public int ClientId { get; set; }
        public Client? Client { get; set; }

        public ICollection<ServiceRecord> ServiceRecords { get; set; } = new List<ServiceRecord>();
    }


}
