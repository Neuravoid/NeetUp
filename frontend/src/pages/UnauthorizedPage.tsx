import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-6">
        <svg 
          className="w-12 h-12 text-red-500 dark:text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Yetkiniz Bulunmuyor
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Bu sayfayı görüntülemek için gerekli izinlere sahip değilsiniz. Lütfen yöneticinizle iletişime geçin.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors text-center"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors text-center"
        >
          Giriş Yap
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
