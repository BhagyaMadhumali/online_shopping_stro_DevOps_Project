import React, { useState } from "react";
import Hearder from "./Hearder";
import Footer from "./Footer";

function ContactUs() {
  // Replace these with actual user data from context or props if needed
  const [customerInfo] = useState({
    name: "Bhagya Madhumali",
    email: "bhagya@example.com",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent:", { ...customerInfo, message });
    alert("Message sent successfully!");
    setMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Hearder />

      <div className="flex-grow bg-gradient-to-b from-[#FFF0EC] to-white px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          
          {/* Left Side - Contact Information */}
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold mb-4 font-serif text-[#D35400]">Contact Us</h2>
            <p className="text-lg font-serif">
              We’d love to hear from you! Whether you have a question about our products,
              need assistance, or just want to give feedback — we're here to help.
            </p>

            <div className="space-y-3 text-base font-serif">
              <p><strong>Address:</strong> 123 Fashion Street, Colombo, Sri Lanka</p>
              <p><strong>Phone:</strong> +94 77 123 4567</p>
              <p><strong>Email:</strong> support@fashionstore.lk</p>
  <p><strong>Hours:</strong> Everyday: 8 AM – 12 PM</p>
            </div>
          </div>

              </div>

      </div>

      <Footer />
    </div>
  );
}

export default ContactUs;
