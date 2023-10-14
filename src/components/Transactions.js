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
    })

    if (tx.pending) return null;

    return (
      <div key={tx.checking_id} className="rosie">
        {tx.amount > 0 ? (
          <>
            <p className="t">Deposit - {tx.bolt11.substring(0, 30)}</p>
            <p className="t">+{tx.amount / 1000} sats</p>
            <p className="t">Date: {formattedDate}</p>
          </>
        ) : (
          <>
            <p className="t">Withdrawal - {tx.bolt11.substring(0, 30)}</p>
            <p className="t">{tx.amount / 1000} sats</p>
            <p className="t">Date: {formattedDate}</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="rosie">
      <h4 >Transactions</h4>
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
