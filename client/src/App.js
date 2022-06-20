import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import ProductDetail from "./components/ProductDetail";
import ProductListContainer from "./components/ProductListContainer";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import CartCheckoutContainer from "./components/CartCheckoutContainer";
import FavoriteList from "./components/FavoriteList";
import UserReviewsList from "./components/UserReviewsList";
import Profile from "./components/Profile";
import OrderConfirmation from "./components/OrderConfirmation";
import UserReviewFormContainer from "./components/UserReviewFormContainer";
import OrdersList from "./components/OrdersList";
import ContactPage from "./components/ContactPage";
import NotFound from "./components/NotFound";
import CartSlideout from "./components/CartSlideout";
import { getFavoriteList } from "./actions/favoriteListActions";
import { getCart } from "./actions/cartActions";
import { getProfile } from "./actions/profileActions";

function App() {
  const dispatch = useDispatch();

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      dispatch(getFavoriteList());
      dispatch(getCart());
      dispatch(getProfile());
    }
  }, [userInfo, dispatch]);

  return (
    <BrowserRouter>
      <CartSlideout />
      <Header />
      <main className="main py-3">
        <Container>
          <Routes>
            <Route path="/" element={<Landing />} exact />
            <Route path="/login" element={<LogIn />} exact />
            <Route path="/signup" element={<SignUp />} exact />
            <Route
              path="/cart"
              element={<CartCheckoutContainer showCart={true} exact />}
              exact
            />
            <Route
              path="/checkout"
              element={<CartCheckoutContainer showCart={false} exact />}
              exact
            />
            <Route
              path="/confirmation"
              element={
                <CartCheckoutContainer
                  showCart={false}
                  showConfirmation={true}
                />
              }
              exact
            />
            <Route path="/orders" element={<OrdersList />} exact />
            <Route
              path="/orders/:orderId"
              element={<OrderConfirmation orderDetailPage={true} />}
            />
            <Route path="/favorites" element={<FavoriteList />} exact />
            <Route path="/reviews" element={<UserReviewsList />} exact />
            <Route path="/profile" element={<Profile />} exact />
            <Route path="/contact" element={<ContactPage />} exact />
            <Route
              path="/reviews/:reviewId/edit"
              element={<UserReviewFormContainer />}
            />
            <Route
              path="/products/:productId"
              element={<ProductDetail />}
              exact
            />
            <Route
              path="/sunglasses"
              element={<ProductListContainer category="Sunglasses" />}
            />
            <Route
              path="/towels"
              element={<ProductListContainer category="Towels" />}
            />
            <Route
              path="/blankets"
              element={<ProductListContainer category="Blankets" />}
            />
            <Route
              path="/umbrellas"
              element={<ProductListContainer category="Umbrellas" />}
            />
            <Route
              path="/surfboards"
              element={<ProductListContainer category="Surfboards" />}
            />
            <Route
              path="/floats"
              element={<ProductListContainer category="Floats" />}
              category="Floats"
            />
            <Route
              path="/games"
              element={<ProductListContainer category="Games" />}
              category="Games"
            />
            <Route
              path="/sale"
              element={<ProductListContainer category="Sale" />}
              category="Sale"
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
