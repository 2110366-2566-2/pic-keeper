// pages/index.js
"use client";
import React, { useState } from "react";
import SimpleModal from "./modal";

const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <h1>
        Next.js Simple Modal Example Next.js Simple Modal ExampleNext.js Simple
        Modal ExampleNext.js Simple Modal Example
      </h1>
    
      <button onClick={openModal}>Open Modal</button>
      <SimpleModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        content="This is a simple modal content."
      />
    </div>
  );
};

export default Home;
