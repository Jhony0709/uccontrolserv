const { Router } = require('express');
const router = Router();
const { getByStudent, getByEvent } = require('./controller/reports')

router.get('/student', getByStudent);
router.get('/event', getByEvent);

module.exports = router;