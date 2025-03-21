import { JSX, ReactNode } from "react";
import { UseFormRegister, FieldValues, SubmitHandler, UseFormHandleSubmit, FormState } from "react-hook-form";
import { motion } from "framer-motion";

interface AuthFormProps<T extends FieldValues> {
  title?: ReactNode;
  subtitle?: string;
  body?: (register: UseFormRegister<T>, formState: FormState<T>) => JSX.Element;
  footer?: JSX.Element;
  onSubmit: SubmitHandler<T>;
  register: UseFormRegister<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  formState: FormState<T>;
}

const AuthForm = <T extends FieldValues>({
  title,
  subtitle,
  body,
  footer,
  onSubmit,
  register,
  handleSubmit,
  formState
}: AuthFormProps<T>): JSX.Element => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const titleAnimation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  };

  const subtitleAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, delay: 0.3 }
  };

  const formAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.4 }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center">
      <motion.div 
        {...fadeIn}
        className="w-full max-w-md px-6 py-8"
      >
        <div className="relative overflow-hidden rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100/50 dark:border-gray-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 
            dark:from-blue-400/[0.03] dark:via-purple-400/[0.03] dark:to-pink-400/[0.03]" />

          <div className="absolute -right-6 -top-6 w-32 h-32 
            bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10
            dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5
            rounded-full blur-2xl opacity-50" />

          <div className="relative p-8">
            <div className="space-y-2 mb-8">
              {title && (
                <motion.div 
                  {...titleAnimation}
                >
                  {title}
                </motion.div>
              )}
              {subtitle && (
                <motion.p 
                  {...subtitleAnimation}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>

            <motion.form 
              {...formAnimation}
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {body && body(register, formState)}
              <div className="space-y-4">
                {footer}
              </div>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AuthForm;

