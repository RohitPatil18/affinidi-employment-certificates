import { createMuiTheme } from '@material-ui/core/styles';

/**
 *  This is where we define all the theme style that we want to reflect in the enitre application.
 */

export const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#363b98',
		},
		secondary: {
			light: '#0066ff',
			main: '#16425B',
			// dark: will be calculated from palette.secondary.main,
			contrastText: '#ffffff',
		},
		// Used by `getContrastText()` to maximize the contrast between
		// the background and the text.
		contrastThreshold: 3,
		// Used by the functions below to shift a color's luminance by approximately
		// two indexes within its tonal palette.
		// E.g., shift from Red 500 to Red 300 or Red 700.
		tonalOffset: 0.2,
	},
});
