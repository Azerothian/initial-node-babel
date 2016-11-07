"use strict"; //eslint-disable-line
require("babel-core/register");
const gulp = require("gulp");
const eslint = require("gulp-eslint");
const del = require("del");
const mocha = require("gulp-mocha");
const babel = require("gulp-babel");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackDevConfig = require("./webpack-dev.config");
const webpackProdConfig = require("./webpack-prod.config");
const sourcemaps = require("gulp-sourcemaps");

gulp.task("webpack:dev-server", ["default", "watch"], (callback) => {
  // Start a webpack-dev-server
  var compiler = webpack(webpackDevConfig);
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

gulp.task("webpack:build", ["compile:web"], (callback) => {
	// run webpack
  var compiler = webpack(webpackProdConfig);
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
gulp.task("clean:web", () => {
  return del(["build/web/**/*"]);
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

gulp.task("compile:web", ["lint:web"], () => {
  return gulp.src(["src/web/**/*"])
    .pipe(sourcemaps.init({identityMap: true}))
    .pipe(babel({}))
    .pipe(sourcemaps.write(".", {includeContent: true}))
    .pipe(gulp.dest("build/web"));
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
gulp.task("lint:web", ["clean:web"], () => {
  return gulp.src(["src/web/**/*.js", "src/web/**/*.jsx"])
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

gulp.task("test:web", ["compile:tests", "compile:web"], function() {
  return gulp.src("./build/tests/web/**/*.js")
    .pipe(mocha());
});

gulp.task("test:server", ["compile:tests", "compile:server"], function() {
  return gulp.src("./build/tests/server/**/*.js")
    .pipe(mocha());
});



gulp.task("watch", () => {
  gulp.watch("src/web/*.*", ["test:web"]);
  gulp.watch("src/server/*.*", ["test:server"]);
  gulp.watch("src/public/**/*.*", ["copy:public"]);
});

gulp.task("default", ["test:server", "test:web", "copy:public"]);
