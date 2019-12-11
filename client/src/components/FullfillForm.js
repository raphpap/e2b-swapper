import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Paper, TextField } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '40px'
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

export default function AcceptForm(props) {
  const [transactionHash, setTransactionHash] = useState('');

  const classes = useStyles();
  const {
    onChange,
    handleFullfillContract,
    exists,
    eBtcAddress,
    bEthAddress
  } = props;

  return (
    <div className={classes.root} >
      <form className={classes.form} noValidate autoComplete="off">
        <Paper className={classes.paper}>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Fullfill a Contract
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

          <TextField
            id="transactionHash"
            className={classes.input}
            value={transactionHash}
            label="BTC transaction ID with at least 6 confirmations"
            onChange={e => setTransactionHash(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            disabled={!exists || bEthAddress === '0x0000000000000000000000000000000000000000'}
          />

          <Button
            color="secondary"
            className={classes.button}
            variant="contained"
            disabled={!exists || bEthAddress === '0x0000000000000000000000000000000000000000'}
            onClick={() => handleFullfillContract({
              transactionHash
            })}
            fullWidth
          >
            Fullfill contract
          </Button>
        </Paper>
      </form>
    </div>
  );
}
