import { SubmitHandler } from 'react-hook-form';
import { Button } from '../../components/buttons/Button';
import CustomInput from '../../components/inputs/Custom';
import AuthForm from '../../components/forms/Auth';
import { Link } from '../../components/links/Link';
import { useAuth } from '../../hooks/useAuth';
import Checkbox from '../../components/inputs/CheckBox';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { type LoginFormInputs } from '../../types/AuthInputs';
import { useState } from 'react';
import PasswordInput from '../../components/inputs/PasswordInput';

export default function Login() {
  const { register, handleSubmit, onLogin, formState } = useAuth<LoginFormInputs>();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const { errors } = formState;

  const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs) => {
    try {
      const response = await onLogin({ ...data, rememberMe });

      if (response?.success) {
        toast.success("Login realizado com sucesso!");
        navigate("/orders");
      } else {
        toast.error("Falha ao realizar login. Verifique suas credenciais.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar fazer login. Tente novamente.");
    }
  };

  return (
    <AuthForm
      title={
        <div className="space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto">
            <i className="fas fa-user-circle text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mt-4">
            Bem-vindo de volta!
          </h2>
        </div>
      }
      subtitle="Entre com suas credenciais para acessar sua conta"
      onSubmit={onSubmitLogin}
      register={register}
      handleSubmit={handleSubmit}
      formState={formState}
      body={(register) => (
        <>
          <div className="space-y-4">
            <CustomInput
              label="Email"
              type="email"
              id="email"
              placeholder="seuemail@gmail.com"
              icon={<i className="fas fa-envelope text-gray-400" />}
              register={register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido"
                }
              })}
              error={errors.email?.message}
              required
            />
            <PasswordInput
              id="password"
              label="Senha"
              placeholder="****************"
              register={register('password', { 
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter no mínimo 6 caracteres'
                }
              })}
              error={errors.password?.message}
              showPasswordRequirements={false}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              label={
                <span className="text-gray-600 dark:text-gray-300">
                  Lembre-se de mim
                </span>
              }
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link 
              href="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                font-medium transition-colors duration-200"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </>
      )}
      footer={
        <div className="space-y-6">
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
              dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
              text-white font-medium py-2.5 rounded-xl transition-all duration-200
              shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20
              hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/15
              transform hover:-translate-y-0.5"
          >
            <i className="fas fa-sign-in-alt mr-2" />
            Entrar
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                ou continue com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
              <i className="fab fa-google text-gray-600 dark:text-gray-400" />
            </button>
            <button className="flex items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
              <i className="fab fa-github text-gray-600 dark:text-gray-400" />
            </button>
            <button className="flex items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
              <i className="fab fa-microsoft text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Não possui conta ainda?{' '}
            <Link 
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                transition-colors duration-200"
            >
              Criar conta
            </Link>
          </p>
        </div>
      }
    />
  );
}
