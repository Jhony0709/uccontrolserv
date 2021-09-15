const { Router } = require('express');
const router = Router();
const { getRoles } = require('./controller/roles')

router.get('/', getRoles);

module.exports = router;