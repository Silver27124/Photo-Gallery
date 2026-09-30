import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/photo_gallery'

async function checkDatabase() {
  try {
    console.log(`🔍 Connecting to: ${MONGODB_URI}`)
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB successfully!\n')

    const photoSchema = new mongoose.Schema({
      title: String,
      url: String,
      user: String,
      createdAt: Date,
    })
    const Photo = mongoose.model('Photo', photoSchema)

    const count = await Photo.countDocuments()
    console.log(`📊 Total Photos in Database: ${count}`)

    if (count === 0) {
      console.log('ℹ️  The database is currently empty. Add a photo in the web app to see it saved here!')
    } else {
      const photos = await Photo.find().sort({ createdAt: -1 })
      console.log('\n--- Photos in MongoDB ---')
      photos.forEach((p, idx) => {
        console.log(
          `${idx + 1}. User: "${p.user}" | Title: "${p.title}" | ID: ${p._id} | Added: ${p.createdAt ? new Date(p.createdAt).toLocaleString() : 'N/A'}`
        )
      })
    }
  } catch (err) {
    console.error('❌ Error connecting to database:', err.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

checkDatabase()
