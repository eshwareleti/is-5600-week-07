import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

// 🔴 CHANGE THIS to your Node server URL (port 3000)
const API = "https://obscure-goggles-v6j7q755xqqp2pxqw-3000.app.github.dev/";

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, clearCart } = useCart();

  // 1. Load products from Node
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products", err);
      }
      setLoading(false);
    }

    loadProducts();
  }, []);

  // 2. Load orders from Node
  async function loadOrders() {
    try {
      const res = await fetch(`${API}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders", err);
    }
  }

  // 3. Submit cart as a new order
  async function submitOrder() {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const body = {
      items: cart.map((p) => ({
        productId: p.id,
        qty: 1,
      })),
    };

    try {
      await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      clearCart();
      await loadOrders();
    } catch (err) {
      console.error("Error submitting order", err);
      alert("Failed to submit order");
    }
  }

  if (loading) {
    return <p className="tc pa4">Loading products…</p>;
  }

  return (
    <div className="mw7 center pa4">
      <h1 className="tc f2">Fullstack Prints</h1>

      {/* PRODUCTS */}
      <section className="mb4">
        <h2 className="f3 mb3">Products</h2>
        {products.map((p) => (
          <div key={p.id} className="ba pa3 mb2 br2">
            <h3 className="f4 mb1">{p.name}</h3>
            <p className="mb2">${p.price}</p>
            <button
              className="pa2 br2 bg-dark-blue white"
              onClick={() => addToCart(p)}
            >
              Add to cart
            </button>
          </div>
        ))}
      </section>

      {/* CART */}
      <section className="mb4 ba br2 pa3">
        <h2 className="f3 mb2">Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <ul className="pl3">
            {cart.map((p, i) => (
              <li key={i}>
                {p.name} – ${p.price}
              </li>
            ))}
          </ul>
        )}

        <button
          className="mt2 pa2 br2 bg-green white"
          onClick={submitOrder}
        >
          Submit Order
        </button>
      </section>

      {/* ORDERS */}
      <section className="ba br2 pa3">
        <h2 className="f3 mb2">Orders</h2>
        <button
          className="mb2 pa2 br2 bg-light-blue"
          onClick={loadOrders}
        >
          Refresh orders
        </button>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <ul className="pl3">
            {orders.map((o) => (
              <li key={o.id}>
                Order #{o.id} – {o.items.length} items
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
