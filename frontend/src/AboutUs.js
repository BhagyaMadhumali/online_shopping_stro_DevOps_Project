import React from "react";
import Hearder from "./Hearder";
import Footer from "./Footer";
import { FaTshirt, FaSmile, FaShippingFast, FaUndoAlt } from "react-icons/fa";

function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FFF7F3] flex flex-col text-gray-800">
      {/* Header */}
      <Hearder />

      {/* Main Content */}
      <div className="flex-grow px-6 md:px-16 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-center text-[#FFA890] mb-6">
            About FashionStore
          </h1>

          <p className="text-center text-lg md:text-xl mb-10">
            Your go-to destination for affordable, stylish, and confidence-boosting fashion.
          </p>

          {/* Mission */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-10 mb-10">
            <h2 className="text-2xl font-semibold text-[#FF7B7B] mb-3">🎯 Our Mission</h2>
            <p className="text-base md:text-lg leading-relaxed">
              At <span className="font-bold">FashionStore</span>, our goal is to empower people through fashion. We strive to make the latest trends available and affordable for everyone, while promoting self-expression, confidence, and creativity.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-10 mb-10">
            <h2 className="text-2xl font-semibold text-[#FF7B7B] mb-3">🛍️ What We Offer</h2>
            <ul className="space-y-3 text-base md:text-lg">
              <li className="flex items-center gap-2">
                <FaTshirt className="text-[#FFA890]" /> Trendy clothing for men and women
              </li>
              <li className="flex items-center gap-2">
                <FaSmile className="text-[#FFA890]" /> Fashion that makes you feel good
              </li>
              <li className="flex items-center gap-2">
                <FaShippingFast className="text-[#FFA890]" /> Fast and reliable delivery
              </li>
              <li className="flex items-center gap-2">
                <FaUndoAlt className="text-[#FFA890]" /> Easy returns and great support
              </li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-10 mb-10">
            <h2 className="text-2xl font-semibold text-[#FF7B7B] mb-3">💖 Why Choose Us?</h2>
            <p className="text-base md:text-lg leading-relaxed">
              We believe fashion should be fun, effortless, and expressive. Our curated collections, smooth online experience, and dedicated customer service ensure you always feel confident and stylish — without breaking the bank.
            </p>
          </div>

          {/* Thank You */}
          <div className="text-center mt-12">
            <h3 className="text-xl font-medium text-gray-700">
              Thank you for being a part of the <span className="text-[#FF7B7B] font-semibold">FashionStore</span> family!
            </h3>
            <p className="mt-2 text-gray-600">Let’s redefine fashion, together.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutUs;
