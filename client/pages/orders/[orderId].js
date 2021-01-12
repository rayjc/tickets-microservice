import Link from 'next/link';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment)
  });

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
    <>
      <div>
        Reserving for {timeRemaining} seconds
      </div>
      <p>
        You may use any credit card number listed at
        <Link href="https://stripe.com/docs/testing#cards" passHref={true}>
          <a>Stripe</a>
        </Link> for testing
      </p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;