import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import ReviewVoteBtns from "./ReviewVoteBtns";
import ConfirmReviewDeleteModal from "./ConfirmReviewDeleteModal";
import { listUserReviews } from "../actions/reviewActions";
import { convertDateToString } from "../constants/universalFunctions";

function UserReviewsListItem({ review }) {
  const [showModal, setShowModal] = useState(false);
  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;
  const dispatch = useDispatch();

  const showReviews = () => {
    dispatch(listUserReviews());
  };

  return (
    <Card className="review-list-item" key={review.id}>
      <ConfirmReviewDeleteModal
        reviewId={review.id}
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        showProductReviews={showReviews}
        userInfo={userInfo}
      />
      <Row>
        <Col lg={2} className="flex-center">
          <Link to={`/products/${review.product.id}`}>
            <img
              src={review.product.image}
              className="review-product-image"
              alt=""
            />
          </Link>
        </Col>
        <Col lg={3} sm={12} className="flex-center">
          <div>
            <p>
              <Link
                to={`/products/${review.product.id}`}
                style={{ textDecoration: "none" }}
              >
                {review.product.name}
              </Link>
            </p>
            <Rating value={review.rating} text="" color="#fbd095"></Rating>
            <p>
              <strong>{review.user_name}</strong>
            </p>
            {userInfo.id === review.user ? (
              <div>
                <Link to={`/reviews/${review.id}/edit`}>
                  <Button className="mini-form-btn mini-edit" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  className="mini-form-btn delete-review-btn"
                  size="sm"
                  onClick={() => setShowModal(true)}
                >
                  Delete
                </Button>
              </div>
            ) : null}
          </div>
        </Col>
        <Col
          lg={5}
          sm={12}
          style={{ marginTop: "1.5rem" }}
          className="flex-center"
        >
          <div>
            <h4>
              <strong>{review.title}</strong>
            </h4>
            <p style={{ marginBottom: "2rem" }}>
              {review.comment ? (
                review.comment
              ) : (
                <i style={{ opacity: "0.6" }}>No Review Content</i>
              )}
            </p>
          </div>
        </Col>
        <Col lg={2} sm={12} className="center-text flex-center">
          <div>
            <p>{convertDateToString(review.date_created)}</p>
            <p>
              <i>Was this helpful?</i>
            </p>
            <div>
              <ReviewVoteBtns review={review} />
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default UserReviewsListItem;
