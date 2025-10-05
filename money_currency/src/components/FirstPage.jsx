import React, { useState, useMemo, useCallback } from "react";
import {
  ShoppingCart,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  ArrowLeft
} from "lucide-react";
import "./FirstPage.css";

// Store items
const STORE_ITEMS = [
  { id: 1, name: "Juice Box", basePrice: 1.25, icon: "🧃" },
  { id: 2, name: "Apple", basePrice: 0.75, icon: "🍎" },
  { id: 3, name: "Toy Car", basePrice: 3.5, icon: "🚗" },
  { id: 4, name: "Pencil Case", basePrice: 2.1, icon: "✏️" }
];

// Currency
const CURRENCY_VALUES = [
  { value: 0.01, name: "Penny", label: "1¢" },
  { value: 0.05, name: "Nickel", label: "5¢" },
  { value: 0.1, name: "Dime", label: "10¢" },
  { value: 0.25, name: "Quarter", label: "25¢" },
  { value: 1.0, name: "$1 Bill", label: "$1" },
  { value: 5.0, name: "$5 Bill", label: "$5" }
];

const formatCurrency = (amt) => `$${amt.toFixed(2)}`;

const randomizePrice = (basePrice) => {
  const variation = Math.random() * 0.5 - 0.25;
  return Math.round((basePrice + variation) * 100) / 100;
};

const generateRandomizedItems = () =>
  STORE_ITEMS.map((i) => ({ ...i, price: randomizePrice(i.basePrice) }));

export default function FirstPage({ onBack }) {
  const [items, setItems] = useState(generateRandomizedItems);
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState(0);
  const [message, setMessage] = useState("Pick items and pay!");

  const subtotal = useMemo(
    () => Math.round(cart.reduce((s, i) => s + i.price, 0) * 100) / 100,
    [cart]
  );

  const change = useMemo(
    () => Math.round((payment - subtotal) * 100) / 100,
    [payment, subtotal]
  );

  const reRandomizePrices = useCallback(() => {
    setItems(generateRandomizedItems());
    setMessage("Item prices have been re-randomized!");
  }, []);

  const addItem = useCallback(
    (item) => {
      const newItemInCart = { ...item, cartKey: Date.now() + Math.random() };
      setCart((c) => [...c, newItemInCart]);
      setMessage(`Added ${item.name}. Total: ${formatCurrency(subtotal + item.price)}`);
    },
    [subtotal]
  );

  const removeItem = useCallback(
    (cartKey, name) => {
      setCart((c) => c.filter((item) => item.cartKey !== cartKey));
      setMessage(`Removed ${name}. Subtotal updated.`);
    },
    []
  );

  const addCurrency = useCallback(
    (val) => {
      setPayment((p) => {
        const newAmt = Math.round((p + val) * 100) / 100;
        setMessage(
          newAmt >= subtotal
            ? `You paid ${formatCurrency(newAmt)}. Press Checkout.`
            : `Paying... ${formatCurrency(newAmt)}`
        );
        return newAmt;
      });
    },
    [subtotal]
  );

  const checkout = () => {
    if (subtotal === 0) {
      setMessage("Cart empty! Nothing to check out.");
      return;
    }
    if (change >= 0) {
      setMessage(`Transaction Complete! Change: ${formatCurrency(change)}`);
      reRandomizePrices();
      setTimeout(reset, 4000);
    } else {
      setMessage(`You still owe ${formatCurrency(-change)}. Please add more payment.`);
    }
  };

  const reset = () => {
    setCart([]);
    setPayment(0);
    setMessage("Reset! Start a new transaction.");
  };

  return (
    <div className="store-container">
      {/* Back button */}
      <button className="back-btn" onClick={onBack || (() => alert("Go Back"))}>
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header */}
      <header className="store-header">
        <h1>🛒 Money Math Store</h1>
        <p>Practice shopping & making change</p>
      </header>

      {/* Store items */}
      <section className="store-items">
        <h2>
          <ShoppingCart /> Items
          <button className="randomize-btn" onClick={reRandomizePrices}>
            <RefreshCw size={16} /> Prices
          </button>
        </h2>
        <div className="items-grid">
          {items.map((it) => (
            <div key={it.id} className="item-card" onClick={() => addItem(it)}>
              <div className="icon">{it.icon}</div>
              <div>{it.name}</div>
              <div className="price">{formatCurrency(it.price)}</div>
              <button>Add</button>
            </div>
          ))}
        </div>
      </section>

      {/* Cart */}
      <section className="cart">
        <h2>
          <ShoppingCart /> Cart
        </h2>
        <ul>
          {cart.length === 0 ? (
            <li>Cart is empty</li>
          ) : (
            cart.map((c) => (
              <li key={c.cartKey}>
                <span>
                  {c.icon} {c.name} - {formatCurrency(c.price)}
                </span>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(c.cartKey, c.name)}
                >
                  <XCircle size={14} />
                </button>
              </li>
            ))
          )}
        </ul>
        <h3>Total: {formatCurrency(subtotal)}</h3>
      </section>

      {/* Payment */}
      <section className="payment">
        <h2>
          <DollarSign /> Payment
        </h2>
        <div className="currency-options">
          {CURRENCY_VALUES.map((c) => (
            <button key={c.name} onClick={() => addCurrency(c.value)}>
              {c.label}
            </button>
          ))}
        </div>
        <p>Paid: {formatCurrency(payment)}</p>
        <p className={change < 0 ? "owed" : "change"}>
          {change >= 0
            ? `Change: ${formatCurrency(change)}`
            : `Owed: ${formatCurrency(-change)}`}
        </p>
        <div className="actions">
          <button onClick={checkout} disabled={subtotal === 0 || change < 0}>
            <CheckCircle /> Checkout
          </button>
          <button onClick={reset}>
            <RefreshCw /> Reset
          </button>
        </div>
      </section>

      {/* Message */}
      <footer className="message-box">
        <p>{message}</p>
      </footer>
    </div>
  );
}
