import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment'

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please Provide All Values");
  }

  req.body.createdBy = req.user.userId; // add createdBy property on the req.body and assign it to userId
  // req.user was created in auth middleware
  
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query

  const queryObject = {
    createdBy: req.user.userId,
  }

  if (status && status !== 'all') { // if there is a status (!!! not undefined) and it is not "all"
    queryObject.status = status
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' } // search for position with $regex, case insensitive
  }
  // no await here:
  let result = Job.find(queryObject)

  // chain sort conditions:
  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('position')
  }
  if (sort === 'z-a') {
    result = result.sort('-position')
  }

    // setup pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit // (10)
    result = result.skip(skip).limit(limit)

  const jobs = await result

  // jobs.length cannot be used to calculate totalJobs, because it will always reflect the limit (10):
  const totalJobs = await Job.countDocuments(queryObject) // we can pass queryObject directly to countDocuments method; 
  const numOfPages = Math.ceil(totalJobs / limit)

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}

const updateJob = async (req, res) => {
  const { id: jobId } = req.params
  
  const { company, position } = req.body
  if (!company || !position) {
    throw new BadRequestError('Please Provide All Values')
  }

  const job = await Job.findOne({ _id: jobId })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  // check permissions (if user, for some reason, has id of someone elses job):
  checkPermissions(req.user, job.createdBy)

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, { // new values passed
    new: true, // returns updated job
    runValidators: true, // validators run on properties passed in req.body
  })
  res.status(StatusCodes.OK).json({ updatedJob })
}

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params
  const job = await Job.findOne({ _id: jobId })
  
  if (!job) {
    throw new CustomError.NotFoundError(`No job with id : ${jobId}`)
  }

  checkPermissions(req.user, job.createdBy)

  await job.remove()
  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' })
}

// aggregation pipeline (https://docs.mongodb.com/manual/core/aggregation-pipeline/)
// aggregate method takes an array of objects that represent steps to be executes one by one:
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } }, // take jobs created by certain user 
    { $group: { _id: '$status', count: { $sum: 1 } } }, // group jobs by status
  ])
  stats = stats.reduce((acc, curr) => { // turning stats into object -> [status]: count
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } }, // get all jobs that belong to the user
    {
      $group: { // group based on year and month
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }, // latest first
    { $limit: 6 }, // 6 months 
  ])

  monthlyApplications = monthlyApplications
  .map((item) => {
    const {
      _id: { year, month },
      count,
    } = item
    // accepts 0-11
    const date = moment()
      .month(month - 1)
      .year(year)
      .format('MMM Y')
    return { date, count }
  })
  .reverse()

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
