const Post = require('../models/PostModels');

const createPost = async (req, res) => {
    try {
        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({ message: 'User ID is required' });
        }
        const title = req.body.Title || req.body.title;
        const description = req.body.Description || req.body.description;
        const quantity = req.body.Quantity || req.body.quantity;
        const address = req.body.Address || req.body.address;
        const district = req.body.District || req.body.district;
        const expiryHours = req.body.ExpiryHours || req.body.expiryHours;

        if (!title || !description || !quantity || !address || !district || !expiryHours) {
            return res.status(400).json({ message: 'All fields must be filled' });
        }  
        if(String(quantity).length < 1 || String(quantity).length > 4 || isNaN(quantity) || Number(quantity) <= 0){
            return res.status(400).json({ message: 'Quantity must be a positive number with 1 to 4 digits' });
        } 
        if(String(expiryHours).length < 1 || String(expiryHours).length > 2 || isNaN(expiryHours) || Number(expiryHours) <= 0){
            return res.status(400).json({ message: 'Expiry hours must be a positive number with 1 to 3 digits' });
        }  
        const newPost = new Post({
            title,
            description,
            quantity,
            address,
            district,
            donor: req.user.id,
            expiryHours,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Server error while creating post' });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('donor', 'username email district');
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Server error while fetching posts' });
    }
};
const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate('donor', 'username email district');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(post);
    }
        catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ message: 'Server error while fetching post' });
    }
};

const getPostsByDistrict = async (req, res) => {
    try {
        const district = req.params.district;
        const posts = await Post.find({ district }).populate('donor', 'username email district');
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts by district:', error);
        return res.status(500).json({ message: 'Server error while fetching posts by district' });
    }
};
const getPostsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find

({ donor: userId }).populate('donor', 'username email district');
        return res.status(200).json(posts);
    }
        catch (error) {
        console.error('Error fetching posts by user:', error);  
        return res.status(500).json({ message: 'Server error while fetching posts by user' });
    }
};

const updatePostStatus = async (req, res) => {
    try {
        const postId = req.params.id;
        const { status } = req.body;
        if (!['Available', 'Claimed', 'Expired'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        } 
        post.status = status;
        await post.save();
        return res.status(200).json({ message: 'Post status updated successfully', post });
    } catch (error) {
        console.error('Error updating post status:', error);
        return res.status(500).json({ message: 'Server error while updating post status' });
    }
};

const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const title = req.body.Title || req.body.title|| post.title;
        const description = req.body.Description || req.body.description || post.description;
        const quantity = req.body.Quantity || req.body.quantity || post.quantity;
        const address = req.body.Address || req.body.address || post.address;
        const district = req.body.District || req.body.district || post.district;
        const expiryHours = req.body.ExpiryHours || req.body.expiryHours || post.expiryHours;
        if (title) post.title = title;
        if (description) post.description = description;
        if (quantity) {
            if (String(quantity).length < 1 || String(quantity).length > 4 || isNaN(quantity) || Number(quantity) <= 0) {
                return res.status(400).json({ message: 'Quantity must be a positive number with 1 to 4 digits' });
            }
            post.quantity = quantity;
        }
        if (address) post.address = address;
        if (district) post.district = district;
        if (expiryHours) {
            if (String(expiryHours).length < 1 || String(expiryHours).length > 2 || isNaN(expiryHours) || Number(expiryHours) <= 0) {
                return res.status(400).json({ message: 'Expiry hours must be a positive number with 1 to 3 digits' });
            }
            post.expiryHours = expiryHours;
        }
        await post.save();
        return res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ message: 'Server error while updating post' });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;   
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }   
        await post.remove();
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Server error while deleting post' });
    }
};

const deleteExpiredPosts = async () => {
    try {
        const posts = await Post.find({ status: 'Available' });
        const now = new Date();
        if(posts.expiryHours-now.getTime()/(1000*60*60) <= 0){
            posts.status='Expired';
            await posts.save();
        }   
    } catch (error) {
        console.error('Error deleting expired posts:', error);
    }
};

setInterval(deleteExpiredPosts, 60 * 60 * 1000);
module.exports = { createPost, getPostsByDistrict, getPostsByUser, updatePostStatus, updatePost, deletePost ,getAllPosts,getPostById};