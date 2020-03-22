import React from 'react'
import blue from '@material-ui/core/colors/blue'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '0 32px'
  },
  name: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '32px',
    haight: '32px',
    margin: '3px',
  },
  bar: {
    background: `${blue[900]}`
  },
  text: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0 32px'
  }
});

export default function Header() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bar}>
        <Toolbar>
          <Grid item xs>
            <Link to="/" className={classes.link}>
              <Typography variant="h6" color="inherit" className={classes.name}>
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" className={classes.logo} />
              </Typography>
            </Link>
          </Grid>
          <Grid item xs className={classes.text}>
            <Typography variant="body2" color="inherit">
              Trustlessly trade ethereum for bitcoin
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  )
}
