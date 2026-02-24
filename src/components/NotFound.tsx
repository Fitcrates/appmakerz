import { Helmet } from 'react-helmet';

const NotFound = () => {
  return (
    <div className="bg-[#140F2D] min-h-screen flex items-center justify-center flex-col text-white">
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl">Page Not Found</p>
      <a href="/" className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors">
        Return to Home
      </a>
    </div>
  );
};

export default NotFound;