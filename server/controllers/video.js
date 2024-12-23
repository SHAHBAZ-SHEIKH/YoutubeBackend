import Video from "../modals/Video.js"
import { createError } from "../error.js"
import User from "../modals/Users.js"
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express"

const app = express()

const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));



// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "..", "uploads"); // Ensure the uploads directory is correct
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath); // Set the destination to the uploads folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const upload = multer({ storage });

// Add Video Controller
export const addVideo = async (req, res, next) => {
    console.log("req.body",req.body)
  // Use multer middleware to handle file uploads
  upload.fields([
    { name: "video", maxCount: 1 }, // Expect one video file
    { name: "image", maxCount: 1 }, // Expect one image file
  ])(req, res, async (err) => {
    console.log("req.files",req.files)
    if (err) {
      return next(createError(500, "File upload failed: " + err.message));
    }

    

    // Ensure files and required fields are provided
    const videoFile = req.files?.video?.[0];
    const imageFile = req.files?.image?.[0];
    const { title, description, tags } = req.body;

    if(!title){
        return next(createError(400, "Title is required"));
    }


    if(!description){
        return next(createError(400, "Description is required"));
    }

    if(!tags){
        return next(createError(400, "Tags are required")); 
    }
    if(!videoFile){
        return next(createError(400, "Video file is required"));
    }
    if(!imageFile){
        return next(createError(400, "Image file is required"));
    }

    // if (!imageFile || !title || !desc || !tags) {
    //   return next(createError(400, "Missing required fields or files"));
    // }
    // if (!videoFile) {
    //   return next(createError(400, "Video file is required"));
    // }
    

    // Construct file URLs (assuming a static server serves the 'uploads' folder)
    const videoUrl = `uploads/${videoFile.filename}`;
    const imageUrl = `uploads/${imageFile.filename}`;

    // Create a new video record
    const newVideo = new Video({
      userId: req.user.id, // Assuming `req.user` contains authenticated user info
      title,
      description,
      tags: tags.split(","),
      videoUrl, // Save video file URL
      imageUrl, // Save image file URL
    });

    try {
      const savedVideo = await newVideo.save();
      res.status(200).json({ success: true, video: savedVideo });
    } catch (error) {
      next(error);
    }
  });
};


export const updateVideo = async (req, res, next) => {

    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found"));
        if(req.user.id===video.userId){
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).json(updatedVideo)
        }
        else{
            return next(createError(403,"You can update only your video"));
        }
        
        
    } catch (error) {
    next(error)

}

    
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found"));
        if(req.user.id===video.userId){
            await Video.findByIdAndUpdate(req.params.id, );
            res.status(200).json("The Video has been deleted")
        }
        else{
            return next(createError(403,"You can delete only your video"));
        }
        
        
    } catch (error) {
    next(error)

}

}

export const getVideo = async (req, res, next) => {
    try {

        const video = await Video.findById(req.params.id);
        res.status(200).json(video)

    } catch (error) {
        next(error)

    }

}

export const addviews = async (req, res, next) => {
    try {

        await Video.findByIdAndUpdate(req.params.id,{
            $inc:{views:1}
        });
        res.status(200).json("Views has been increased")

    } catch (error) {
        next(error)

    }

}

export const random = async (req, res, next) => {
    try {

        const videos = await Video.aggregate([{$sample:{size:40}}]);
        res.status(200).json(videos)

    } catch (error) {
        next(error)

    }

}

export const trend = async (req, res, next) => {
    try {

        const videos = await Video.find().sort({views:-1});
        res.status(200).json(videos)

    } catch (error) {
        next(error)

    }

}

export const sub = async (req, res, next) => {
    try {
        console.log("subs is",req.user.id)

        const video = await User.findById(req.user.id);
        console.log(video)
        const subscribedChannels = video.SubscribedUsers;
        const list = await Promise.all(
            
            subscribedChannels.map((channelId) => {
                return Video.find({ userId: channelId });
            })
            
        )
        res.status(200).json(list.flat().sort((a,b)=>b.createdAt-a.createdAt))

    } catch (error) {
        console.log(error)
        next(error)

    }

}


export const getByTags = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    console.log(tags)
    try {

        const videos = await Video.find({tags:{$in:tags}}).limit(20);
        res.status(200).json(videos)

    } catch (error) {
        next(error)

    }

}


export const search = async (req, res, next) => {
    const query = req.query.q;
    try {

        const videos = await Video.find({title:{$regex:query,$options:"i"}}).limit(40);
        res.status(200).json(videos)

    } catch (error) {
        next(error)

    }

}




