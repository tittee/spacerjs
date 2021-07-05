const tailwindcss = require('tailwindcss');

module.exports = {
  parser: false,
  map: false,
  plugins: [
    require('postcss-import'),
    tailwindcss,
    require('postcss-custom-properties'),
    require('postcss-preset-env')({ stage: 1 }),
    require('cssnano'),
    require('autoprefixer')    
  ]
}
