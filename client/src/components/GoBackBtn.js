import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emptyProductDetails } from "../actions/productActions";

function GoBackBtn({ className }) {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleClick = () => {
    dispatch(emptyProductDetails());
    navigate(-1);
  };

  return (
    <button onClick={handleClick} className={className}>
      Go Back
    </button>
  );
}

export default GoBackBtn;
