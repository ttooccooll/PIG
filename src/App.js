import React, { useEffect, useState } from "react";
import Chart from "./components/Chart";
import Buttons from "./components/Buttons";
import Transactions from "./components/Transactions";
import axios from "axios";
import "./App.css";
import AudioPlayerComponent from './components/AudioPlayer';
import BitcoinBlockHeight from './components/BlockHeight';
import TotalBTC from './components/TotalBitcoin'
import BitcoinDifficulty from './components/Difficulty'
import PdfModal from './components/PdfModal';
import WhitePaper from './components/WhitePaper';
import BitcoinBlockReward from './components/BlockReward';
import BitcoinHashWin from './components/BlockEta';

function App() {
  // useState lets us store/update/pass data from inside of this component and also refresh the component when the data changes
  // Though this data will be lost on a refresh since we dont have a database
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const playMP3 = () => {
    const audio = new Audio("/tng_swoosh_clean.mp3");
    audio.play();
  };

  const apiKey = process.env.REACT_APP_X_API_KEY;

  const getPrice = () => {
    axios
      .get("https://api.coinbase.com/v2/prices/BTC-USD/spot")
      .then((res) => {
        const formattedPrice = Number(res.data.data.amount).toFixed(4)
        setPrice(formattedPrice);
        updateChartData(formattedPrice);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getWalletBalance = () => {
    const headers = {
      "X-Api-Key": apiKey,
      "Access-Control-Allow-Origin": "*"
    };
    axios
      .get("https://48f31a1603.d.voltageapp.io/api/v1/wallet", { headers })
      .then((res) => {
        setBalance(res.data.balance / 1000);
      })
      .catch((err) => console.log(err));
  };

  const getTransactions = () => {
    const headers = {
      "X-Api-Key": apiKey,
      "Access-Control-Allow-Origin": "*"
    };
    axios
      .get("https://48f31a1603.d.voltageapp.io/api/v1/payments", { headers })
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
  }, [getPrice]);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      getPrice();
    }, 1000);
  
    const walletAndTransactionsInterval = setInterval(() => {
      getWalletBalance();
      getTransactions();
    }, 5000);
  
    return () => {
      clearInterval(priceInterval);
      clearInterval(walletAndTransactionsInterval);
    };
  }, []);
  

  return (
    <div className="App">
      <header >
      </header>
      <div>
       <AudioPlayerComponent autoplay={true} />
      </div>
      <div className="pigpic">
          <Buttons />
        <div className="balance-card">
          <p>{balance}</p>
          <p>Sats</p>
        </div>
        <div className="row">
          <div className="row-item">
            <Transactions transactions={transactions} />
          </div>
        </div>
      </div>
      <footer>

      </footer>
    </div>
  );
}

export default App;
