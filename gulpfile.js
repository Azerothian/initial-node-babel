require("babel-core/register");
const gulp = require("gulp");
const eslint = require("gulp-eslint");
const del = require("del");
const mocha = require("gulp-mocha");
const babel = require("gulp-babel");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config");
const nodemon = require("gulp-nodemon");

const path = require("path");

gulp.task("webpack:dev-server", ["compile", "watch"], (callback) => {
  // Start a webpack-dev-server
  //webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080", "webpack/hot/dev-server");
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  var compiler = webpack(webpackConfig);
  new WebpackDevServer(compiler, {
    contentBase: path.resolve(__dirname, "./build/public/"),
    hot: true,
    inline: true,
    // historyApiFallback: false,
    // quiet: false,
    // noInfo: false,
    // lazy: true,
    // filename: "bundle.js",
    // watchOptions: {
      // aggregateTimeout: 300,
      // poll: 1000,
    // },
    publicPath: webpackConfig.output.publicPath,
    // stats: {colors: true},
    // proxy: {
    //   "*": {
    //     target: "http://localhost",
    //     secure: false,
    //   },
    // },
  }).listen(8080, "localhost", (err) => {
    if (err) {
      throw err;
    }
    // return nodemon({
    //   script: "build/server/index.js",
    //   ignore: ["build/react-app/**/*.js", "build/public/**/*.js"],
    //   ext: "html js",
    // }).on("restart", () => {
    //   console.log("restarted!");
    // });
  });
});

gulp.task("webpack:build", ["compile"], (callback) => {
	// run webpack
  var compiler = webpack(webpackConfig);
  compiler.run(function(err, stats) {
    console.log(stats.toString({
      assets: true,
      timings: true,
      chunks: true,
      modules: true,
      hash: true,
    }));
    callback();
  });
});

gulp.task("copy", () => {
  return gulp.src("src/public/**/*")
  .pipe(gulp.dest("build/public/"));
});
gulp.task("clean", () => {
  return del(["build/**/*"]);
});

gulp.task("compile", ["clean", "lint"], () => {
  return gulp.src("src/**/*")
    .pipe(babel({}))
    .pipe(gulp.dest("build"));
});

gulp.task("test", ["compile"], function() {
  return gulp.src("./build/tests/**/*.js")
    .pipe(mocha());
});

gulp.task("lint", ["clean"], () => {
  return gulp.src(["src/**/*.js"])
    .pipe(eslint({
      fix: true,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("watch", () => {
  gulp.watch("src/react-app/*.*", ["default"]);
  gulp.watch("src/server/*.*", ["default"]);
  gulp.watch("src/public/**/*.*", ["copy"]);
});

gulp.task("default", ["test"]);
