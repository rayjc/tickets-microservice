import { useEffect, useState } from 'react';

const OrderShow = ({ order }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const findTimeRemaining = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeRemaining(Math.round(msLeft / 1000));
    };

    findTimeRemaining();    // invoke to compute time right away
    const timerId = setInterval(findTimeRemaining, 1000);

    return () => {
      // clean up timer upon dismount
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>Reserving for {timeRemaining} seconds</div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;