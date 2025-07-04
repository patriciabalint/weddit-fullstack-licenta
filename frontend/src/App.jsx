import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import Editor from './pages/Editor';

const App = () => {
  const location = useLocation();
  const isEditorPage =
    location.pathname.startsWith('/edit') ||
    location.pathname === '/test-editor';

  return (
    <div
      className={
        !isEditorPage ? 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' : ''
      }
    >
      <ToastContainer />
      {!isEditorPage && <Navbar />}
      {!isEditorPage && <SearchBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/test-editor" element={<Editor />} />
        <Route path="/editor/:productId" element={<Editor />} />
      </Routes>
      {!isEditorPage && <Footer />}
    </div>
  );
};

export default App;
