import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import UserRoutes from "./routes/UserRoutes.js";
import ChatRoutes from "./routes/ChatRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import path from "path";
import {notFoundHandler,appErrorHandler} from "./middleware/ErrorMiddleware.js";
import configureSocketEvents from "./config/sockets.js";
import morgan from "morgan";

connectDB();

const app = express();
const DIRNAME = path.resolve();
const PORT = process.env.PORT || 5000;

// Config middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// App routes
app.use("/api/user", UserRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", MessageRoutes);

// ====================  Deployment ========================= //
if (process.env.NODE_ENV === "production") {
  // Establishes the path to our frontend (most important)
  app.use(express.static(path.join(DIRNAME, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(DIRNAME, "/client/build/index.html"))
  );
}
// ====================  Deployment ========================= //

// Error middlewares
app.all("*", notFoundHandler);
app.use(appErrorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server started at port ${PORT}`)
);

// Server socket configuration
configureSocketEvents(server);
