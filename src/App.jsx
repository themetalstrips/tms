import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import AnnouncementBar from './components/AnnouncementBar';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import ProductDetail from './pages/ProductDetail';
import KintsugiKnife from './pages/KintsugiKnife';
import Admin from './pages/Admin';
import Contact from './pages/Contact';

function App() {
  return (
    <div className="app">
      <header className="fixed-header">
        <AnnouncementBar />
        <Navbar />
      </header>
      <CartSidebar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/kintsugi-knife" element={<KintsugiKnife />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
