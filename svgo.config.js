module.exports = {
  multipass: true,
  plugins: [
    "preset-default",
    { name: "removeViewBox", active: false },
    { name: "removeDimensions", active: true },
    { name: "cleanupIds", active: true },
    { name: "convertColors", params: { currentColor: true } },
  ],
};
