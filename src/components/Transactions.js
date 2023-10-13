import React from "react";
import "./Transactions.css";

export const Transactions = ({ transactions }) => {
  const parseTx = (tx) => {
    const date = new Date(tx.time * 1000);
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).replace(/\//g, '.');

    if (tx.pending) return null;

    if (tx.amount > 0) {
      return (
        <div key={tx.checking_id} className="transaction">
          <p className="t">Inbound - {tx.bolt11.substring(0, 30)}</p>
          <p className="t">+{tx.amount / 1000} satoshis</p>
          <p className="t">{formattedDate}</p>
        </div>
      );
    }

    if (tx.amount < 0) {
      return (
        <div key={tx.checking_id} className="transaction">
          <p className="t">Outbound - {tx.bolt11.substring(0, 30)}</p>
          <p className="t">{tx.amount / 1000} satoshis</p>
          <p className="t">Stardate {formattedDate}</p>
        </div>
      );
    }
  };

  return (
    <div>
      <h4 className="tr">Transactions</h4>
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div key={transaction.checking_id} className="transaction">
            {parseTx(transaction)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
