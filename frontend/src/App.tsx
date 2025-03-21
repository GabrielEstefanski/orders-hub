import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Router from './routes/router';
import { ThemeProvider } from './context/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import { useUser } from './hooks/useUser';

const App = () => {
  const { fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <main>
        <ThemeProvider>
          <Router/>
        </ThemeProvider>
      </main>
      <ToastContainer />
    </>
  )
}

export default App
