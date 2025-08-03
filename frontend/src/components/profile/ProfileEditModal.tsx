import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { User } from '../../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userData: { bio: string, avatarUrl?: string }) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [bio, setBio] = useState<string>(user?.profile?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real implementation, you would upload the image to a server
      // and get back a URL. For now, we'll just use the existing URL or preview
      const avatarUrl = avatarPreview || user?.profile?.avatarUrl;
      
      // Call the onSave callback with the updated data
      onSave({ bio, avatarUrl });
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profili Düzenle">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profil Fotoğrafı
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  className="h-24 w-24 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                  src={avatarPreview || user?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=4f46e5&color=fff`}
                  alt={`${user?.firstName} ${user?.lastName}`}
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 inline-flex items-center p-1.5 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                >
                  <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    id="avatar-upload"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  JPG, PNG veya GIF. Maksimum 2MB.
                </p>
                <label
                  htmlFor="avatar-upload-btn"
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                >
                  Fotoğraf Seç
                  <input
                    id="avatar-upload-btn"
                    name="avatar-btn"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hakkımda
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Kısa bir özgeçmiş veya kendiniz hakkında bilgiler..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              İptal
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Kaydet
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileEditModal;
