import React, { useEffect, useState } from "react";
import Chart from "./components/Chart";
import Buttons from "./components/Buttons";
import Transactions from "./components/Transactions";
import axios from "axios";
import "./App.css";

function App() {
  // useState lets us store/update/pass data from inside of this component and also refresh the component when the data changes
  // Though this data will be lost on a refresh since we dont have a database
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const getPrice = () => {
    // Axios is a library that makes it easy to make http requests
    // After we make a request, we can use the .then() method to handle the response asychronously
    // This is an alternative to using async/await
    axios
      .get("https://api.coinbase.com/v2/prices/BTC-USD/spot")
      // .then is a promise that will run when the API call is successful
      .then((res) => {
        setPrice(res.data.data.amount);
        updateChartData(res.data.data.amount);
      })
      // .catch is a promise that will run if the API call fails
      .catch((err) => {
        console.log(err);
      });
  };

  const getWalletBalance = () => {
    // ToDo: Lookup how to move the X-API-Key to a .env file to keep it secret for when we push to Github
    const headers = {
      "X-Api-Key": "52cac212fc664da393ac45df991fdb84",
    };
    axios
      .get("https://legend.lnbits.com/api/v1/wallet", { headers })
      .then((res) => {
        // Divide our balance by 1000 since it is denominated in millisats
        setBalance(res.data.balance / 1000);
      })
      .catch((err) => console.log(err));
  };

  const getTransactions = () => {
    // ToDo: Lookup how to move the X-API-Key to a .env file to keep it secret for when we push to Github
    const headers = {
      "X-Api-Key": "52cac212fc664da393ac45df991fdb84",
    };
    axios
      .get("https://legend.lnbits.com/api/v1/payments", { headers })
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => console.log(err));
  };

  const updateChartData = (currentPrice) => {
    const timestamp = Date.now();
    // We are able to grab the previous state to look at it and do logic before adding new data to it
    setChartData((prevState) => {
      // If we have no previous state, create a new array with the new price data
      if (!prevState)
        return [
          {
            x: timestamp,
            y: Number(currentPrice),
          },
        ];
      // If the timestamp or price has not changed, we dont want to add a new point
      if (
        prevState[prevState.length - 1].x === timestamp ||
        prevState[prevState.length - 1].y === Number(currentPrice)
      )
        return prevState;
      // If we have previous state than keep it and add the new price data to the end of the array
      return [
        // Here we use the "spread operator" to copy the previous state
        ...prevState,
        {
          x: timestamp,
          y: Number(currentPrice),
        },
      ];
    });
  };

  // useEffect is a 'hook' or special function that will run code based on a trigger
  // The brackets hold the trigger that determines when the code inside of useEffect will run
  // Since it is empty [] that means this code will run once on page load
  useEffect(() => {
    getPrice();
    getWalletBalance();
    getTransactions();
  }, []);

  // Run these functions every 5 seconds after initial page load
  useEffect(() => {
    // setInterval will run whatever is in the callback function every 5 seconds
    const interval = setInterval(() => {
      getPrice();
      getWalletBalance();
      getTransactions();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Pleb Wallet: The Next Generation</h1>
      </header>
      <Buttons />
      <div className="row">
        <div className="balance-card">
          <h2>Balance</h2>
          <p>{balance} sats</p>
        </div>
        <div className="balance-card">
          <h2>Price</h2>
          <p>${price}</p>
        </div>
      </div>
      <div className="row">
        <div className="row-item">
          <Transactions transactions={transactions} />
        </div>
        <div className="row-item">
          <Chart chartData={chartData} />
        </div>
      </div>
      <footer>
        <p>NCC-1701-D</p>
      </footer>
    </div>
  );
}

export default App;
