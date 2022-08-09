import Layout from '../layout/Layout';
import useShop from '../hooks/useShop';
import SummaryProduct from '../components/SummaryProduct';

export default function Summary() {
  const { order } = useShop();
  return (
    <Layout page='Summary'>
      <h1 className='text-4xl font-black'>Summary</h1>
      <p className='text-2xl my-10'>Confirm Your Order</p>

      {order.length === 0 ? (
        <p className='text-center text-2xl'>There are no items in your order</p>
      ) : (
        order.map((product) => (
          <SummaryProduct key={product.id} product={product} />
        ))
      )}
    </Layout>
  );
}
