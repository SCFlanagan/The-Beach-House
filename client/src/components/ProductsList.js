import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Form } from "react-bootstrap";
import ProductsListItem from "./ProductsListItem";

function ProductsList({ products, category }) {
  const [productsShown, setProductsShown] = useState(products);

  const sortByFeatured = useCallback(() => {
    const sorted = [...products].sort((a, b) => {
      return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
    });
    return sorted;
  }, [products]);

  useEffect(() => {
    setProductsShown(sortByFeatured());
  }, [sortByFeatured]);

  const handleChangeSort = (e) => {
    let sorted = [];
    switch (e.target.value) {
      case "featured":
        sorted = sortByFeatured();
        break;
      case "price":
        sorted = sortByPrice();
        break;
      case "rating":
        sorted = sortByRating();
        break;
      case "newest":
        sorted = sortByNewest();
        break;
      default:
        sorted = [...products];
    }
    setProductsShown(sorted);
  };

  const sortByPrice = () => {
    return [...products].sort((a, b) => {
      const aPrice = a.on_sale ? a.sale_price : a.price;
      const bPrice = b.on_sale ? b.sale_price : b.price;
      return aPrice - bPrice;
    });
  };

  const sortByRating = () => {
    return [...products].sort((a, b) => {
      return b.avg_rating - a.avg_rating;
    });
  };

  const sortByNewest = () => {
    return [...products].sort((a, b) => {
      const dateCreatedA = new Date(a.date_created.slice(0, 19));
      const dateCreatedB = new Date(b.date_created.slice(0, 19));
      return dateCreatedB - dateCreatedA;
    });
  };

  return (
    <div>
      <h1 className="text-center page-title">
        {category[0].toUpperCase() + category.slice(1).toLowerCase()}
      </h1>
      <Row>
        <Col lg={9} md={8} sm={7}>
          <p className="inline right detail-padding">Sort By: </p>
        </Col>
        <Col lg={3} md={4} sm={5}>
          <Form.Select className="inline" size="sm" onChange={handleChangeSort}>
            <option value="featured">Featured</option>
            <option value="price">Lowest Price</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {productsShown.map((product) => (
          <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
            <ProductsListItem product={product} key={product.id} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductsList;
