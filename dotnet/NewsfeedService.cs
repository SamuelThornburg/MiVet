using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.Newsfeed;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Newsfeed;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class NewsfeedService : INewsfeedService
    {
        IDataProvider _data = null;

        public NewsfeedService(IDataProvider data)
        {
            _data = data;
        }

        public int Insert(NewsfeedAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Newsfeed_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, userId, col);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void UpdateToInactive(NewsfeedUpdateToInactiveRequest model)
        {
            string procName = "[dbo].[Newsfeed_Delete(deactivate)]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }

        public Paged<Newsfeed> GetNewsfeedByPage(int pageIndex, int pageSize)
        {
            Paged<Newsfeed> pagedResult = null;

            List<Newsfeed> result = null;

            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[Newsfeed_Paginated]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);

                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    Newsfeed newsfeed = MapSingleNewsfeed(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (result == null)
                    {
                        result = new List<Newsfeed>();
                    }
                    result.Add(newsfeed);
                }
              );
            if (result != null)
            {
                pagedResult = new Paged<Newsfeed>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;

        }

        public Newsfeed GetNewsfeedById(int id)
        {
            string procName = "[dbo].[Newsfeed_GetById]";
            Newsfeed newsfeed = null;

            _data.ExecuteCmd(procName
                ,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    newsfeed = MapSingleNewsfeed(reader, ref index);
                }
                );
            return newsfeed;
        }
        public Paged<Newsfeed> GetPagedCreatedBy(int id, int pageIndex, int pageSize)
        {
            Paged<Newsfeed> pagedResult = null;

            List<Newsfeed> result = null;

            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[Newsfeed_SelectByCreatedBy]",
               inputParamMapper: delegate (SqlParameterCollection parameterCollection)
               {
                   parameterCollection.AddWithValue("@Id", id);
                   parameterCollection.AddWithValue("@PageIndex", pageIndex);
                   parameterCollection.AddWithValue("@PageSize", pageSize);
               },
               singleRecordMapper: delegate (IDataReader reader, short sert)
               {
                   int index = 0;
                   Newsfeed newsfeed = MapSingleNewsfeed(reader, ref index);

                   if (totalCount == 0)
                   {
                       totalCount = reader.GetSafeInt32(index++);
                   }
                   if (result == null)
                   {
                       result = new List<Newsfeed>();
                   }
                   result.Add(newsfeed);
               }
              );
            if (result != null)
            {
                pagedResult = new Paged<Newsfeed>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public void UpdateNewsfeed(NewsfeedUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Newsfeed_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Title", model.Title);
                col.AddWithValue("@Content", model.Content);
                col.AddWithValue("@FeedImageId", model.FeedImageId);
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@IsActive", model.IsActive);
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }

        public Paged<Newsfeed> Search(int pageIndex, int pageSize, string query)
        {
            Paged<Newsfeed> pagedList = null;
            List<Newsfeed> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Newsfeed_Search]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@Query", query);

            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Newsfeed newsfeed = MapSingleNewsfeed(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Newsfeed>();
                }
                list.Add(newsfeed);
            });
            if (list != null)
            {
                pagedList = new Paged<Newsfeed>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        private static void AddCommonParams(NewsfeedAddRequest model, int userId, SqlParameterCollection col)
        {
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Content", model.Content);
            col.AddWithValue("@FeedImageId", model.FeedImageId);
            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@ModifiedBy", userId);
            col.AddWithValue("@IsActive", model.IsActive);
        }

        private static Newsfeed MapSingleNewsfeed(IDataReader reader, ref int index)
        {


            Newsfeed newsfeed = new Newsfeed();

            newsfeed.Author = new Models.Domain.Users.BaseUserProfile();

            newsfeed.Editor = new Models.Domain.Users.BaseUserProfile();

            newsfeed.Id = reader.GetSafeInt32(index++);
            newsfeed.Title = reader.GetSafeString(index++);
            newsfeed.Content = reader.GetSafeString(index++);
            newsfeed.FeedImageId = reader.GetSafeInt32(index++);
            newsfeed.Url = reader.GetSafeString(index++);
            newsfeed.Author.Email = reader.GetSafeString(index++);
            newsfeed.Author.FirstName = reader.GetSafeString(index++);
            newsfeed.Author.LastName = reader.GetSafeString(index++);
            newsfeed.Author.Id = reader.GetSafeInt32(index++);
            newsfeed.Editor.Email = reader.GetSafeString(index++);
            newsfeed.Editor.FirstName = reader.GetSafeString(index++);
            newsfeed.Editor.LastName = reader.GetSafeString(index++);
            newsfeed.DateCreated = reader.GetSafeDateTime(index++);
            newsfeed.DateModified = reader.GetSafeDateTime(index++);
            newsfeed.IsActive = reader.GetSafeBool(index++);
            return newsfeed;
        }

    }
}