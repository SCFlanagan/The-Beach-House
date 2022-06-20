import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GoBackBtn from "./GoBackBtn";
import NotFound from "./NotFound";
import ReviewForm from "./ReviewForm";
import { getUserConfig } from "../constants/universalFunctions";

function UserReviewFormContainer() {
  const [review, setReview] = useState({});
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const getUserReview = useCallback(async () => {
    const { data } = await axios.get(
      `/api/reviews/${reviewId}`,
      getUserConfig(userInfo)
    );
    setReview(data);
  }, [setReview, userInfo, reviewId]);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      getUserReview();
    }
  }, [userInfo, getUserReview]);

  const showUserReviews = () => {
    navigate("/reviews");
  };

  return (
    <div className="page-title">
      {review.product ? (
        <div>
          <GoBackBtn className="btn btn-outline-primary my-3 go-back-user-form" />
          {review.product ? (
            <div>
              <h1 className="text-center" style={{ marginBottom: "4rem" }}>
                {review.product.name}
              </h1>
              <img
                style={{ width: "50%", marginLeft: "25%" }}
                src={review.product.image}
                alt=""
              />
            </div>
          ) : null}
          <ReviewForm
            review={review}
            productId={review.product.id}
            formType="edit"
            showReviews={showUserReviews}
            isFromUserReviews={true}
          />
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}

export default UserReviewFormContainer;
