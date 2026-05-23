const Request=require('../models/RequestModel');
const Post=require('../models/PostModels');

const createRequest=async(req,res)=>{
    try {
        const postId = req.body.postId;
        const requesterId = req.user.id;
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.status !== 'Available') {
            return res.status(400).json({ message: 'Post is not available for requests' });
        }
        if(post.donor.toString() === requesterId) {
            return res.status(400).json({ message: 'You cannot request your own post' });
        }
        const existingRequest = await Request.findOne({ postId, requesterId });
        if (existingRequest) {
            return res.status(400).json({ message: 'You have already requested this post' });
        }
        const newRequest = new Request({
            postId,
            requesterId,
            ownerId: post.donor,
        });
        await newRequest.save();
        return res.status(201).json({ message: 'Request created successfully', request: newRequest });
    }
        catch (error) {
        console.error('Error creating request:', error);
        return res.status(500).json({ message: 'Internal server error occurred' });
    }
    };
const getRequestsForDonor=async(req,res)=>{
    try {
        const donorId = req.user.id;
        const requests = await Request.find({ ownerId: donorId }).populate('postId requesterId', 'title name');
        return res.status(200).json({ requests });
    } catch (error) {
        console.error('Error fetching requests for donor:', error);
        return res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const updateRequestStatus=async(req,res)=>{
    try {
        const requestId  = req.params.requestId;
        const { status } = req.body;
        if (!requestId) {
            return res.status(400).json({ message: 'Request ID is required' });
        }
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (request.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this request' });
        }
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        request.status = status;
        await request.save();
        return res.status(200).json({ message: 'Request status updated successfully', request });
    } catch (error) {
        console.error('Error updating request status:', error);
        return res.status(500).json({ message: 'Internal server error occurred' });
    }
};

module.exports={
    createRequest,
    getRequestsForDonor,
    updateRequestStatus
}