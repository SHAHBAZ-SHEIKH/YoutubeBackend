import { console } from "inspector";
import { createError } from "../error.js";
import User from "../modals/Users.js";
import Video from "../modals/Video.js";
export const update = async (req, res, next) => {

    if (req.params.id === req.user.id) {

        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).json(updateUser)
        } catch (error) {

        }

    }
    else {
        return next(createError(403, "You can update only your account"));
    }

}


export const deleteuser = async (req, res, next) => {

    if (req.params.id === req.user.id) {

        try {
            await User.findByIdAndDelete(req.params.id,);
            res.status(200).json("User has been deleted")
        } catch (error) {

        }

    }
    else {
        return next(createError(403, "You can delete only your account"));
    }

}
export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" }); // Agar user nahi mila
        }
        res.status(200).json(user)

    } catch (error) {
        next(error)

    }

}
export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { SubscribedUsers: req.params.id }

        });
        await User.findByIdAndUpdate(req.params.id, { $inc: { subscriber: 1 } });
        res.status(200).json("Subscription successfull")

    } catch (error) {
        next(error)

    }

}
export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id }

        });
        await User.findByIdAndUpdate(req.params.id, { $inc: { subscriber: -1 } });
        res.status(200).json("unsubscription successfull")

    } catch (error) {
        next(error)

    }

}
export const like = async (req, res, next) => {
    
    const videoId = req.params.videoId
    console.log(videoId,"videoId")
    const id = req.user.id
    console.log(id,"id")
    try {
        await Video.findByIdAndUpdate(videoId,
            {
                $addToSet: { likes: id },
                $pull: { dislikes: id }
            });
        res.status(200).json("The video has been liked")
    } catch (error) {
        next(error)

    }

}

export const dislike = async(req, res, next) => {

    try {
        const videoId = req.params.videoId
        const id = req.user.id
        await Video.findByIdAndUpdate(videoId,
            {
                $addToSet: { dislikes: id },
                $pull: { likes: id }
            });
        res.status(200).json("The video has been disliked")
    } catch (error) {
        next(error)

    }
}