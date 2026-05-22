const router = require('express').Router();
const { createUser, loginUser,updateProfile,updatePassword } = require('../controllers/UserControllers');
const {AuthenticateToken} = require('../middlewares/AuthenticationMiddleware');

router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/profileupdate/:id', AuthenticateToken, updateProfile);
router.patch('/passwordupdate/:id', AuthenticateToken, updatePassword);


module.exports = router;