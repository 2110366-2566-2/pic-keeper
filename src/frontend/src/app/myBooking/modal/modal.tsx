// components/SimpleModal.js
'use client'
import React from 'react';

export default function SimpleModal(props:{ isOpen:Boolean, closeModal:Function, content:string}){
  return (
    <>
      {props.isOpen && (
        <div onClick={()=>{props.closeModal()}} className="fixed bg-black bg-opacity-50 inset-20 flex items-center justify-center" >
          
          <div className="bg-white p-6 rounded shadow-lg z-10">
            <h2 className="text-2xl font-bold mb-4">Simple Modal</h2>
            <p>{props.content}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={()=>{props.closeModal()}}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </>
  );
};


