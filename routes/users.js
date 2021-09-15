const { Router } = require('express');
const router = Router();
const { getUser, getUsers, newUser, deleteUser, changeUserState, getUserCard, linkCard } = require('./controller/users')

router.get('/', getUsers);
router.get('/user', getUser);
router.post('/', newUser);
router.delete('/', deleteUser);
router.put('/status', changeUserState);
router.get('/card', getUserCard);
router.put('/card', linkCard);

module.exports = router;