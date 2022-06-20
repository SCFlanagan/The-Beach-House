import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import ReviewVoteBtns from "./ReviewVoteBtns";
import ConfirmReviewDeleteModal from "./ConfirmReviewDeleteModal";
import { convertDateToString } from "../constants/universalFunctions";

function ReviewsListItem({ review, showReviewForm, deleteFollowUpFunc }) {
  const [showModal, setShowModal] = useState(false);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  return (
    <div className="review-list-item" key={review.id}>
      <ConfirmReviewDeleteModal
        reviewId={review.id}
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        showProductReviews={deleteFollowUpFunc}
        userInfo={userInfo}
      />
      <Row>
        <Col lg={2} sm={12}>
          <Rating value={review.rating} text="" color="#fbd095"></Rating>
          <p>{review.user_name}</p>
          {userInfo && userInfo.id === review.user ? (
            <div>
              <Button
                className="mini-form-btn mini-edit"
                size="sm"
                onClick={showReviewForm}
              >
                Edit
              </Button>

              <Button
                className="mini-form-btn delete-review-btn"
                size="sm"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Delete
              </Button>
            </div>
          ) : null}
        </Col>
        <Col lg={8} sm={12} style={{ marginTop: "1.5rem" }}>
          <div>
            <h4 className="full-padding center-text">{review.title}</h4>
            <p style={{ margin: "1rem 0 2rem 0" }} className="center-text">
              {review.comment ? (
                review.comment
              ) : (
                <i style={{ opacity: "0.6" }}>No Review Content</i>
              )}
            </p>
          </div>
        </Col>
        <Col lg={2} sm={12} className="center-text">
          <p>{convertDateToString(review.date_created)}</p>
          <p>
            <i>Was this helpful?</i>
          </p>
          <ReviewVoteBtns review={review} />
        </Col>
      </Row>
    </div>
  );
}

export default ReviewsListItem;
