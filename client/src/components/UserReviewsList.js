import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ListGroup, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { listUserReviews } from "../actions/reviewActions";
import Message from "./Message";
import Loader from "./Loader";
import UserReviewsListItem from "./UserReviewsListItem";

function UserReviewList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const userReviewList = useSelector((state) => state.userReviewList);
  const { error, loading, reviews } = userReviewList;

  useEffect(() => {
    if (userInfo && !Object.keys(userInfo).length) {
      navigate(-1);
    } else {
      dispatch(listUserReviews());
    }
  }, [userInfo, navigate, dispatch]);

  return (
    <div className="page-title">
      <div>
        <h1 className="center-text bottom-space">Your Reviews</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <ListGroup variant="flush">
            {!reviews.length ? (
              <div className="center-text full-padding">
                <p>
                  <i>You haven't written any reviews yet.</i>
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <Row key={review.id}>
                  <Col sm={12} xl={12}>
                    <UserReviewsListItem review={review} />
                  </Col>
                </Row>
              ))
            )}
          </ListGroup>
        )}
      </div>
    </div>
  );
}

export default UserReviewList;
