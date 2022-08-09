import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [categoryActual, setCategoryActual] = useState({});
  const [product, setProduct] = useState({});
  const [modal, setModal] = useState(false);
  const [order, setOrder] = useState([]);
  const [name, setName] = useState('');
  const [total, setTotal] = useState(0);

  const router = useRouter();

  const getCategories = async () => {
    const { data } = await axios('/api/categories');
    setCategories(data);
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setCategoryActual(categories[0]);
  }, [categories]);

  useEffect(() => {
    const newTotal = order.reduce(
      (total, product) => product.price * product.amount + total,
      0
    );

    setTotal(newTotal);
  }, [order]);

  const handleClickCategory = (id) => {
    const category = categories.filter((cat) => cat.id === id);
    setCategoryActual(category[0]);
    router.push('/');
  };

  const handleSetProduct = (product) => {
    setProduct(product);
  };

  const handleChangeModal = () => {
    setModal(!modal);
  };

  const handleAddOrder = ({ categoryId, ...product }) => {
    if (order.some((productState) => productState.id === product.id)) {
      const updateOrder = order.map((productState) =>
        productState.id === product.id ? product : productState
      );
      setOrder(updateOrder);

      toast.success('Order Saved!');
    } else {
      setOrder([...order, product]);
      toast.success('Add to Order!');
    }

    setModal(false);
  };

  const handleEditAmounts = (id) => {
    const productUpdate = order.filter((product) => product.id === id);
    setProduct(productUpdate[0]);
    setModal(!modal);
  };

  const handleRemoveProduct = (id) => {
    const updateOrder = order.filter((product) => product.id !== id);
    setOrder(updateOrder);
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/orders', {
        order,
        name,
        total,
        date: Date.now().toString(),
      });

      // Resetear la app
      setCategoryActual(categories[0]);
      setOrder([]);
      setName('');
      setTotal(0);

      toast.success('Order Place Successfully!');

      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        categories,
        categoryActual,
        handleClickCategory,
        product,
        handleSetProduct,
        modal,
        handleChangeModal,
        handleAddOrder,
        order,
        handleEditAmounts,
        handleRemoveProduct,
        name,
        setName,
        placeOrder,
        total,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export { ShopProvider };
export default ShopContext;
