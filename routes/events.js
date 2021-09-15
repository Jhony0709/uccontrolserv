const { Router } = require('express');
const router = Router();
const { getEvents, newEvent, getEventTypes, regEstEvent, editEvent, deleteEvent } = require('./controller/events');

router.get('/', getEvents);
router.post('/', newEvent);
router.put('/', editEvent);
router.delete('/:id', deleteEvent);

router.get('/types', getEventTypes);

router.post('/register', regEstEvent);

module.exports = router;