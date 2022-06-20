export const convertDateToString = (date) => {
  date = new Date(date.slice(0, 19)).toString().slice(0, 15);
  return `${date.slice(4, 10)}, ${date.slice(10)}`;
};

export const updateCart = (cartItems) => {
  let subtotal = cartItems.reduce((prev, curr) => {
    let product = curr.product;
    let price = product.on_sale
      ? Number(product.sale_price)
      : Number(product.price);
    return price * Number(curr.qty) + prev;
  }, 0);
  let sales_tax = subtotal * 0.0625;
  let total = subtotal + sales_tax;
  return {
    subtotal: Number(subtotal.toFixed(2)),
    sales_tax: Number(sales_tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

export const getUserConfig = (userInfo) => {
  return {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};
