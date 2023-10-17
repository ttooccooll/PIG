import React, { useState } from 'react';
import BitcoinBlockHeight from './BlockHeight';
import TotalBTC from './TotalBitcoin'
import BitcoinDifficulty from './Difficulty'
import WhitePaper from './WhitePaper';
import BitcoinBlockReward from './BlockReward';
import BitcoinHashWin from './BlockEta';

function PdfModal() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    const audioOpen = new Audio(`${process.env.PUBLIC_URL}/tng_drawer.mp3`);
    audioOpen.play();
  };

  const closeModal = () => {
    setModalOpen(false);
    const audioClose = new Audio(`${process.env.PUBLIC_URL}/computerbeep_69.mp3`);
    audioClose.play();
  };

  return (
    <div>
      <span
        className='s'
        role="link"
        tabIndex={0}
        onClick={() => openModal()}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            openModal();
          }
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '0.6';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '1';
        }}
      >
        Statistics
      </span>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => closeModal()}>
          <div className="modal-content-centered" >
            X
            <span className="close" onClick={() => closeModal()}>
              &times;
            </span>
            <div className="modal-inner">
              <BitcoinBlockHeight />
              <BitcoinBlockReward />
              <BitcoinDifficulty />
              <BitcoinHashWin />
              <TotalBTC /> / 21000000
              <WhitePaper></WhitePaper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PdfModal;
