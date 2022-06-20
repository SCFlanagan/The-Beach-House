import React from "react";
import ReviewsList from "./ReviewsList";

function ReviewListContainer({
  listType,
  showReviewForm,
  deleteFollowUpFunc,
  reviews,
}) {
  return (
    <div>
      {listType === "productReviewList" ? (
        <hr id="product-review-list" name="product-review-list" />
      ) : null}
      <ReviewsList
        reviews={reviews}
        showReviewForm={showReviewForm}
        deleteFollowUpFunc={deleteFollowUpFunc}
        listType={listType}
        key={Date.now()}
      />
    </div>
  );
}

export default ReviewListContainer;
