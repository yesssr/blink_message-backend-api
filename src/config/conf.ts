import dotenv from "dotenv";
import Knex from "knex";
import config from "../knexfile";

dotenv.config();

let knex =  Knex(config.development);

export default knex;