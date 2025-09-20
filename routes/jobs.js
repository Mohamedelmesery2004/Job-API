import express from "express";
import {
  getAllJob,
  getJob,
  updateJob,
  deleteJob,
  createJob,
} from "../controllers/jobs.js";

const router = express.Router();


router.route("/")
  .get(getAllJob)     
  .post(createJob); 

router.route("/:id")
  .get(getJob)        
  .patch(updateJob)     
  .delete(deleteJob);

export default router;
