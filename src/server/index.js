import express from "express";
import path from "path";
const app = express();
app.use(express.static(path.resolve(__dirname, "../public/")));
app.listen(18081, () => {
  console.log("server listening on port 18081");
});
