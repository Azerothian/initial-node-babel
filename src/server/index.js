import express from "express";
import path from "path";
import Promise from "bluebird";
const app = express();
app.use(express.static(path.resolve(__dirname, "../public/")));
app.listen(8081, () => {
  console.log("server listening on port 8081");
});
