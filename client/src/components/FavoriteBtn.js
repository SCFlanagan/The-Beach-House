import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavoriteList,
  removeFromFavoriteList,
} from "../actions/favoriteListActions";
import InfoModal from "./InfoModal";

function FavoriteBtn({ classType, productId }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(true);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const favoriteList = useSelector((state) => state.favoriteList);
  const { favorites } = favoriteList;
  const isProductFavorited = useCallback(() => {
    let isFavorited = false;
    favorites.forEach((item) => {
      if (item.product.id === Number(productId)) {
        isFavorited = true;
      }
    });
    return isFavorited;
  }, [favorites, productId]);

  useEffect(() => {
    if (favorites) {
      favorites.forEach((item) => {
        if (isProductFavorited()) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      });
    }
  }, [favorites, isProductFavorited]);

  const handleAddClick = () => {
    // Add product to logged-in user's favorite list.
    if (userInfo && Object.keys(userInfo).length) {
      setIsFavorite(true);
      setHoverEffect(false);
      dispatch(addToFavoriteList(productId));
      setTimeout(() => {
        let icon = document.getElementById("rm-no-hover");
        icon.addEventListener("mouseleave", () => {
          setHoverEffect(true);
        });
      }, 10);
    } else {
      setShowModal(true);
    }
  };

  const handleRemoveClick = () => {
    // Remove product from logged-in uesr's favorite list.
    if (userInfo && Object.keys(userInfo).length) {
      setIsFavorite(false);
      setHoverEffect(false);
      dispatch(removeFromFavoriteList(productId));
      setTimeout(() => {
        let icon = document.getElementById("add-no-hover");
        icon.addEventListener("mouseleave", () => {
          setHoverEffect(true);
        });
      }, 10);
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <span className={classType}>
      <InfoModal
        title="Log In Required"
        message="Log in to add to your favorites."
        showModal={showModal}
        closeModal={closeModal}
        isLogInModal={true}
      />
      {isFavorite && hoverEffect ? (
        <div onClick={handleRemoveClick}>
          <i id="rm-regular" className="fa-regular fa-heart fa-hover-show"></i>
          <i id="rm-solid" className="fa-solid fa-heart fa-hover-hidden"></i>
        </div>
      ) : isFavorite && !hoverEffect ? (
        <div onClick={handleRemoveClick}>
          <i className="fa-solid fa-heart" id="rm-no-hover"></i>
        </div>
      ) : !isFavorite && hoverEffect ? (
        <div onClick={handleAddClick}>
          <i
            id="add-regular"
            className="fa-regular fa-heart fa-hover-hidden"
          ></i>
          <i id="add-solid" className="fa-solid fa-heart fa-hover-show"></i>
        </div>
      ) : !isFavorite && !hoverEffect ? (
        <div onClick={handleAddClick}>
          <i className="fa-regular fa-heart" id="add-no-hover"></i>
        </div>
      ) : null}
    </span>
  );
}

export default FavoriteBtn;
