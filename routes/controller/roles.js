const { pool } = require('../../dbconfig');

const getRoles = async (req, res) => {
    const response = await pool.query("SELECT * FROM roles");
    res.send(response.rows);
};

module.exports = {
    getRoles,
};
