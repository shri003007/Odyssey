'use client';

import { Provider } from 'react-redux';
import { store } from './store';

interface ClientProviderProps {
  children: React.ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default ClientProvider; 