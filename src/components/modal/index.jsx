import classnames from 'classnames';
import React, { useState } from 'react';
import Modal from 'react-modal';
import styles, { infoIcon } from './modal.module.scss';

export default ({
  modalLink,
  modalTitle,
  triggerStyles,
  showIcon = false,
  children
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={classnames(styles.modalLink, triggerStyles)}
      >
        {showIcon && (
          <svg
            className={infoIcon}
            aria-hidden="true"
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192 512"
          >
            <path
              fill="currentColor"
              d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"
            />
          </svg>
        )}

        <span dangerouslySetInnerHTML={{ __html: modalLink }} />
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldFocusAfterRender
        style={customStyles}
      >
        <button
          type="button"
          onClick={closeModal}
          className={styles.modalClosingX}
        >
          &times;
        </button>
        <h2>{modalTitle}</h2>
        {children}
      </Modal>
    </>
  );
};
