import { Model } from "objection";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import knex from "./config/conf";
import router from "./routes/v1";
import { chatSocket } from "./socket/chat";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

chatSocket(io);
Model.knex(knex);
const port: number = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", router);
server.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});
