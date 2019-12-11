import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Paper, TextField } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    minWidth: '400px',
    padding: '24px'
  },
  paper: {
    padding: '24px'
  },
  input: {
    marginBottom: '32px'
  },
  title: {
    marginBottom: '24px'
  }
});

export default function CancelForm(props) {
  const classes = useStyles();
  const {
    onChange,
    handleCancelContract,
    exists,
    eBtcAddress
  } = props;

  return (
    <div className={classes.root} >

      <form className={classes.form} noValidate autoComplete="off">
        <Paper className={classes.paper}>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Cancel a Contract
          </Typography>
          <TextField
            id="eBtcAddress"
            className={classes.input}
            value={eBtcAddress}
            onChange={e => onChange(e.target.value)}
            label="The receiving BTC address"
            fullWidth
            variant="outlined"
            error={!exists}
            helperText={!exists && "Please enter a BTC address used in a contract"}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            color="secondary"
            className={classes.button}
            variant="contained"
            disabled={!exists}
            onClick={() => handleCancelContract()}
            fullWidth
          >
            Cancel contract
          </Button>
        </Paper>
      </form>
    </div>
  );
}
