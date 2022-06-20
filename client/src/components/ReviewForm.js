import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import CreateRating from "./CreateRating";
import Message from "./Message";
import ConfirmReviewDeleteModal from "./ConfirmReviewDeleteModal";
import axios from "axios";
import { getUserConfig } from "../constants/universalFunctions";

function ReviewForm({ review, productId, showReviews, formType }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  useEffect(() => {
    if (formType === "edit") {
      setRating(review.rating);
      setTitle(review.title);
      setComment(review.comment);
    }
  }, [formType, review]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo && Object.keys(userInfo).length) {
      if (rating) {
        if (formType === "add") {
          await axios.post(
            `/api/reviews/${productId}/create/`,
            {
              user: userInfo.id,
              user_name: `${userInfo.first_name} ${userInfo.last_name[0]}.`,
              rating,
              title,
              comment,
            },
            getUserConfig(userInfo)
          );
          showReviews();
        } else {
          await axios.put(
            `/api/reviews/${review.id}/update/`,
            {
              rating,
              title,
              comment,
            },
            getUserConfig(userInfo)
          );
          showReviews();
        }
      } else {
        setMessage("You must select a star rating between 1 and 5.");
      }
    } else {
      setMessage("You must be logged in to write a review.");
    }
  };

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <hr id="review-form-top" />
      <h3 className="center-text sub-heading">
        {formType === "add" ? "Add a Review" : "Edit Your Review"}
      </h3>
      <ConfirmReviewDeleteModal
        reviewId={review.id}
        showModal={showModal}
        closeModal={closeModal}
        showProductReviews={showReviews}
        userInfo={userInfo}
      />
      <Form onSubmit={(e) => handleSubmit(e)}>
        {message && <Message variant="danger">{message}</Message>}
        <Form.Group>
          <CreateRating rating={rating} updateRating={handleRatingChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="review-title">Review Title:</Form.Label>
          <Form.Control
            size="sm"
            id="review-title"
            type="text"
            maxLength="100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="review-comment">Comment:</Form.Label>
          <Form.Control
            size="sm"
            id="review-comment"
            className="review-comment"
            as="textarea"
            maxLength="500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <div className="form-btns">
          {formType === "edit" ? (
            <Button
              className="btn-block delete-review-btn form-btn center"
              onClick={() => setShowModal(true)}
            >
              Delete
            </Button>
          ) : null}
          <Button
            className="btn-block form-btn center"
            type="button"
            onClick={(e) => handleSubmit(e)}
          >
            {formType === "add" ? "Submit" : "Save Changes"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ReviewForm;
