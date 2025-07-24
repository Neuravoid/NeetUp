import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import type { RegisterRequest } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { register as registerUser, clearError } from '../../store/slices/authSlice';

// Form values interface that includes confirmPassword for validation
interface RegisterFormValues extends RegisterRequest {
  confirmPassword: string;
}

// Form validation schema
const schema = yup.object().shape({
  full_name: yup.string().required('Ad Soyad alanı zorunludur'),
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi girin')
    .required('E-posta adresi zorunludur'),
  password: yup
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    )
    .required('Şifre zorunludur'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur')
});

const RegisterPage: React.FC = () => {
  const { 
    register: registerField, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
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

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      // Remove confirmPassword before sending to the API
      const { confirmPassword, ...userData } = data;
      const result = await dispatch(registerUser(userData) as any);
      
      // If registration is successful, redirect to login
      if (result.payload && result.payload.success) {
        navigate('/login');
      }
    } catch (error) {
      // Error is already handled by the auth slice
      console.error('Registration failed:', error);
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

        {/* Sağ alt köşe - Education Background 3 (küçük) */}
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
            Hesap Oluştur
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-600">
              Giriş yapın
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FormInput
              label="Ad Soyad"
              id="full_name"
              autoComplete="name"
              {...registerField('full_name')}
              error={errors.full_name?.message}
            />
          </div>

          <div className="space-y-4">
            <FormInput
              label="E-posta Adresi"
              id="email"
              type="email"
              autoComplete="email"
              {...registerField('email')}
              error={errors.email?.message}
            />
            <FormInput
              label="Şifre"
              id="password"
              type="password"
              autoComplete="new-password"
              {...registerField('password')}
              error={errors.password?.message}
              helper="En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir"
            />
            <FormInput
              label="Şifre Tekrar"
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...registerField('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              <a href="#" className="font-medium text-primary hover:text-primary-600">
                Kullanım koşullarını
              </a>{' '}
              ve{' '}
              <a href="#" className="font-medium text-primary hover:text-primary-600">
                Gizlilik Politikasını
              </a>{' '}
              kabul ediyorum
            </label>
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Kayıt Ol
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
