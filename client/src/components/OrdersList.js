import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOrderList } from "../actions/orderActions";
import Message from "./Message";
import Loader from "./Loader";
import OrdersListItem from "./OrdersListItem";

function OrdersList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const orderList = useSelector((state) => state.orderList);
  const { error, loading, orders } = orderList;

  useEffect(() => {
    if (userInfo && !Object.keys(userInfo).length) {
      navigate(-1);
    } else {
      dispatch(getOrderList());
    }
  }, [userInfo, navigate, dispatch]);

  return (
    <div className="page-title">
      <div>
        <h1 className="center-text bottom-space">Your Orders</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div>
            {orders && !orders.length ? (
              <div className="center-text full-padding">
                <p>
                  <i>You haven't placed any orders yet.</i>
                </p>
              </div>
            ) : (
              <div>
                {orders.map((order) => (
                  <OrdersListItem
                    key={order.id}
                    order={order}
                    className="full-padding"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersList;
