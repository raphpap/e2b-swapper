import React from "react";
import blue from "@material-ui/core/colors/blue";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  link: {
    textDecoration: 'none',
    color: '#fff'
  },
  bar: {
    background: `${blue[900]}`
  }
});

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bar}>
        <Toolbar>
          <Grid item xs>
          <Link to="/" className={classes.link}>
            <Typography variant="h6" color="inherit">
              E2B Swapper
            </Typography>
            </Link>
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="inherit">
              Trustlessly swap ethereum and bitcoin
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
