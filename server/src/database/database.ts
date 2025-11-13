import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('MongoDB connection failed: missing MONGODB_URI in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    })
    console.log('MongoDB connected')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('MongoDB connection failed:', error)
    if (error?.name === 'MongooseServerSelectionError') {
      console.error(
        'Diagnosis: Could not reach any Atlas servers. Check IP whitelist, outbound firewall to *.mongodb.net:27017, DNS SRV resolution, and cluster readiness. URI:',
        uri
      )
    }
    process.exit(1)
  }
}

export default connectDB
