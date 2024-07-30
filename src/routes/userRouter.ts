import express from "express";
import userController from "../controllers/userController";
const router = express.Router();

router.route("/login").post(userController.GetLogin);

router.route("/sign-up").post(userController.GetSignup);

router.route("/getuser/:email").post(userController.GetCurrentUser);
router.route('/getalluser/:id').get(userController.GetAllUser)
router.route("/setAvatar/:email").post(userController.setAvatar)

router.route('/logout').get(userController.Logout)

export default router;
