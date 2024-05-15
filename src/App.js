import router from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { RouterProvider } from 'react-router-dom';
import ReduxProvider from './redux/ReduxProvider';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          fontFamily: 'saira, sans-serif',
          colorPrimary: '#095a89',
        },
      }}
    >
      <ReduxProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ReduxProvider>
    </ConfigProvider>
  );
}

export default App;
