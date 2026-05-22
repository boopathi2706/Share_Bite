const express = require('express')
const router=express.Router();
const {createPost, getPostsByDistrict,getAvailablePosts,getClaimedPosts,getPostsByUser, updatePostStatus, updatePost, deletePost ,getAllPosts,getPostById} = require('../controllers/PostController');
const {AuthenticateToken} = require('../middlewares/AuthenticationMiddleware');

router.post('/create/:id', AuthenticateToken, createPost);
router.get('/all', getAllPosts);
router.get('/available',getAvailablePosts);
router.get('/claimed',getClaimedPosts);
router.get('/:id', getPostById);
router.get('/district/:district', getPostsByDistrict);
router.get('/user/:userId', getPostsByUser);
router.put('/update/:id', AuthenticateToken, updatePost);
router.patch('/status/:id', AuthenticateToken, updatePostStatus);
router.delete('/delete/:id', AuthenticateToken, deletePost);


module.exports = router;