import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'
import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette: {
    primary: {
      dark: blue[900],
      light: blue[600],
      main: blue[800],
    },
    secondary: {
      dark: red[900],
      light: red[500],
      main: red[800],
    },
  },
})
