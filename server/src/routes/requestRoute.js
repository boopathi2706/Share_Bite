const express=require('express');
const router=express.Router();
const { createRequest, updateRequestStatus,getRequestsForDonor } = require('../controllers/RequestController');
const {AuthenticateToken}=require('../middlewares/AuthenticationMiddleware');

router.post('/posts/requests', AuthenticateToken, createRequest);
router.put('/requests/:requestId/status', AuthenticateToken, updateRequestStatus);
router.get('/donor/requests', AuthenticateToken, getRequestsForDonor);
module.exports=router;
