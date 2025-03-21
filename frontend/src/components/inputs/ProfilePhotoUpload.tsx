import { useRef, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface ProfilePhotoUploadProps {
  register?: UseFormRegisterReturn;
  onChange?: (file: File | null) => void;
  defaultImage?: string;
}

const ProfilePhotoUpload = ({ register, onChange, defaultImage }: ProfilePhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group cursor-pointer" onClick={handleClick}>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-200" />
        <div className="relative w-32 h-32 rounded-full border-2 border-white/50 dark:border-gray-800/50 overflow-hidden
          transform group-hover:scale-105 transition duration-200">
          <img
            src={preview || defaultImage || '/default-avatar.jpg'}
            alt="Foto do perfil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <i className="fa fa-camera text-white text-2xl" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 
          hover:text-blue-700 dark:hover:text-blue-300
          focus:outline-none focus:underline
          transition-colors duration-200"
      >
        Escolher foto
      </button>

      <input
        type="file"
        ref={(e) => {
          fileInputRef.current = e;
          register?.ref && register.ref(e);
        }}
        className="hidden"
        accept="image/*"
        onChange={(event) => {
          handleFileChange(event);
          register?.onChange?.(event);
        }}
        {...(register ? { name: register.name } : {})}
      />
    </div>
  );
};

export default ProfilePhotoUpload; 