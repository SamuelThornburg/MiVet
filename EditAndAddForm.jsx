import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import "./articleform.css";
import { newsfeedServices } from "services/newsfeedService";
import Swal from "sweetalert2";
import FileUpload from "components/fileUpload/FileUpload";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { ArticleFormSchema } from "schemas/articleFormSchema";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ArticleLayout from "../newsfeed/ArticleLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const _logger = debug.extend("ArticleForm");

function EditAndAddForm(props) {
  const params = useParams();
  const navigate = useNavigate();
  const newsfeedId = params.id;
  const { state } = useLocation();
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (state?.type === "ARTICLE_EDIT") {
      setFormData(state.payload);
    }
  }, []);

  const handleSubmit = (values) => {
    _logger("The form was submitted", values);

    if (params.id)
      newsfeedServices
        .updateNewsfeed(newsfeedId, values)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    else {
      newsfeedServices
        .insertNewsfeed(values)
        .then(onInsertSuccess)
        .catch(onInsertError);
    }
  };
  const onInsertSuccess = (response) => {
    _logger("Success", response);
    Swal.fire("Success! Your article has been published").then(
      navigate("/newsfeed")
    );
  };

  const onInsertError = (error) => {
    _logger("Error", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Your article had issues with publishing",
    });
  };

  const onUpdateSuccess = (response) => {
    _logger("Success", response);
    Swal.fire("Success! Your changes have been saved").then(
      navigate("/newsfeed")
    );
  };

  const onUpdateError = (error) => {
    _logger("Error", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Your article had issues with publishing",
    });
  };
  const deleteArticle = () => {
    const payload = { id: newsfeedId };
    newsfeedServices
      .deactivateArticle(newsfeedId, payload)
      .then(deactivateSuccess)
      .catch(deactivateError);
  };

  const deactivateSuccess = (response) => {
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    _logger(response);
  };

  const deactivateError = (error) => {
    Swal.fire(`We had trouble deleting this article. ${error}`);
  };
  const currentUserId = props.currentUser.id;
  const authorId = formData.author.id;

  const uploadFile = (file, setFieldValue) => {
    setFieldValue("url", file[0].url);
    setFieldValue("feedImageId", file[0].id);
  };

  return (
    <div>
      <Container fluid>
        <Formik
          initialValues={formData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={ArticleFormSchema}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Row>
                <Col xl={6} lg={6} md={6} sm={6} className="pt-5 pb-5">
                  <Card className="shadow-lg">
                    <Card.Header>
                      {params.id && <h4 className="mb-0">Edit Post</h4>}
                      {!params.id && <h4 className="mb-0">Create Post</h4>}
                    </Card.Header>
                    <Card.Body>
                      <div>
                        <div className="form-group">
                          <label htmlFor="title">Title</label>
                          <Field
                            type="text"
                            name="title"
                            className="form-control"
                          />
                          <ErrorMessage name="title" component="has-error" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="content">Content</label>
                          <CKEditor
                            editor={ClassicEditor}
                            data={formData.content}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setFieldValue("content", data);
                            }}
                          />

                          <ErrorMessage name="content" component="has-error" />
                        </div>
                        <Row className="d-flex justify-content-center">
                          <div className="pt-2">
                            <FileUpload
                              name="url"
                              onUploadSuccess={(file) => {
                                uploadFile(file, setFieldValue);
                              }}
                              className="uploaded-image dropzone mt-4 p-4 border-dashed text-center"
                            />
                            {values.url && (
                              <img
                                src={values.url}
                                alt="uploaded"
                                className="uploaded-image img-thumbnail mx-auto d-block"
                              />
                            )}
                          </div>
                        </Row>
                        <Button type="submit" variant="primary" className="m-1">
                          {params.id && "Save Changes"}
                          {!params.id && "Publish Article"}
                        </Button>
                        {currentUserId === authorId && (
                          <Button variant="danger" onClick={deleteArticle}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} className="pt-5 pb-5">
                  <ArticleLayout values={values} />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}

EditAndAddForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default EditAndAddForm;
