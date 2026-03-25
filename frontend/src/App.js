import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Registerform from "./Registerform";
import FashionStore from "./Home"; // this is your Home page
import Login from "./Login";
import Viewcart from "./Viewcart";
import Orders from "./Orders";
import AllItem from "./AllItem";
import AddItem from "./AddItem";
import CustomerMessage from "./CustomerMessage";
import Addtocart from "./Addtocart";
import VishList from "./VishList";
import Profile from "./Profile";
import Adminlogin from "./Adminlogin";
import AdminDashboard from "./AdminDashboard";
import AboutUs from "./AboutUs";
import Women from "./Women";
import Men from "./Men";
import Kids from "./Kids";
import ContactUs from "./ContactUs";




function App() {
  return (
    <Router>
     <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/registerform" element={<Registerform />} />
  <Route path="/home" element={<FashionStore />} />
  <Route path="/viewcart" element={<Viewcart />} />
  <Route path="/orders" element={<Orders />} />
  <Route path="/allitem" element={<AllItem />} />
  <Route path="/add-item/:id?" element={<AddItem />} /> {/* <-- updated here */}
  <Route path="/customer-messages" element={<CustomerMessage />} />
<Route path="/addtocart/:productId" element={<Addtocart />} />
  <Route path="/vistlist" element={<VishList />} /> {/* maybe rename to /wishlist */}
  <Route path="/profile" element={<Profile />} />
  <Route path="/adminlogin" element={<Adminlogin />} />
  <Route path="/admindashboard" element={<AdminDashboard />} />
  <Route path="/about" element={<AboutUs />} />
  <Route path="/contact-us" element={<ContactUs />} /> {/* fixed typo */}
  <Route path="/women" element={<Women />} />
  <Route path="/men" element={<Men />} />
  <Route path="/kids" element={<Kids />} />
</Routes>
    </Router>
  );
}

export default App;
