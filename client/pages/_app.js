import 'bootstrap/dist/css/bootstrap.css';
import Head from 'next/head';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TicketPro</title>
      </Head>
      <Header currentUser={currentUser} />
      <div className="container bg-white">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

/**
 * Initialize context for top level component which will be ran for all pages.
 * @param {*} appContext 
 */
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx, client, data.currentUser
    );
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;
