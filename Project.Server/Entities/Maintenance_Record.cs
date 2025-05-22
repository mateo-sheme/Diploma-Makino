using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Project.Server.Entities
{
    public class Maintenance_Record
    {
        [Key]
        public int Record_ID { get; set; }
        public int User_Car_ID { get; set; }
        [ForeignKey("User_Car_ID")]
        public Diary_Car? Car { get; set; }

        [Required]
        public DateTime Record_Date { get; set; } = DateTime.UtcNow;

        [Required]
        public int Kilometers { get; set; }

        [Required]
        public string Maintenance_Type { get; set; } = string.Empty; // "OilChange", "EngineCheck", "Inspection", etc.

        public string Notes { get; set; } = string.Empty;

        [Required]
        public int Next_Maintenance_Km { get; set; } // When next maintenance is due (in km)
    }
}
