import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductsList from "./ProductsList";
import Loader from "./Loader";
import Message from "./Message";

function FavoriteList() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);

  const favoriteList = useSelector((state) => state.favoriteList);
  const { error, loading, favorites } = favoriteList;

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  useEffect(() => {
    if (userInfo && !Object.keys(userInfo).length) {
      navigate(-1);
    }
    if (favorites) {
      const products = favorites.map((x) => {
        return x.product;
      });
      setProductList(products);
    }
  }, [userInfo, navigate, favorites, setProductList]);

  return (
    <div>
      <h1 className="center-text bottom-space page-title">Your Favorites</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          {favorites && !favorites.length ? (
            <div className="center-text full-padding page-title">
              <p>
                <i>You don't have any favorites yet.</i>
              </p>
            </div>
          ) : (
            <ProductsList
              products={productList}
              category="Your Favorites"
              key={Date.now()}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default FavoriteList;
