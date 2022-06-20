import React, { useState, useEffect } from "react";

function CreateRating({ rating, updateRating }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [displayRatingType, setDisplayRatingType] = useState(selectedRating);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (rating) {
      setSelectedRating(rating);
      if (firstRender) {
        setDisplayRatingType(rating);
        setFirstRender(false);
      }
    }

    let ratingContainer = document.getElementById("create-rating-container");
    ratingContainer.addEventListener("mouseleave", () => {
      setDisplayRatingType(selectedRating);
    });

    let stars = document.getElementsByClassName("create-rating-star");
    for (let star of stars) {
      star.addEventListener("mouseover", () => {
        let rating = Number(star.id[0]);
        setDisplayRatingType(rating);
        setHoverRating(rating);
      });
    }
  }, [displayRatingType, selectedRating, hoverRating, rating, firstRender]);

  const handleStarClick = (e) => {
    let rating = Number(e.target.id[0]);
    setSelectedRating(rating);
    setHoverRating(rating);
    updateRating(rating);
  };

  return (
    <h3 className="center-text full-padding" id="create-rating-container">
      <span className=".rtg-span">
        <i
          id="1-star"
          className={
            displayRatingType >= 1
              ? "create-rating-star fas fa-star"
              : "create-rating-star far fa-star"
          }
          onClick={handleStarClick}
        ></i>
      </span>
      <span className=".rtg-span">
        <i
          id="2-star"
          className={
            displayRatingType >= 2
              ? "create-rating-star fas fa-star"
              : "create-rating-star far fa-star"
          }
          onClick={handleStarClick}
        ></i>
      </span>
      <span className=".rtg-span">
        <i
          id="3-star"
          className={
            displayRatingType >= 3
              ? "create-rating-star fas fa-star"
              : "create-rating-star far fa-star"
          }
          onClick={handleStarClick}
        ></i>
      </span>
      <span className=".rtg-span">
        <i
          id="4-star"
          className={
            displayRatingType >= 4
              ? "create-rating-star fas fa-star"
              : "create-rating-star far fa-star"
          }
          onClick={handleStarClick}
        ></i>
      </span>
      <span className=".rtg-span">
        <i
          id="5-star"
          className={
            displayRatingType >= 5
              ? "create-rating-star fas fa-star"
              : "create-rating-star far fa-star"
          }
          onClick={handleStarClick}
        ></i>
      </span>
    </h3>
  );
}

export default CreateRating;
