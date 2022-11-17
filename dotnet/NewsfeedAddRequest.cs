using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Newsfeed
{
    public class NewsfeedAddRequest
    {
        [Required]
        [StringLength(65, MinimumLength = 2)]
        public string Title { get; set; }
        [Required]
        [StringLength(4000, MinimumLength = 2)]
        public string Content { get; set; }
        public int FeedImageId { get; set; }
        [Required]
        public bool IsActive { get; set; }
    }
}