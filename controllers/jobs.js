import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import UnauthenticatedError from "../errors/unauthenticated.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
export const getAllJob = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
export const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: JobID },
  } = req;
  const job = await Job.findOne({ _id: JobID, createdBy: userID });
  if (!job) {
    throw new NotFoundError("job not found");
  }
  res.status(StatusCodes.OK).json(job);
};
export const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userID },
    params: { id: JobID },
  } = req;

  if (company == "" || position == "") {
    throw new BadRequestError("invalid input");
  }
  const updatedJob = await Job.findByIdAndUpdate(
    { _id: JobID, createdBy: userID },
    req.body,
    { new: true }
  );
  if (!updatedJob) {
    throw new UnauthenticatedError("something went wrong");
  }
  res.status(StatusCodes.OK).json({ updatedJob });
};
export const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: JobID },
  } = req;

  const deletedJob = await Job.findOneAndDelete({
    _id: JobID,
    createdBy: userID,
  });

  if (!deletedJob) {
    throw new UnauthenticatedError("No job found or not authorized to delete");
  }

  res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const newJob = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ newJob });
};
