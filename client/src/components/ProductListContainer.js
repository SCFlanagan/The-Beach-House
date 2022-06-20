import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductsList from "./ProductsList";
import Loader from "./Loader";
import Message from "./Message";
import {
  listCategoryProducts,
  listSaleProducts,
} from "../actions/productActions";

function ProductListContainer({ category }) {
  const dispatch = useDispatch();
  category = category[0].toUpperCase() + category.slice(1).toLowerCase();
  const listType = category === "Sale" ? "saleList" : "categoryList";
  const productList = useSelector((state) => state[listType]);
  const { error, loading, products } = productList;

  useEffect(() => {
    if (category) {
      if (listType === "categoryList") {
        dispatch(listCategoryProducts(category));
      } else if (listType === "saleList") {
        dispatch(listSaleProducts());
      }
    }
  }, [dispatch, category, listType]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" isPageMessage={true}>
          {error}
        </Message>
      ) : (
        <ProductsList
          products={products}
          category={category}
          key={Date.now()}
        />
      )}
    </div>
  );
}

export default ProductListContainer;
