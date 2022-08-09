import { useContext } from 'react';
import shopContext from '../context/ShopProvider';

const useShop = () => {
  return useContext(shopContext);
};

export default useShop;
