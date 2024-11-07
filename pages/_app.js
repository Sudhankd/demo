// pages/_app.js
import Layout from '../components/Layout';
import '../styles/globals.css'; // Import global CSS

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
