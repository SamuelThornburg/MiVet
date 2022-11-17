import React from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";

const _logger = debug.extend("ArticleLayout");

function ArticleLayout(props) {
  _logger("Article Layout");

  function createMarkup() {
    return { __html: props.values.content };
  }

  const datePublished = new Date().toLocaleString() + "";

  return (
    <div>
      <Card className="shadow-lg">
        <Card.Header>
          <h4 className="mb-0">Preview</h4>
        </Card.Header>
        <Card.Img
          variant="top"
          className="img-fluid shadow-4 img-thumbnail article-img mx-auto"
          src={props.values.url}
        />
        <Card.Title className="text-center pt-4">
          {props.values.title}
        </Card.Title>
        <Card.Body className="preview">
          <div dangerouslySetInnerHTML={createMarkup()} />
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>Published {datePublished}</small>
        </Card.Footer>
      </Card>
    </div>
  );
}

ArticleLayout.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
};

export default ArticleLayout;
