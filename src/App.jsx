
import { Routes, Route, Navigate } from "react-router-dom";
import Products from "./Pages/Products";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/products" element={<Products />} />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
