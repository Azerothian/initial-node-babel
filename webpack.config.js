const path = require("path");

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, "./src/react-app/index.js"),
    ],
  },
  output: {
    path: path.resolve(__dirname, "./build/public/assets/"),
    publicPath: "/assets/",
    filename: "bundle.js",
  },
  plugins: [],
};
