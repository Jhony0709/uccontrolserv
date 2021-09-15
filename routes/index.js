const { Router } = require('express');
const router = Router();
const { pool } = require('../dbconfig');

// Routes
const users = require('./users');
const roles = require('./roles');
const events = require('./events');
const reports = require('./reports');

router.use('/reports', reports);
router.use('/users', users);
router.use('/roles', roles);
router.use('/events', events);

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const pwd = req.body.pwd;
    const response = await pool.query(
        "SELECT u.nombre, u.apellido, u.email, r.descripcion as rol, u.estado FROM users u " +
        "JOIN roles r ON r.id = u.rol_id " +
        "WHERE email='" + email + "' AND pwd='" + pwd + "'"
    );
    response.rows.length && response.rows[0].estado ?
        res.send(response.rows[0])
    :   res.status(401).json();
});

module.exports = router;