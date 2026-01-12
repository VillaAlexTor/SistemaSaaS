const fs = require('fs');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

(async () => {
  try {
    const input = fs.readFileSync('src/index.css', 'utf8');
    const result = await postcss([tailwind, autoprefixer]).process(input, {
      from: 'src/index.css',
      to: 'src/tailwind-output.css',
      map: false,
    });
    fs.writeFileSync('src/tailwind-output.css', result.css);
    console.log('Generated src/tailwind-output.css — length:', result.css.length);
  } catch (err) {
    console.error('Error processing Tailwind:', err);
    process.exit(1);
  }
})();
