import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  makeStyles 
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minWidth: '400px',
  },
}));

const ScheduleMessageModal = ({ open, onClose, onSchedule }) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState(new Date());

  const handleSchedule = () => {
    if (message.trim()) {
      onSchedule(message, scheduledTime);
      setMessage('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule Message</DialogTitle>
      <DialogContent className={classes.content}>
        <TextField
          label="Message"
          multiline
          rows={4}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <DateTimePicker
          label="Schedule Time"
          value={scheduledTime}
          onChange={setScheduledTime}
          minDate={new Date()}
          showTodayButton
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleSchedule} 
          color="primary" 
          variant="contained"
          disabled={!message.trim()}
        >
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleMessageModal;
