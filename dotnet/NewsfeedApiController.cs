using MessagePack;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Newsfeed;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Newsfeed;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/newsfeed")]
    [ApiController]
    public class NewsfeedApiController : BaseApiController
    {
        private INewsfeedService _service = null;
        private IAuthenticationService<int> _authService;

        public NewsfeedApiController(INewsfeedService service
            , IAuthenticationService<int> authService
            , ILogger<NewsfeedApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(NewsfeedAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.Insert(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}/deactivate")]
        public ActionResult<ItemResponse<int>> UpdateToInactive(NewsfeedUpdateToInactiveRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateToInactive(model);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Newsfeed>>> GetByPage(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Newsfeed> paged = _service.GetNewsfeedByPage(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record not found");
                }

                else
                {
                    response = new ItemResponse<Paged<Newsfeed>> { Item = paged };
                }

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}/paginate")]
        public ActionResult<ItemResponse<Paged<Newsfeed>>> GetByCreatedByPaged(int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Newsfeed> paged = _service.GetPagedCreatedBy(id, pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record not found");
                }

                else
                {
                    response = new ItemResponse<Paged<Newsfeed>> { Item = paged };
                }

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Newsfeed>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Newsfeed newsfeed = _service.GetNewsfeedById(id);
                if (newsfeed == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record not found");
                }

                else 
                {
                    response = new ItemResponse<Newsfeed> { Item = newsfeed };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(NewsfeedUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {

                int userId = _authService.GetCurrentUserId();

                _service.UpdateNewsfeed(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Newsfeed>>> Search(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Newsfeed> page = _service.Search(pageIndex, pageSize, query);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource was not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Newsfeed>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}