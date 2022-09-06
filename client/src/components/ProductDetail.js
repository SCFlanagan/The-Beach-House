import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Form } from "react-bootstrap";
import Rating from "./Rating";
import ReviewForm from "./ReviewForm";
import FavoriteBtn from "./FavoriteBtn";
import ReviewsListContainer from "./ReviewsListContainer";
import GoBackBtn from "./GoBackBtn";
import InfoModal from "./InfoModal";
import NotFound from "./NotFound";
import Loader from "./Loader";
import { listProductDetails } from "../actions/productActions";
import { addToCart } from "../actions/cartActions";

function ProductDetail() {
  let { productId } = useParams();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const [qty, setQty] = useState(1);
  const [reviewsShow, setReviewsShow] = useState(false);
  const [addFormShow, setAddFormShow] = useState(false);
  const [editReviewFormShow, setEditReviewFormShow] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [userReview, setUserReview] = useState({});
  const [selectedColor, setSelectedColor] = useState(false);
  const [qtyOptions, setQtyOptions] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      dispatch(listProductDetails(productId));
      setFirstRender(false);
    }
    if (!selectedColor && product) {
      let arr = [];
      for (let i = 1; i <= product.num_stock; i++) {
        arr.push(i);
      }
      setQtyOptions(arr);
    }
  }, [dispatch, productId, product, firstRender, selectedColor]);

  const handleAddToCart = () => {
    let selectedColorId;

    if (product.colors.length && !selectedColor) {
      setShowColorModal(true);
      return;
    }

    if (selectedColor) {
      selectedColorId = selectedColor.id;
    } else {
      selectedColorId = false;
    }

    // Add item and qty to user's cart
    dispatch(addToCart(productId, qty, selectedColorId));

    // Confirm to user item(s) added
    const elem = document.getElementById("cart-slideout");
    elem.className = "slide";
    setTimeout(() => {
      elem.className = "";
    }, 4005);
  };

  const showProductReviews = async () => {
    await dispatch(listProductDetails(productId));
    setReviewsShow(true);
    setAddFormShow(false);
    setTimeout(() => {
      window.location.href = "#product-review-list";
    }, 100);
  };

  const showReviewForm = () => {
    if (userInfo && Object.keys(userInfo).length) {
      const review = product.reviews.find(
        (review) => review.user === userInfo.id
      );
      if (review) {
        setUserReview(review);
        setEditReviewFormShow(true);
        setAddFormShow(false);
        setReviewsShow(false);
        setTimeout(() => {
          window.location.href = "#review-form-top";
        }, 100);
      } else {
        setAddFormShow(true);
        setReviewsShow(false);
        setTimeout(() => {
          window.location.href = "#review-form-top";
        }, 100);
      }
    } else {
      setShowInfoModal(true);
    }
  };

  const selectColor = (id) => {
    const productColors = document.getElementsByClassName("product-color");
    for (let i = 0; i < productColors.length; i++) {
      let elem = productColors[i];
      if (elem.id === id) {
        elem.className = "product-color selected-color";
        product.colors.forEach((color) => {
          if (color.name === id) {
            setSelectedColor(color);
            setQty(1);
            let arr = [];
            for (let i = 1; i <= color.num_stock; i++) {
              arr.push(i);
            }
            setQtyOptions(arr);
          }
        });
      } else {
        elem.className = "product-color";
      }
    }
  };

  const validateColorChosen = (e) => {
    if (product.colors.length && !selectedColor) {
      setShowColorModal(true);
    }
  };

  return (
    <div className="detail-container">
      <InfoModal
        title="Log In Required"
        message="You must log in to write a review."
        showModal={showInfoModal}
        closeModal={() => setShowInfoModal(false)}
        isLogInModal={true}
      />
      <InfoModal
        title="Color Required"
        message="You must select a color first."
        showModal={showColorModal}
        closeModal={() => setShowColorModal(false)}
      />
      {loading ? (
        <Loader />
      ) : error ? (
        <NotFound />
      ) : (
        <div>
          <Row>
            <Col md={7}>
              <Image
                src={product.image}
                alt={product.name}
                fluid
                className="product-detail-image"
              />
              <GoBackBtn className="btn btn-light my-3" />
            </Col>

            <Col md={5}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col md={11}>
                      <h3 className="product-detail-name">{product.name}</h3>
                    </Col>
                    <Col>
                      <h3 md={1}>
                        <FavoriteBtn
                          classType="detail-favorite-btn"
                          productId={productId}
                        />
                      </h3>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col onClick={showProductReviews}>
                      <span className="inline pointer-hover">
                        <Rating
                          value={product.avg_rating}
                          text={`${product.num_reviews}`}
                          color={"#f0ad4e"}
                        />
                        <a
                          className=".rtg-span num-reviews"
                          href="#product-review-list"
                        >
                          ({product.num_reviews && `${product.num_reviews}`})
                        </a>
                      </span>
                    </Col>
                    <Col>
                      <a
                        className="inline right"
                        onClick={showReviewForm}
                        href="#add-review-form"
                      >
                        <i>Write a Review</i>
                      </a>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <p className="detail-padding mb-0">{product.description}</p>

                  <div className="flex-column">
                    {product.colors
                      ? product.colors.map((color) => {
                          return (
                            <Row key={color.color} id={color.color}>
                              <Col md={1} sm={1}></Col>
                              <Col md={2} sm={3}>
                                <div
                                  className={
                                    color.num_stock !== 0
                                      ? "product-color"
                                      : "no-product-color"
                                  }
                                  id={color.name}
                                  style={
                                    Number(color.color.length) === 7
                                      ? { backgroundColor: color.color }
                                      : Number(color.color.length) === 15
                                      ? {
                                          backgroundImage: `linear-gradient(to bottom,${color.color}`,
                                        }
                                      : null
                                  }
                                  onClick={
                                    color.num_stock !== 0
                                      ? () => selectColor(color.name)
                                      : null
                                  }
                                ></div>
                              </Col>
                              <Col>
                                <p className="pt-1 color-name">
                                  {color.name}{" "}
                                  {color.num_stock < 10 ? (
                                    <span className="red ms-3">
                                      {color.num_stock === 0
                                        ? "- Out of Stock"
                                        : `- Only ${color.num_stock} left!`}
                                    </span>
                                  ) : null}
                                </p>
                              </Col>
                            </Row>
                          );
                        })
                      : null}
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col className="detail-padding">Price:</Col>
                    <Col>
                      {" "}
                      <p
                        className={
                          product.on_sale
                            ? "product-price line-through right price-padding"
                            : "product-price price-padding right"
                        }
                      >
                        ${product.price}
                        {product.on_sale ? (
                          <span className="sale-price">
                            ${product.sale_price}
                          </span>
                        ) : null}
                      </p>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col className="detail-padding">Status:</Col>
                    <Col className="detail-padding">
                      {product.num_stock >= 10 ? (
                        <p className="right">In Stock</p>
                      ) : product.num_stock < 10 && product.num_stock > 0 ? (
                        <p className="right warning">
                          Only {product.num_stock} left!
                        </p>
                      ) : (
                        <p className="right" style={{ color: "#D9534F" }}>
                          Out of Stock
                        </p>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.num_stock > 0 ? (
                  <ListGroup.Item>
                    <Row>
                      <Col className="full-padding">Quantity:</Col>
                      <Col xs="auto" className="my-1">
                        <Form.Select
                          id="detail-qty-input"
                          className="enter-text"
                          value={qty}
                          onClick={(e) => validateColorChosen(e)}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {qtyOptions.map((num) => (
                            <option value={num} key={num}>
                              {num}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ) : null}

                <ListGroup.Item>
                  <Button
                    className="btn-block add-cart-btn"
                    type="button"
                    disabled={product.num_stock === 0}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
      {reviewsShow ? (
        <ReviewsListContainer
          listType="productReviewList"
          showReviewForm={showReviewForm}
          deleteFollowUpFunc={showProductReviews}
          reviews={product.reviews}
        />
      ) : addFormShow ? (
        <ReviewForm
          review={{}}
          productId={productId}
          showReviews={showProductReviews}
          formType="add"
          isFromUserReviews={false}
        />
      ) : editReviewFormShow ? (
        <ReviewForm
          review={userReview}
          productId={productId}
          showReviews={showProductReviews}
          formType="edit"
          isFromUserReviews={false}
        />
      ) : null}
    </div>
  );
}

export default ProductDetail;
