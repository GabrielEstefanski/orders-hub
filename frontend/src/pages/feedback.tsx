import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../components/buttons/Button';
import CustomInput from '../components/inputs/Custom';
import AuthForm from '../components/forms/Auth';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface FeedbackFormInputs {
  name: string;
  email: string;
  linkedin: string;
  message: string;
}

export default function Feedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState } = useForm<FeedbackFormInputs>();

  const onSubmitFeedback: SubmitHandler<FeedbackFormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Dados do feedback:', data);
      toast.success("Feedback enviado com sucesso! Obrigado pela sua contribuição.");
    } catch (error) {
      toast.error("Ocorreu um erro ao enviar o feedback. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <AuthForm
      title={
        <div className="space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
            <i className="fas fa-comments text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Compartilhe seu Feedback
          </h2>
        </div>
      }
      subtitle="Sua opinião é muito importante para melhorarmos o Orders Hub"
      onSubmit={onSubmitFeedback}
      register={register}
      handleSubmit={handleSubmit}
      formState={formState}
      body={(register) => (
        <div className="space-y-4">
          <CustomInput
            label="Nome completo"
            type="text"
            id="name"
            placeholder="João Silva"
            icon={<i className="fas fa-user text-gray-400" />}
            register={register('name', { 
              required: 'Nome é obrigatório',
              minLength: {
                value: 3,
                message: 'Nome deve ter no mínimo 3 caracteres'
              }
            })}
            required
          />
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
            required
          />
          <CustomInput
            label="LinkedIn (opcional)"
            type="url"
            id="linkedin"
            placeholder="https://linkedin.com/in/seu-perfil"
            icon={<i className="fab fa-linkedin text-gray-400" />}
            register={register('linkedin', {
              pattern: {
                value: /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/.*$/i,
                message: "URL do LinkedIn inválida"
              }
            })}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sua mensagem
            </label>
            <textarea
              {...register('message', {
                required: 'Mensagem é obrigatória',
                minLength: {
                  value: 10,
                  message: 'Mensagem deve ter no mínimo 10 caracteres'
                }
              })}
              className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                dark:focus:ring-purple-400/20 dark:focus:border-purple-400
                text-gray-900 dark:text-white placeholder-gray-400
                transition-all duration-200
                resize-none"
              placeholder="Compartilhe sua experiência com o Orders Hub..."
              required
            />
          </div>
        </div>
      )}
      footer={
        <div className="space-y-6">
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
              dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
              text-white font-medium py-2.5 rounded-xl transition-all duration-200
              shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20
              hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/15
              transform hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane mr-2" />
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </Button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-center text-gray-500 dark:text-gray-400 p-4 rounded-xl
              bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm
              border border-gray-200/50 dark:border-gray-700/50"
          >
            <p>
              Seu feedback será compartilhado no LinkedIn como um depoimento sobre o Orders Hub.
              Agradecemos sua contribuição para o crescimento do projeto! 🚀
            </p>
          </motion.div>
        </div>
      }
    />
  );
} 