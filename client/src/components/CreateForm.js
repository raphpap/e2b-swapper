import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, InputAdornment, Paper, TextField } from "@material-ui/core";

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

export default function CreateForm(props) {
  const [offeredEth, setOfferedEth] = useState(0);
  const [requestedBtc, setRequestedBtc] = useState(0);
  const [requestedEthCollateral, setRequestedEthCollateral] = useState(0);

  const classes = useStyles();
  const {
    onChange,
    handleCreateContract,
    exists,
    eBtcAddress
  } = props;

  return (
    <div className={classes.root} >
      <form className={classes.form} noValidate autoComplete="off">
        <Paper className={classes.paper}>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Create a Contract
          </Typography>

          <TextField
            id="eBtcAddress"
            className={classes.input}
            value={eBtcAddress}
            onChange={e => onChange(e.target.value)}
            label="Your receiving BTC address"
            fullWidth
            variant="outlined"
            error={exists}
            helperText={exists && "Please use a BTC address not already used in a contract"}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            id="offeredEth"
            className={classes.input}
            value={offeredEth}
            onChange={e => setOfferedEth(e.target.value)}
            label="How much ETH are you offering"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
            }}
            type="number"
            disabled={exists}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            id="requestedBtc"
            className={classes.input}
            value={requestedBtc}
            onChange={e => setRequestedBtc(e.target.value)}
            label="How much BTC are you requesting"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
            }}
            type="number"
            disabled={exists}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            id="requestedEthCollateral"
            className={classes.input}
            value={requestedEthCollateral}
            onChange={e => setRequestedEthCollateral(e.target.value)}
            label="How much ETH are you requesting as a collateral"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
            }}
            type="number"
            disabled={exists}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            color="secondary"
            className={classes.button}
            variant="contained"
            onClick={() => handleCreateContract({
              offeredEth,
              requestedBtc,
              requestedEthCollateral
            })}
            fullWidth
            disabled={exists || offeredEth === 0 || requestedBtc === 0 || requestedEthCollateral === 0}
          >
            Create contract
          </Button>
        </Paper>
      </form>
    </div>
  );
}
