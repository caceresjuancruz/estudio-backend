const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { response } = require("express");

const conexion = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectTimeout: 2880000,
  debug: false,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  } else console.log("Error occurred, server can't start", error);
});

app.get("/codigos", (req, res) => {
  let sql = "SELECT * FROM Codigos";
  conexion.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    res.json(result);
  });
});

app.post("/verificar-butacas-platea-baja", async (req, res) => {
  const butacas = req.body.butacas;
  let sql = "SELECT * FROM `ButacasPlateaBaja` WHERE `fila`=? AND `butaca`=?";
  butacas.some((butaca, index) => {
    conexion.query(sql, [butaca.fila, butaca.butaca], (err, result) => {
      if (err) {
        throw err;
      }
      if (!err) {
        if (result[0].disponible === 0 && !res.headersSent) {
          return res.json({ result: false });
        }
        if (index + 1 === butacas.length) {
          if (!res.headersSent) {
            if (result[0].disponible === 0) {
              return res.json({ result: false });
            } else {
              return res.json({ result: true });
            }
          }
        }
      }
    });
  });
});

app.post("/verificar-butacas-platea-alta", async (req, res) => {
  const butacas = req.body.butacas;
  let sql = "SELECT * FROM `ButacasPlateaAlta` WHERE `fila`=? AND `butaca`=?";
  butacas.some((butaca, index) => {
    conexion.query(sql, [butaca.fila, butaca.butaca], (err, result) => {
      if (err) {
        throw err;
      }
      if (!err) {
        if (result[0].disponible === 0 && !res.headersSent) {
          return res.json({ result: false });
        }
        if (index + 1 === butacas.length) {
          if (!res.headersSent) {
            if (result[0].disponible === 0) {
              return res.json({ result: false });
            } else {
              return res.json({ result: true });
            }
          }
        }
      }
    });
  });
});

app.get("/butacas-platea-baja", (req, res) => {
  let sql = "SELECT * FROM ButacasPlateaBaja";
  conexion.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    res.json(result);
  });
});

app.get("/butacas-platea-alta", (req, res) => {
  let sql = "SELECT * FROM ButacasPlateaAlta";
  conexion.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    res.json(result);
  });
});

app.post("/verificar-codigo", (req, res) => {
  const code = req.body.codigo;

  let sql = `SELECT * FROM Codigos WHERE code=${code}`;
  conexion.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    let sql2 = `DELETE FROM Codigos WHERE code=${code}`;
    conexion.query(sql2, (err, result) => {
      if (err) {
        throw err;
      }
    });
    res.json(result);
  });
});

app.post("/actualizar-ubicaciones-platea-baja", (req, res) => {
  const arrayUbicaciones = req.body.ubicaciones;
  const ownerEmail = req.body.email;
  const ownerName = req.body.nombre;

  sql =
    "UPDATE `ButacasPlateaBaja` SET `email`= ?, `nombre_apellido`=?, `disponible`=? WHERE `fila`=? AND `butaca`=?";

  arrayUbicaciones.forEach((ubicacion) => {
    conexion.query(
      sql,
      [ownerEmail, ownerName, 0, ubicacion.fila, ubicacion.butaca],
      (err, result) => {
        if (err) {
          throw err;
        }
      }
    );
  });

  res.json("exec");
});

app.post("/actualizar-ubicaciones-platea-alta", (req, res) => {
  const arrayUbicaciones = req.body.ubicaciones;
  const ownerEmail = req.body.email;
  const ownerName = req.body.nombre;

  sql =
    "UPDATE `ButacasPlateaAlta` SET `email`= ?, `nombre_apellido`=?, `disponible`=? WHERE `fila`=? AND `butaca`=?";

  arrayUbicaciones.forEach((ubicacion) => {
    conexion.query(
      sql,
      [ownerEmail, ownerName, 0, ubicacion.fila, ubicacion.butaca],
      (err, result) => {
        if (err) {
          throw err;
        }
      }
    );
  });

  res.json("exec");
});

//ENDPOINTS 2DO SHOW
//
//

app.post("/verificar-butacas-platea-baja2", async (req, res) => {
  const butacas = req.body.butacas;
  let sql = "SELECT * FROM `ButacasPlateaBaja_2` WHERE `fila`=? AND `butaca`=?";
  butacas.some((butaca, index) => {
    conexion.query(sql, [butaca.fila, butaca.butaca], (err, result) => {
      if (err) {
        throw err;
      }
      if (!err) {
        if (result[0].disponible === 0 && !res.headersSent) {
          return res.json({ result: false });
        }
        if (index + 1 === butacas.length) {
          if (!res.headersSent) {
            if (result[0].disponible === 0) {
              return res.json({ result: false });
            } else {
              return res.json({ result: true });
            }
          }
        }
      }
    });
  });
});

app.post("/verificar-butacas-platea-alta2", async (req, res) => {
  const butacas = req.body.butacas;
  let sql = "SELECT * FROM `ButacasPlateaAlta_2` WHERE `fila`=? AND `butaca`=?";
  butacas.some((butaca, index) => {
    conexion.query(sql, [butaca.fila, butaca.butaca], (err, result) => {
      if (err) {
        throw err;
      }
      if (!err) {
        if (result[0].disponible === 0 && !res.headersSent) {
          return res.json({ result: false });
        }
        if (index + 1 === butacas.length) {
          if (!res.headersSent) {
            if (result[0].disponible === 0) {
              return res.json({ result: false });
            } else {
              return res.json({ result: true });
            }
          }
        }
      }
    });
  });
});

app.get("/butacas-platea-baja-2", (req, res) => {
  let sql = "SELECT * FROM ButacasPlateaBaja_2";
  conexion.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    res.json(result);
  });
});

app.get("/butacas-platea-alta-2", (req, res) => {
  let sql = "SELECT * FROM ButacasPlateaAlta_2";
  conexion.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    res.json(result);
  });
});

app.post("/actualizar-ubicaciones-platea-baja-2", (req, res) => {
  const arrayUbicaciones = req.body.ubicaciones;
  const ownerEmail = req.body.email;
  const ownerName = req.body.nombre;

  sql =
    "UPDATE `ButacasPlateaBaja_2` SET `email`= ?, `nombre_apellido`=?, `disponible`=? WHERE `fila`=? AND `butaca`=?";

  arrayUbicaciones.forEach((ubicacion) => {
    conexion.query(
      sql,
      [ownerEmail, ownerName, 0, ubicacion.fila, ubicacion.butaca],
      (err, result) => {
        if (err) {
          throw err;
        }
      }
    );
  });

  res.json("exec");
});

app.post("/actualizar-ubicaciones-platea-alta-2", (req, res) => {
  const arrayUbicaciones = req.body.ubicaciones;
  const ownerEmail = req.body.email;
  const ownerName = req.body.nombre;

  sql =
    "UPDATE `ButacasPlateaAlta_2` SET `email`= ?, `nombre_apellido`=?, `disponible`=? WHERE `fila`=? AND `butaca`=?";

  arrayUbicaciones.forEach((ubicacion) => {
    conexion.query(
      sql,
      [ownerEmail, ownerName, 0, ubicacion.fila, ubicacion.butaca],
      (err, result) => {
        if (err) {
          throw err;
        }
      }
    );
  });

  res.json("exec");
});
