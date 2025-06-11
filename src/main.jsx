import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App';
import './index.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const cache = new InMemoryCache({
  typePolicies: {
    ReceptoriaUser: {
      keyFields: ["id"],
      merge(existing, incoming) {
        const merged = { ...existing, ...incoming };

        if (existing?.avatarUrl && incoming?.avatarUrl == null) {
          merged.avatarUrl = existing.avatarUrl;
        }

        return merged;
      },
    },
  },
});


const uploadLink = createUploadLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      "GraphQL-preflight": "1",
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: cache,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);