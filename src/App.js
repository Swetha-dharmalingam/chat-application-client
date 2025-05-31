import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {Login} from '/components/Auth/Login';
import Register from './components/Auth/Register';
import ChatPage from './components/Chat/ChatPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <ChatPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
