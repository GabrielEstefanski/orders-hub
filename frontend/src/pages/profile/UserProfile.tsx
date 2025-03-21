import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../hooks/useUser';
import { toast } from 'react-toastify';
import CustomInput from '../../components/inputs/Custom';

interface UserProfileForm {
  name: string;
  email: string;
  profilePhoto: File | null;
}

const UserProfile = () => {
  const { user, fetchUser } = useUser();
  const [form, setForm] = useState<UserProfileForm>({
    name: user?.name || '',
    email: user?.email || '',
    profilePhoto: null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.profilePhoto) {
      setPreviewUrl(user.profilePhoto);
    }
  }, [user]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, profilePhoto: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (form.profilePhoto) {
        formData.append('profilePhoto', form.profilePhoto);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await fetchUser();
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 
            rounded-2xl flex items-center justify-center mx-auto mb-4
            shadow-[0_0_15px_theme(colors.blue.400/30)]
            dark:shadow-[0_0_15px_theme(colors.blue.500/25)]">
            <i className="fas fa-user-circle text-3xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
            dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent
            drop-shadow-[0_0_2px_theme(colors.blue.400/30)]">
            Seu Perfil
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie suas informações pessoais
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8
            shadow-[0_0_20px_theme(colors.blue.400/15)]
            dark:shadow-[0_0_20px_theme(colors.blue.500/10)]
            border border-white/20 dark:border-gray-700/20
            backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                  rounded-full blur opacity-40 group-hover:opacity-75 group-hover:scale-110 transition duration-300" />
                <div className="relative">
                  <img
                    src={previewUrl || 'https://github.com/shadcn.png'}
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/50 dark:border-gray-800/50
                      shadow-[0_0_20px_theme(colors.blue.400/25)]
                      dark:shadow-[0_0_20px_theme(colors.blue.500/20)]
                      transform group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      console.error('Erro ao carregar imagem de perfil:', e);
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://github.com/shadcn.png';
                    }}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 p-3 rounded-full
                      bg-gradient-to-r from-blue-500 to-purple-500 
                      hover:from-blue-600 hover:to-purple-600
                      dark:from-blue-400 dark:to-purple-400
                      dark:hover:from-blue-500 dark:hover:to-purple-500
                      shadow-[0_0_15px_theme(colors.blue.400/30)]
                      dark:shadow-[0_0_15px_theme(colors.blue.500/25)]
                      transform hover:scale-110
                      transition-all duration-200
                      cursor-pointer"
                  >
                    <i className="fas fa-camera text-white text-lg
                      drop-shadow-[0_0_2px_theme(colors.blue.400/50)]" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <CustomInput
                label="Nome completo"
                type="text"
                id="name"
                value={form.name}
                onChange={(value) => setForm(prev => ({ ...prev, name: value }))}
                placeholder="João Silva"
                icon={<i className="fas fa-user" />}
                required
              />

              <CustomInput
                label="Email"
                type="email"
                id="email"
                value={form.email}
                onChange={(value) => setForm(prev => ({ ...prev, email: value }))}
                placeholder="seuemail@gmail.com"
                icon={<i className="fas fa-envelope" />}
                required
              />
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-xl
                  bg-gradient-to-r from-blue-500 to-purple-500 
                  hover:from-blue-600 hover:to-purple-600
                  dark:from-blue-400 dark:to-purple-400
                  dark:hover:from-blue-500 dark:hover:to-purple-500
                  text-white font-medium
                  shadow-[0_0_15px_theme(colors.blue.400/30)]
                  dark:shadow-[0_0_15px_theme(colors.blue.500/25)]
                  hover:shadow-[0_0_25px_theme(colors.blue.400/40)]
                  dark:hover:shadow-[0_0_25px_theme(colors.blue.500/35)]
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2"
              >
                {isLoading ? (
                  <i className="fas fa-circle-notch fa-spin" />
                ) : (
                  <>
                    <i className="fas fa-save" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile; 