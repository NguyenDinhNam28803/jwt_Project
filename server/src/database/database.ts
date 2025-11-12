import mongoose from 'mongoose'

const maskUri = (raw?: string) => {
  if (!raw) return ''
  try {
    const u = new URL(raw)
    if (u.password) u.password = '***'
    return u.toString()
  } catch {
    return '(invalid URI format)'
  }
}

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
  } catch (error: any) {
    console.error('MongoDB connection failed:', error)
    if (error?.name === 'MongooseServerSelectionError') {
      console.error(
        'Diagnosis: Could not reach any Atlas servers. Check IP whitelist, outbound firewall to *.mongodb.net:27017, DNS SRV resolution, and cluster readiness. URI:',
        maskUri(uri)
      )
    }
    process.exit(1)
  }
}

export default connectDB
