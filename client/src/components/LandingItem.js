import React from "react";

function LandingItem({ category, image }) {
  return (
    <div className="landing-item">
      <div className="category-card flex-center">
        <img src={image} alt="" className="fill-space category-image" />
        <h2 className="category-title">{category}</h2>
      </div>
    </div>
  );
}

export default LandingItem;
