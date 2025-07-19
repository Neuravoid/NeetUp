import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Sayfa Bulunamadı
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
};

export default NotFoundPage;
