namespace VehicleServiceApp.Models
{
    public class ServiceRecord
    {
        public int Id { get; set; }
        public DateTime ServiceStart { get; set; }
        public DateTime ServiceEnd { get; set; }
        public decimal TotalCost { get; set; }

        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }

        public ICollection<ServiceTask> Tasks { get; set; } = new List<ServiceTask>();
    }




}
