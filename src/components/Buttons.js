import React, { useState } from "react";
import "./Buttons.css";
import PaymentsModal from "./PaymentsModal";

const playMP3 = () => {
  const audio = new Audio("/pg10.mp3");
  audio.play();
};

export const Buttons = () => {
  const [modalState, setModalState] = useState({
    type: "",
    open: false,
  });

  return (
    <div>
      <div className="buttons">
        <a
          className="d"
          href="https://www.youtube.com/shorts/zApydIPKFfI"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playMP3}
        >
          History
        </a>

        <a
          className="b"
          href="https://www.pleblab.com/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playMP3}
        >
          Latin
        </a>

        <button
          className="button"
          onClick={() => {
            playMP3();
            setModalState({
              type: "receive",
              open: true,
            });
          }}
        >
          Finance
        </button>

        <a
          className="a"
          href="https://bitcoin.clarkmoody.com/dashboard/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playMP3}
        >
          Math
        </a>

      </div>
      <PaymentsModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
};

export default Buttons;
