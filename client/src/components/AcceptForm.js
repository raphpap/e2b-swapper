import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Button, InputAdornment, Paper, TextField } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    minWidth: '400px',
    padding: '24px',
  },
  paper: {
    padding: '24px',
  },
  input: {
    marginBottom: '32px',
  },
  title: {
    marginBottom: '24px',
  },
})

export default function AcceptForm(props) {
  const classes = useStyles()
  const {
    web3,
    onChange,
    handleAcceptContract,
    exists,
    eBtcAddress,
    requestedEthCollateral,
  } = props

  return (
    <div className={classes.root}>
      <form className={classes.form} noValidate autoComplete="off">
        <Paper className={classes.paper}>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Accept a Contract
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
            helperText={
              !exists && 'Please enter a BTC address used in a contract'
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            id="requestedEthCollateral"
            className={classes.input}
            value={
              requestedEthCollateral &&
              web3.utils.fromWei(requestedEthCollateral, 'ether')
            }
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
            fullWidth
          >
            Accept contract
          </Button>
        </Paper>
      </form>
    </div>
  )
}
