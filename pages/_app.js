import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Speech Evaluation</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
