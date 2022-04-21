module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      boxShadow: {
        modal: `1px 0px 7px -3px rgb(0 0 0 / 42%)`,
        button: `0 1.5px 1px var(--shadow-color-button)`,
        base: `var(--shadow-base)`,
        large: `var(--shadow-large)`,
        tiny: `var(--shadow-tiny)`,
      },
    },
  },
  variants: {},
  plugins: [],
}
