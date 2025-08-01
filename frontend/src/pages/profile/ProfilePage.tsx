import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import ProfileEditModal from '../../components/profile/ProfileEditModal';
import { updateProfile } from '../../store/slices/authSlice';

const ProfilePage = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Debug user data
  useEffect(() => {
    console.log('User data in ProfilePage:', user);
  }, [user]);

  // Handle opening the edit modal
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Handle saving profile changes
  const handleSaveProfile = (profileData: { bio: string, avatarUrl?: string }) => {
    if (user) {
      // Dispatch action to update profile
      dispatch(updateProfile({
        userId: user.id,
        profileData: {
          ...profileData
        }
      }) as any);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profilim</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Kişisel bilgilerinizi görüntüleyin ve düzenleyin
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  className="h-24 w-24 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                  src={user?.profile?.avatarUrl || (user?.full_name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=4f46e5&color=fff` : '')}
                  alt={user?.full_name || ''}
                />
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 inline-flex items-center p-1.5 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={handleOpenEditModal}
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <h2 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
                {user?.full_name || `${user?.firstName || ''} ${user?.lastName || ''}`}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Hakkımda</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {user?.profile?.bio || "Kısa bir özgeçmiş veya kendiniz hakkında bilgiler buraya gelebilir."}
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleOpenEditModal}
              >
                Profili Düzenle
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Hesap Ayarları
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin.
            </p>

            <div className="mt-6 space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Kişisel Bilgiler
                </h4>
                <dl className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ad</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user?.firstName || (user?.full_name ? user.full_name.split(' ')[0] : '')}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Soyad</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user?.lastName || (user?.full_name ? user.full_name.split(' ').slice(1).join(' ') : '')}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">E-posta adresi</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {user?.email}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-6">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Şifre Değiştir
                </h4>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      name="current-password"
                      id="current-password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      name="new-password"
                      id="new-password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Şifreyi Güncelle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;
