using Microsoft.AspNetCore.Identity;

namespace VehicleServiceApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
    }
}
