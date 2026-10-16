
import { Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/Products";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/products" element={<Products />} />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
