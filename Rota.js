const { response } = require("express");
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const app = express();
//const router = require('router');
app.use(cors());
const pool = mysql.createPool({
  user: "root",
  password: "",
  database: "pokemons",
  host: "127.0.0.1",
  //"port": "3306"
  charset: "utf8mb4",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.pool = pool;

app.get("/poke/:name", async (req, res) => {
  const conn = await pool.getConnection();
  let { name } = req.params;

  console.log(name);

  const [result] = await conn
    .execute(
      `SELECT * FROM pokemon WHERE lower(name) like '%${name.toLowerCase()}%'`
    )
    .catch((Error) => {
      res.status(500).send({
        error: Error,
        response: alert("Deu erro no Server"),
      });
    });
  conn.release();
  // console.log(result)
  res.status(200).send(result);
});

app.get("/listar", async (_, res) => {
  const conn = await pool.getConnection();
  const [result] = await conn.query("SELECT * FROM pokemon");

  res.status(200).send(result);
  console.log(result);
});

app.listen(3002, () => {
  console.log("Ta Funcionando");
});

module.exports = app;
