const router = require('express').Router();
const {createPost, getPostsByDistrict, getPostsByUser, updatePostStatus, updatePost, deletePost ,getAllPosts,getPostById} = require('../controllers/PostControllers');
const {AuthenticateToken} = require('../middlewares/AuthenticationMiddleware');

router.post('/create', AuthenticateToken, createPost);
router.get('/all', getAllPosts);
router.get('/:id', getPostById);
router.get('/district/:district', getPostsByDistrict);
router.get('/user/:userId', getPostsByUser);
router.patch('/update/:id', AuthenticateToken, updatePost);
router.patch('/status/:id', AuthenticateToken, updatePostStatus);
router.delete('/delete/:id', AuthenticateToken, deletePost);
