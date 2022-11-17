import React from "react";
import ArticleListing from "../newsfeed/ArticleListing";
import { newsfeedServices } from "services/newsfeedService";
import { useState, useEffect } from "react";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "../blogs/blogsarticle.css";
import "rc-pagination/assets/index.css";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const _logger = debug.extend("Articles");

function Articles(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    articleArray: [],
    pageIndex: 0,
    pageSize: 9,
    totalCount: 0,
    current: 1,
  });
  const currentUser = props.currentUser;

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [data.pageIndex, data.pageSize]);

  const getData = () => {
    newsfeedServices
      .getAllNewsfeeds(data.pageIndex, data.pageSize)
      .then(onGetSuccess)
      .catch(onGetError);
  };

  const onGetSuccess = (response) => {
    _logger(response);
    const newsfeedData = response.item.pagedItems;
    const pd = {
      articleArray: newsfeedData,
      pageIndex: response.item.pageIndex,
      pageSize: response.item.pageSize,
      totalCount: response.item.totalCount,
      current: response.item.pageIndex + 1,
    };
    setData(pd);
  };
  const onGetError = (error) => {
    _logger("No newsfeed data", error);
  };

  const ArticleChange = (page) => {
    setData((prevState) => {
      const articleView = { ...prevState };
      articleView.current = page;
      articleView.pageIndex = page - 1;
      return articleView;
    });
  };

  const onArticleSearch = (e) => {
    e.preventDefault();
    _logger(searchQuery);
    if (searchQuery === "") {
      newsfeedServices
        .getAllNewsfeeds(data.pageIndex, data.pageSize)
        .then(onGetSuccess)
        .catch(onGetError);
    } else {
      newsfeedServices
        .search(data.pageIndex, data.pageSize, searchQuery)
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
  };

  const onSearchSuccess = (response) => {
    _logger("searching", response);
    const newsfeedData = response.item.pagedItems;

    const pd = {
      articleArray: newsfeedData,
      pageIndex: response.item.pageIndex,
      pageSize: response.item.pageSize,
      totalCount: response.item.totalCount,
      current: response.item.pageIndex + 1,
    };
    setData(pd);
  };

  const onSearchError = (error) => {
    Swal.fire(`We had trouble finding this article. ${error}`);
  };

  const onSearchChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchQuery((prevState) => {
      let findArticle = { ...prevState };
      findArticle = value;
      return findArticle;
    });
  };

  const goToForm = () => {
    navigate("create");
  };

  return (
    <React.Fragment>
      <div className="text-center">
        <h1 className="display-2 fw-bold">See what&apos;s new for MiVet</h1>
      </div>
      <Form className="row px-md-20 pt-5" onSubmit={onArticleSearch}>
        <Form.Group
          className="mb-3 col ps-0 ms-2 ms-md-0"
          controlId="formBasicText"
        >
          <Form.Control
            type="search"
            placeholder="Search"
            onChange={onSearchChange}
          />
        </Form.Group>
        <Form.Group className="mb-3 col-auto ps-0" controlId="formSubmitButton">
          <Button variant="primary" type="submit">
            Search
          </Button>
        </Form.Group>
      </Form>
      <ArticleListing articleList={data.articleArray} />
      <div className="m-3">
        <Pagination
          className="blog-card-pagination mx-auto"
          onChange={ArticleChange}
          current={data.current}
          total={data.totalCount}
          pageSize={data.pageSize}
          locale={locale}
        />
        {currentUser.roles.includes("Admin" || "Vet") && (
          <Button className="ms-19" onClick={goToForm}>
            Create Article
          </Button>
        )}
      </div>
    </React.Fragment>
  );
}
Articles.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};
export default Articles;
