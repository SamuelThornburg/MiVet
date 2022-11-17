using Sabio.Models.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Versioning;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Newsfeed
{
    public class Newsfeed
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int FeedImageId { get; set; }
        public string Url { get; set; }
        public BaseUserProfile Author { get; set; }
        public BaseUserProfile Editor { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool IsActive { get; set; }
    }
}