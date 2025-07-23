import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import type { LoginRequest } from '../../types/index.js';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { login, clearError } from '../../store/slices/authSlice';

// Form validation şeması
const schema = yup.object({
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi girin')
    .required('E-posta adresi gerekli'),
  password: yup
    .string()
    .required('Şifre gerekli')
}).required();

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: yupResolver(schema)
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  React.useEffect(() => {
    // Zaten giriş yapmış kullanıcıyı ana sayfaya yönlendir
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Komponent unmount olduğunda hata mesajını temizle
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = async (data: LoginRequest) => {
    try {
      const result = await dispatch(login(data) as any);
      
      // If login is successful, redirect to home page
      // Check if the login was successful from the payload
      if (result.payload && result.payload.success) {
        navigate('/');
      }
    } catch (error) {
      // Error is already handled by the auth slice
      console.error('Login failed:', error);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="card max-w-md w-full space-y-8">
=======
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Transparan Arkaplan Görselleri */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sol üst köşe - Education Background 1 */}
        <div className="absolute top-3 left-20 opacity-15 transform rotate-15">
          <img 
            src="/images/education-bg-1.png" 
            alt="Education Background" 
            className="w-70 h-70 object-contain"
          />
        </div>

        {/* Sağ üst köşe - Education Background 2 */}
        <div className="absolute top-10 right-10 opacity-15 transform -rotate-8">
          <img 
            src="/images/education-bg-2.png" 
            alt="Education Background" 
            className="w-70 h-70 object-contain"
          />
        </div>

        {/* Sol alt köşe - Education Background 3 */}
        <div className="absolute bottom-10 left-40 opacity-15 transform rotate-15">
          <img 
            src="/images/education-bg-3.png" 
            alt="Education Background" 
            className="w-80 h-80 object-contain"
          />
        </div>

        {/* Sağ alt köşe - Education Background 4 */}
        <div className="absolute bottom-10 right-10 opacity-15 transform -rotate-30">
          <img 
            src="/images/education-bg-4.png" 
            alt="Education Background" 
            className="w-60 h-60 object-contain"
          />
        </div>
      </div>

      <div className="card max-w-md w-full space-y-8 relative z-10">
>>>>>>> 7480609 (tasarımsal düzeltmeler)
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Giriş Yap
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-600">
              Hemen kayıt olun
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormInput
              label="E-posta Adresi"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <FormInput
              label="Şifre"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-600">
                Şifremi unuttum
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Giriş Yap
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
