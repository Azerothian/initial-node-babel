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
// const nodemon = require("gulp-nodemon");
//const path = require("path");
const spawn = require("child_process").spawn;


gulp.task("api-server", (callback) => {
  let nd = spawn("launch-nodemon.bat", [], {cwd: process.cwd(), stdio: [0, 1, 2]});
  nd.on("error", (err) => {
    console.log("NODEMON ERRROR", err);
  });
});
gulp.task("webpack:dev-server", ["default", "watch"], (callback) => {
  // Start a webpack-dev-server
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  var compiler = webpack(webpackConfig);
  new WebpackDevServer(compiler, {
    //contentBase: path.resolve(__dirname, "./build/public/"),
    hot: true,
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
        target: "http://localhost:8081",
        secure: false,
      },
    },
  }).listen(8080, "localhost", (err) => {
    if (err) {
      throw err;
    }
    gulp.start("api-server");
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

gulp.task("copy:public", ["clean:public"], () => {
  return gulp.src("src/public/**/*")
  .pipe(gulp.dest("build/public/"));
});

gulp.task("clean:server", () => {
  return del(["build/server/**/*"]);
});
gulp.task("clean:react-app", () => {
  return del(["build/react-app/**/*"]);
});
gulp.task("clean:tests", () => {
  return del(["build/tests/**/*"]);
});

gulp.task("clean:public", () => {
  return del(["build/public/**/*"]);
});

gulp.task("compile:server", ["lint:server"], () => {
  return gulp.src(["src/server/**/*"])
    .pipe(babel({}))
    .pipe(gulp.dest("build/server"));
});

gulp.task("compile:react-app", ["lint:react-app"], () => {
  return gulp.src(["src/react-app/**/*"])
    .pipe(babel({}))
    .pipe(gulp.dest("build/react-app"));
});
gulp.task("compile:tests", ["lint:tests"], () => {
  return gulp.src(["src/tests/**/*"])
    .pipe(babel({}))
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
gulp.task("lint:react-app", ["clean:react-app"], () => {
  return gulp.src(["src/react-app/**/*.js", "src/react-app/**/*.jsx"])
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

gulp.task("test:react-app", ["compile:tests", "compile:react-app"], function() {
  return gulp.src("./build/tests/react-app/**/*.js")
    .pipe(mocha());
});

gulp.task("test:server", ["compile:tests", "compile:server"], function() {
  return gulp.src("./build/tests/server/**/*.js")
    .pipe(mocha());
});



gulp.task("watch", () => {
  gulp.watch("src/react-app/*.*", ["test:react-app"]);
  gulp.watch("src/server/*.*", ["test:server"]);
  gulp.watch("src/public/**/*.*", ["copy:public"]);
});

gulp.task("default", ["test:server", "test:react-app", "copy:public"]);
