import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import ArticleCard from "../newsfeed/ArticleCard";
import debug from "sabio-debug";

const _logger = debug.extend("ArticleListing");

function ArticleListing(props) {
  _logger("Article Listing");

  const articleList = props.articleList;

  return (
    <Container className="pt-5">
      <Row>
        {articleList.map((item) => (
          <Col xl={4} lg={4} md={6} sm={12} key={item.id}>
            <ArticleCard article={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

ArticleListing.propTypes = {
  articleList: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      feedImageId: PropTypes.number,
      url: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      id: PropTypes.number.isRequired,
    })
  ),
};

export default ArticleListing;
