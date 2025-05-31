import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.emit('join', user.id);
 newSocket.on('newMessage', (message) => {
        if (
          (message.sender._id === selectedContact?._id && message.receiver._id === user.id) ||
          (message.receiver._id === selectedContact?._id && message.sender._id === user.id)
        ) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => newSocket.close();
    }
  }, [user, selectedContact]);

  const getContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
  }
      };
      const res = await axios.get('/api/chat/contacts', config);
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
  setLoading(false);
    }
  };

  const getMessages = async (contactId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const res = await axios.get(`/api/chat/messages/${contactId}`, config);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const res = await axios.post('/api/chat/send', {
        receiverId: selectedContact._id,
        content
      }, config);
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };
  const scheduleMessage = async (content, scheduledTime) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
  await axios.post('/api/chat/schedule', {
        receiverId: selectedContact._id,
        content,
        scheduledTime
      }, config);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const searchUsers = async (query) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
  const res = await axios.get(`/api/auth/search?query=${query}`, config);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    if (contact) {
      getMessages(contact._id);
    }
  };

  return (
    <ChatContext.Provider value={{
      contacts,
      selectedContact,
      messages,
      loading,
  getContacts,
      sendMessage,
      scheduleMessage,
      searchUsers,
      selectContact
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
