"use strict"; //eslint-disable-line
require("babel-core/register");
const gulp = require("gulp");
const eslint = require("gulp-eslint");
const del = require("del");
const mocha = require("gulp-mocha");
const babel = require("gulp-babel");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config");
const sourcemaps = require("gulp-sourcemaps");

gulp.task("webpack:dev-server", ["default", "watch"], (callback) => {
  // Start a webpack-dev-server
  //webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("development"),
    },
  }));
  var compiler = webpack(webpackConfig);
  new WebpackDevServer(compiler, {
    //contentBase: path.resolve(__dirname, "./build/public/"),
    //hot: true,
    inline: true,
    // historyApiFallback: false,
    // quiet: false,
    noInfo: false,
    // lazy: true,
    // filename: "bundle.js",
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    publicPath: webpackConfig.output.publicPath,
    stats: {colors: true},
    proxy: {
      "*": {
        target: "http://localhost:18081",
        secure: false,
      },
    },
  }).listen(18080, "localhost");

});

gulp.task("webpack:build", ["compile:webapp"], (callback) => {
	// run webpack
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production"),
    },
  }));
  webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
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

gulp.task("copy:public", ["clean:public"], () => {
  return gulp.src("src/public/**/*")
  .pipe(gulp.dest("build/public/"));
});

gulp.task("clean:server", () => {
  return del(["build/server/**/*"]);
});
gulp.task("clean:webapp", () => {
  return del(["build/webapp/**/*"]);
});
gulp.task("clean:tests", () => {
  return del(["build/tests/**/*"]);
});

gulp.task("clean:public", () => {
  return del(["build/public/**/*"]);
});

gulp.task("compile:server", ["lint:server"], () => {
  return gulp.src(["src/server/**/*"])
    .pipe(sourcemaps.init({identityMap: true}))
    .pipe(babel({}))
    .pipe(sourcemaps.write(".", {includeContent: true}))
    .pipe(gulp.dest("build/server"));
});

gulp.task("compile:webapp", ["lint:webapp"], () => {
  return gulp.src(["src/webapp/**/*"])
    .pipe(sourcemaps.init({identityMap: true}))
    .pipe(babel({}))
    .pipe(sourcemaps.write(".", {includeContent: true}))
    .pipe(gulp.dest("build/webapp"));
});
gulp.task("compile:tests", ["lint:tests"], () => {
  return gulp.src(["src/tests/**/*"])
    .pipe(sourcemaps.init({identityMap: true}))
    .pipe(babel({}))
    .pipe(sourcemaps.write(".", {includeContent: true}))
    .pipe(gulp.dest("build/tests"));
});


gulp.task("lint:server", ["clean:server"], () => {
  return gulp.src(["src/server/**/*.js"])
    .pipe(eslint({
      fix: true,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task("lint:webapp", ["clean:webapp"], () => {
  return gulp.src(["src/webapp/**/*.js", "src/webapp/**/*.jsx"])
    .pipe(eslint({
      fix: true,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task("lint:tests", ["clean:tests"], () => {
  return gulp.src(["src/tests/**/*.js"])
    .pipe(eslint({
      fix: true,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("test:webapp", ["compile:tests", "compile:webapp"], function() {
  return gulp.src("./build/tests/webapp/**/*.js")
    .pipe(mocha());
});

gulp.task("test:server", ["compile:tests", "compile:server"], function() {
  return gulp.src("./build/tests/server/**/*.js")
    .pipe(mocha());
});



gulp.task("watch", () => {
  gulp.watch("src/webapp/*.*", ["test:webapp"]);
  gulp.watch("src/server/*.*", ["test:server"]);
  gulp.watch("src/public/**/*.*", ["copy:public"]);
});

gulp.task("default", ["test:server", "test:webapp", "copy:public"]);
