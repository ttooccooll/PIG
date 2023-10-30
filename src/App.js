import React, { useEffect, useState } from "react";
import Chart from "./components/Chart";
import Buttons from "./components/Buttons";
import Transactions from "./components/Transactions";
import axios from "axios";
import "./App.css";
import PdfModal from './components/PdfModal';
import WhitePaper from './components/WhitePaper';
import Bio from './components/Bio'

function App() {
  // useState lets us store/update/pass data from inside of this component and also refresh the component when the data changes
  // Though this data will be lost on a refresh since we dont have a database
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const apiKey = process.env.REACT_APP_X_API_KEY;
  const nameKey = process.env.REACT_APP_NAME_KEY;

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
        setBalance(parseInt(res.data.balance / 1000));
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
  }, []);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      getPrice();
    }, 1000);

      const timeInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
    const walletAndTransactionsInterval = setInterval(() => {
      getWalletBalance();
      getTransactions();
    }, 5000);
  
    return () => {
      clearInterval(priceInterval);
      clearInterval(walletAndTransactionsInterval);
      clearInterval(timeInterval);
    };
  }, []);
  
  const [audio, setAudio] = useState(null);

  const playMP3 = () => {
    const newAudio = new Audio("/80s-alarm-clock-sound.mp3");
    newAudio.volume = 0.1;
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
  };

  const stopMP3 = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const playMP4 = () => {
    const newAudio = new Audio("/oink-40664.mp3");
    newAudio.volume = 0.1;
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
  };

  const stopMP4 = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const playMP7 = () => {
    const audio = new Audio("/pg10.mp3");
    audio.play();
  };

  var elem = document.getElementById("everything");
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
  document.getElementById("everything").classList.add("fullscreen-mode");
}

  return (
    <div className="App" id="everything">
      <div className="pigpic">
        <h1>
          {nameKey}'s Piggy Bank
        </h1>
        <h2 onMouseEnter={playMP3} onMouseLeave={stopMP3} >
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h2>
        <div className="row">
        <div className="balance-card">
          <p style={{ fontSize: '40px', fontStyle: '#2b1603' }} onMouseEnter={playMP4} onMouseLeave={stopMP4} >{balance}</p>
          <p style={{ fontSize: '35px', fontStyle: '#2b1603' }} onMouseEnter={playMP4} onMouseLeave={stopMP4} >sats</p>
        </div>
        <Buttons />
        </div>
        <div className="hungry">
          <img src={process.env.PUBLIC_URL + "/hungry.png"} alt="" style={{ width: "120px", opacity:.7 }} />
        </div>
        <div className="bookgo">
          <Bio />
          <PdfModal />
          <div className="full" onClick={() => {
            playMP7();
            openFullscreen({
              type: "receive",
              open: true,
            });
          }}>
            World Atlas
          </div>
        </div>
        <div className="row">
          <div className="row-item">
            <Transactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
