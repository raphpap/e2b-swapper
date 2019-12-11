import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Grid, InputAdornment, TextField } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    marginTop: '40px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    minWidth: '400px',
    padding: '24px'
  },
  input: {
    marginBottom: '24px'
  }
});

export default function AcceptForm(props) {
  const classes = useStyles();
  const {
    web3,
    onChange,
    handleAcceptContract,
    exists,
    eBtcAddress,
    requestedEthCollateral
  } = props;

  return (
    <div className={classes.root} >
      <Typography variant="h6" color="inherit">
        Accept a Contract
      </Typography>

      <form className={classes.form} noValidate autoComplete="off">
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
            id="requestedEthCollateral"
            className={classes.input}
            value={requestedEthCollateral && web3.utils.fromWei(requestedEthCollateral, 'ether')}
            label="How much ETH is requested as a collateral"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
            }}
            readOnly
          />

          <Button
            color="secondary"
            className={classes.button}
            variant="contained"
            disabled={!exists}
            onClick={() => handleAcceptContract()}
          >
            Accept contract
          </Button>
      </form>
    </div>
  );
}
