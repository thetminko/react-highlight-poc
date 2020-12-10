module.exports = {
  purge: ['./public/index.html', './src/**/*.tsx'],
  // Use below to purge even in non-production NODE_ENV
  // purge: {
  //   enabled: true,
  //   content: ['./public/index.html', './src/**/*.tsx'],
  // },
  theme: {
    extend: {},
  },
  variants: {
		backgroundColor: ['responsive', 'hover', 'focus'] // allow hover, focus for background color, https://tailwindcss.com/docs/pseudo-class-variants
	},
  plugins: [],
}