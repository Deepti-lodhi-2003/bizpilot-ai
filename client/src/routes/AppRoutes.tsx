import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Inventory from "../pages/Inventory";
import Expenses from "../pages/Expenses";
import Analytics from "../pages/Analytics";
import AIAssistant from "../pages/AIAssistant";
import Settings from "../pages/Settings";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";

import DashboardLayout from "../layouts/DashboardLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
<Route path="/shop/:id" element={<ProductDetails />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;