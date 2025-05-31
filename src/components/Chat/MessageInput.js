
import React, { useState } from 'react';
import { Box, TextField, IconButton, makeStyles } from '@material-ui/core';
import { Send, Schedule } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    borderTop: '1px solid #e0e0e0',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
}));

const MessageInput = ({ onSend, onSchedule }) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box className={classes.root}>
      <TextField
        className={classes.input}
        variant="outlined"
        placeholder="Type a message"
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <IconButton onClick={() => onSchedule()} color="primary">
        <Schedule />
      </IconButton>
      <IconButton onClick={handleSend} color="primary" disabled={!message.trim()}>
        <Send />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
