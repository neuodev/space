import express from "express";
import routes from "@/routes";
import { serverConfig } from "@/constants";
import "colors";
import { errorHandler } from "@/middleware/error";

const app = express();

app.use("/api/v1/user", routes.user);
app.use(errorHandler);

app.listen(serverConfig.port, () =>
  console.log(`Server is running on port ${serverConfig.port}`.cyan)
);
