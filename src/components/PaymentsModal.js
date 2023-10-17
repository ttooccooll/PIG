import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./PaymentsModal.css";
import QRCode from 'qrcode.react';

const PaymentsModal = ({ modalState, setModalState }) => {
  // Our state for the info we will send to either generate a new invoice or pay an invoice
  const [formData, setFormData] = useState({
    amount: 0,
    invoiceToPay: "",
  });
  // Our state for storing the invoice we created to be paid
  const [invoice, setInvoice] = useState("");

  const playMP3 = () => {
    const audio = new Audio("/oink-40664.mp3");
    audio.play();
  };

  const playMP4 = () => {
    const audio = new Audio("/put-away-book.mp3");
    audio.play();
  };

  const apiKey = process.env.REACT_APP_X_API_KEY;

  const handleReceive = (e) => {
    // Keep the page from refreshing when the form is submitted
    e.preventDefault();

    const headers = {
      "X-Api-Key": apiKey,
      "Access-Control-Allow-Origin": "*"
    };
    const data = {
      amount: formData.amount,
      out: false,
      // ToDo: Add additional form for user to be able to customize the memo
      memo: "LNBits",
    };
    axios
      .post("https://48f31a1603.d.voltageapp.io/api/v1/payments", data, { headers })
      .then((res) => setInvoice(res.data.payment_request))
      .catch((err) => console.log(err));

    return;
  };

  // Function to clear all of our state when we close the modal
  const clearForms = () => {
    setModalState({
      type: "",
      open: false,
    });
    setInvoice("");
    setFormData({
      amount: 0,
      invoiceToPay: "",
    });
  };

  return (
    <Modal
      isOpen={modalState.open}
      style={{
        content: {
          top: "10%",
          left: "40%",
          right: "40%",
          bottom: "auto",
          backgroundColor: "black",
        },
      }}
      contentLabel="Example Modal"
      appElement={document.getElementById("root")}
    >
      <p
        className="close-button"
        onClick={() => { clearForms(); playMP4(); }}
      >
        X
      </p>
      {/* If it is a receive */}
      {modalState.type === "receive" && (
        <form>
          <label>enter amount in sats</label>
          <input
            type="number"
            min="0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
          <button className="buttonq" onClick={(e) => { handleReceive(e); playMP3(); }}>
            Deposit
          </button>
        </form>
      )}
      {/* If we are displaying our newly created invoice */}
      {invoice && (
        <section>
          <h6>Invoice created</h6>
          <div className="qr-code-container">
            <QRCode value={invoice} size={198} fgColor="aqua" bgColor="#brown" />
          </div>
          <p>{invoice}</p>
        </section>
      )}
    </Modal>
  );
};

export default PaymentsModal;
