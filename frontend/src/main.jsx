import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.jsx'
import store from './store/store.jsx'

const queryClient = new QueryClient({
  defaultOptions : {
    queries : {
      refetchOnWindowFocus : false  
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
             <App />
        </QueryClientProvider>
    </Provider>
    
  </StrictMode>,
)
