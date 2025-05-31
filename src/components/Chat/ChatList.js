import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { List, ListItem, ListItemText, Avatar, Typography, TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  search: {
    padding: theme.spacing(2),
  },
  list: {
    flex: 1,
    overflowY: 'auto',
  },
  active: {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ChatList = () => {
  const classes = useStyles();
  const { contacts, loading, selectedContact, selectContact, searchUsers } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(async () => {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchUsers]);

  const handleContactClick = (contact) => {
    selectContact(contact);
  };

  const displayItems = searchQuery ? searchResults : contacts;

  return (
    <Box className={classes.root}>
      <Box className={classes.search}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <List className={classes.list}>
        {loading && !displayItems.length ? (
          <Typography align="center">Loading...</Typography>
        ) : displayItems.length === 0 ? (
          <Typography align="center">No contacts found</Typography>
        ) : (
          displayItems.map((contact) => (
            <ListItem
              key={contact._id}
              button
              onClick={() => handleContactClick(contact)}
              className={selectedContact?._id === contact._id ? classes.active : ''}
            >
              <Avatar>{contact.name.charAt(0)}</Avatar>
              <ListItemText
                primary={contact.name}
                secondary={contact.email}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default ChatList;
