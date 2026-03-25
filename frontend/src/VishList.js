import React, { useState } from "react";
import Hearder from "./Hearder";
import  {Link} from 'react-router-dom';

function VishList() {
  const [visible, setVisible] = useState(true); // ← visibility state

  const product = {
    img: "https://i.ibb.co/2N1bX0M/women-top.jpg",
    name: "Women top",
   
  };

  const totalPrice = product.price * product.quantity;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF0EC] to-white">
      <Hearder />

      {visible && (
        <div className="mx-[25rem] mt-6 p-6 border border-gray-300 relative flex gap-[10rem] bg-[#F3F2F2] rounded-md">
          {/* Close button */}
          <button
            onClick={() => setVisible(false)} // ← hide on click
            className="absolute top-2 right-2 text-white bg-red-600 rounded px-3 py-1 text-xl leading-none hover:bg-red-700"
            aria-label="Close cart item"
          >
            &times;
          </button>

          {/* Product image */}
          <img
            src={product.img}
            alt={product.name}
            className="w-24 h-24 object-cover"
          />

          {/* Product info with labels on top */}
          <div className="flex-1">
            {/* Headings */}
            <div className="flex justify-start items-center font-sans text-2xl font-bold gap-x-12 mb-3">
              <span className="w-28">Product</span>
             
            </div>

            {/* Values */}
            <div className="flex justify-start items-center font-sans text-lg font-medium gap-x-12">
              <span className="w-28 text-xl">{product.name}</span>
              <span className="w-12">{product.size}</span>
              
            </div>
          </div>

          {/* Buttons container */}
          <div className="absolute bottom-4 right-4 flex gap-4">
                 <Link to="/addtocart">

            <button className="bg-black text-white px-3 py-1 flex items-center gap-2 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 7h14M7 13h10m-6 8a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
             Add to Cart
            </button>
            </Link>

           
          </div>
        </div>
      )}

    </div>
  );
}

export default VishList;
