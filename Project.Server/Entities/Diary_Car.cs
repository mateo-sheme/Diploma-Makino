using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project.Server.Entities
{
    public class Diary_Car
    {
        [Key]
        public int User_Car_ID { get; set; }
        public int User_ID { get; set; }
        [ForeignKey(nameof(User_ID))]
        public User? User { get; set; }
        public string Nickname_Car { get; set; } = string.Empty;
        [Required]
        public string VIN { get; set; } = string.Empty;
        [Required]
        public string Brand { get; set; } = string.Empty;
        [Required]
        public string Model { get; set; } = string.Empty;
        [Required]
        public string License_Plate { get; set; } = string.Empty;
        [Required]
        public int Current_Kilometers { get; set; }
        [Required]
        public string Fuel { get; set; } = string.Empty;
        public byte[]? Car_Image { get; set; }
        public string? Content_Type { get; set; } = string.Empty;

        public ICollection<Maintenance_Record> Maintenance_Record { get; set; } = new List<Maintenance_Record>();

        // Insurance and inspection
        public DateTime? Insurance_Expiry { get; set; }
        public DateTime? Inspection_Expiry { get; set; }
    }
}
