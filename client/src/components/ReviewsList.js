import React from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import ReviewsListItem from "./ReviewsListItem";

function ReviewsList({
  reviews,
  showReviewForm,
  deleteFollowUpFunc,
  listType,
}) {
  return (
    <ListGroup variant="flush">
      {listType === "productReviewList" ? (
        <h3 className="text-center sub-heading">Product Reviews</h3>
      ) : (
        <h1 className="text-center page-title">Your Reviews</h1>
      )}
      {!reviews.length ? (
        <div className="center-text full-padding">
          <p>
            <i>
              {listType === "productReviewList"
                ? "There are no reviews for this product."
                : "You haven't written any reviews yet."}
            </i>
          </p>
          {listType === "productReviewList" ? (
            <p onClick={showReviewForm} className="write-review-btn">
              Write a Review
            </p>
          ) : null}
        </div>
      ) : (
        reviews.map((review) => (
          <ListGroup.Item key={review.id}>
            <Row>
              <Col sm={12} xl={12}>
                <ReviewsListItem
                  review={review}
                  showReviewForm={showReviewForm}
                  deleteFollowUpFunc={deleteFollowUpFunc}
                />
              </Col>
            </Row>
          </ListGroup.Item>
        ))
      )}
    </ListGroup>
  );
}

export default ReviewsList;
