module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-prefix-selector')({
      prefix: '.chat-message-switcher-container',
      transform (prefix, selector, prefixedSelector) {
        // Avoid prefixing global selectors
        if (selector.startsWith('html') || selector.startsWith('body')) {
          return selector;
        }
        return prefixedSelector;
      },
    }),
  ],
};