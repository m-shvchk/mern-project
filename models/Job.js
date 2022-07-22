import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'], // array creates with possible values
      default: 'pending',
    },

    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId, // objectId - special type typically used for unique identifiers
      ref: 'User', // reference to User Schema
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true } // adds two Date properties to the schema: createdAt: a date representing when this document was created; updatedAt: a date representing when this document was last updated 
)

export default mongoose.model('Job', JobSchema)