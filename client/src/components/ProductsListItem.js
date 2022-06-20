import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import FavoriteBtn from "./FavoriteBtn";
import Rating from "./Rating";

function ProductsListItem({ product }) {
  return (
    <Card className="my-3 p-3 rounded list-item-card">
      <h4>
        <FavoriteBtn classType="list-favorite-btn" productId={product.id} />
      </h4>
      <Link to={`/products/${product.id}`}>
        <Card.Img src={product.image} className="product-image" />
      </Link>
      <Card.Body>
        <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <Card.Title as="div">
            <h5 className="product-title">{product.name}</h5>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <h5>
            <Rating value={product.avg_rating} color={"#f0ad4e"} />
            <span className=".rtg-span num-reviews">
              {product.num_reviews && `(${product.num_reviews})`}
            </span>
          </h5>
        </Card.Text>

        <Card.Text
          className={
            product.on_sale ? "product-price line-through" : "product-price"
          }
          as="h5"
        >
          ${product.price}
        </Card.Text>

        {product.on_sale ? (
          <Card.Text className="product-price sale-price" as="h5">
            ${product.sale_price}
          </Card.Text>
        ) : null}
      </Card.Body>
    </Card>
  );
}

export default ProductsListItem;
