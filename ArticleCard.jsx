import React from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import "./articles.css";
import { useNavigate } from "react-router-dom";

const _logger = debug.extend("ArticleCard");

function ArticleCard(props) {
  _logger("Article Card");
  const navigate = useNavigate();

  const goToCard = (e) => {
    let id = e.currentTarget.id;
    navigate(`article/${id}`);
  };

  return (
    <Card
      onClick={goToCard}
      className="mb-4 article-shadow article-card-body"
      id={props.article.id}
    >
      <img
        src={props.article.url}
        alt="nothing found"
        className="feed-card-image mx-auto"
      />
      <Card.Body>
        <p className="feed-card-text">{props.article.title}</p>
      </Card.Body>
      <Card.Footer>
        Created By {props.article.author.firstName}{" "}
        {props.article.author.lastName}
      </Card.Footer>
    </Card>
  );
}
ArticleCard.propTypes = {
  article: PropTypes.shape({
    author: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    feedImageId: PropTypes.number,
    url: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
  }),
};

export default ArticleCard;
