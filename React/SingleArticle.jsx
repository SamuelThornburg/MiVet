import React from "react";
import { useEffect, useState } from "react";
import { newsfeedServices } from "services/newsfeedService";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./singlearticle.css";

const _logger = debug.extend("Articles");

function SingleArticle(props) {
  const currentUser = props.currentUser;
  const [articleData, setArticleData] = useState({
    author: {
      email: "",
      firstName: "",
      lastName: "",
    },
    content: "",
    dateCreated: "",
    dateModified: "",
    editor: {
      email: "",
      firstName: "",
      lastName: "",
    },
    feedImageId: 0,
    id: 0,
    isActive: true,
    title: "",
    url: "",
  });
  const params = useParams();
  const articleId = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    getArticleData(articleId);
  }, []);

  const getArticleData = (id) => {
    newsfeedServices
      .getNewsfeedById(id)
      .then(getNewsfeedByIdSuccess)
      .catch(getNewsfeedByIdError);
  };

  const getNewsfeedByIdSuccess = (response) => {
    const data = response.item;
    setArticleData(data);

    _logger(data.author.id, currentUser.id);
  };

  const getNewsfeedByIdError = (error) => {
    Swal.fire(`We had trouble finding this article. ${error}`);
    _logger(error);
  };

  function createMarkup() {
    return { __html: articleData.content };
  }

  const editForm = () => {
    const stateForTransport = {
      state: { payload: articleData, type: "ARTICLE_EDIT" },
    };
    navigate(`/newsfeed/edit/${articleId}`, stateForTransport);
  };

  const deleteArticle = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteConfirmed();
      }
    });
  };
  const deleteConfirmed = () => {
    const payload = { id: articleId };
    newsfeedServices
      .deactivateArticle(articleId, payload)
      .then(deactivateSuccess)
      .catch(deactivateError);
  };

  const deactivateSuccess = (response) => {
    Swal.fire("Deleted!", "Your file has been deleted.", "success").then(() => {
      navigate("/newsfeed");
    });
    _logger(response);
  };

  const deactivateError = (error) => {
    Swal.fire(`We had trouble deleting this article. ${error}`);
  };

  const currentUserId = currentUser.id;
  const authorId = articleData.author.id;

  _logger(articleData);
  return (
    <div className="big-article">
      <Card className="shadow-lg">
        <Card.Img
          variant="top"
          className="article-pic shadow-lg img-fluid img-thumbnail mx-auto"
          src={articleData.url}
        />
        <Card.Title className="text-center pt-4">
          <h1>{articleData.title}</h1>
        </Card.Title>
        <Card.Body className="preview">
          <div
            className="article-text"
            dangerouslySetInnerHTML={createMarkup()}
          />
          {currentUserId === authorId && (
            <Button onClick={editForm} className="edit-button">
              Edit
            </Button>
          )}
          {currentUser.roles.includes("Admin" || "Vet") && (
            <Button
              onClick={deleteArticle}
              variant="danger"
              className="delete-button"
            >
              Delete
            </Button>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>Published {articleData.dateCreated}</small>
        </Card.Footer>
      </Card>
    </div>
  );
}

SingleArticle.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SingleArticle;
