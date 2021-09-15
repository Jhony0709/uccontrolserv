const { pool } = require('../../dbconfig');

const getUsers = async (req, res) => {
    const response = await pool.query(
      "SELECT u.nombre, u.apellido, u.email, r.descripcion as rol, u.estado FROM users u " +
      "JOIN roles r ON r.id = u.rol_id "
    );
    res.send(response.rows);
};

const newUser = async (req, res) => {
  const {nombre, apellido, email, pwd, rol} = req.body;
  const response = await pool.query(
    `INSERT INTO users(nombre, apellido, email, pwd, rol_id, estado)` +
    `VALUES ('${nombre}', '${apellido}', '${email}', '${pwd}', ${rol}, ${true});`
  );
  res.send(response.rows);
};

const deleteUser = async (req, res) => {
  const {email} = req.body;
  const response = await pool.query(
    `DELETE FROM public.users
    WHERE email='${email}'`
  );
  res.send(response);
};

const changeUserState = async (req, res) => {
  const { estado, email } = req.body;
  const response = await pool.query(
    `UPDATE users SET estado=${estado} WHERE email='${email}';`
  );
  res.send(response.rows);
};

const getUserCard = async (req, res) => {
  const { card } = req.query;
  const response = await pool.query(
    `SELECT id, nombre, apellido FROM estudiantes WHERE id_carnet='${card}';`
  );
  res.send(response.rows);
};

const getUser = async (req, res) => {
  const { st } = req.query;
  const response = await pool.query('SELECT id_carnet, nombre, apellido FROM estudiantes WHERE num_identificacion = $1', [st]);

  res.send(response.rows);
}

const linkCard = async (req, res) => {
  const {cardId, idStudent} = req.body;
  const response = await pool.query(
    `UPDATE estudiantes SET id_carnet = $1 WHERE num_identificacion = $2;`, [
      cardId,
      idStudent
    ]
  );

  res.send('Carnet registrado correctamente');
};

module.exports = {
  getUser,
  getUsers,
  newUser,
  deleteUser,
  changeUserState,
  getUserCard,
  linkCard,
};
