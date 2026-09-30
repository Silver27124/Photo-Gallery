import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/photo_gallery'

// Middleware
app.use(cors())
// Allow up to 50MB for base64 photo data
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// MongoDB Connection State
let isDbConnected = false

console.log('🔄 Connecting to MongoDB...')
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    isDbConnected = true
    console.log('✅ Connected to MongoDB successfully!')
  })
  .catch((err) => {
    isDbConnected = false
    console.error('❌ MongoDB Connection Error:', err.message)
    console.log('👉 Tip: Update MONGODB_URI in your .env file with your free MongoDB Atlas connection string.')
  })

mongoose.connection.on('disconnected', () => {
  isDbConnected = false
  console.log('⚠️ MongoDB disconnected.')
})

mongoose.connection.on('reconnected', () => {
  isDbConnected = true
  console.log('✅ MongoDB reconnected.')
})

// Photo Schema & Model
const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled',
    trim: true,
  },
  url: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Photo = mongoose.model('Photo', photoSchema)

// Middleware to check database connection
function requireDb(req, res, next) {
  if (!isDbConnected && mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database not connected. Please check your MONGODB_URI in .env (MongoDB Atlas free tier URI or local MongoDB).',
      status: 'disconnected',
    })
  }
  next()
}

// Routes
// 1. Health check & status
app.get('/health', (req, res) => {
  const readyState = mongoose.connection.readyState
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting']
  res.json({
    status: isDbConnected ? 'connected' : 'disconnected',
    mongoState: states[readyState] || 'Unknown',
  })
})

// 2. Get photos for a specific user
app.get('/photos', requireDb, async (req, res) => {
  try {
    const { user } = req.query
    if (!user) {
      return res.status(400).json({ error: 'Username query parameter is required.' })
    }

    const photos = await Photo.find({ user }).sort({ createdAt: -1 })
    res.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    res.status(500).json({ error: 'Failed to fetch photos.' })
  }
})

// 3. Add a new photo
app.post('/photos', requireDb, async (req, res) => {
  try {
    const { title, url, user } = req.body

    if (!url || !user) {
      return res.status(400).json({ error: 'Both image data and username are required.' })
    }

    const newPhoto = await Photo.create({
      title: title?.trim() || 'Untitled',
      url,
      user: user.trim(),
    })

    res.status(201).json(newPhoto)
  } catch (error) {
    console.error('Error saving photo:', error)
    res.status(500).json({ error: 'Failed to save photo to MongoDB.' })
  }
})

// 4. Delete a photo
app.delete('/photos/:id', requireDb, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Photo.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ error: 'Photo not found.' })
    }

    res.json({ success: true, message: 'Photo deleted successfully.' })
  } catch (error) {
    console.error('Error deleting photo:', error)
    res.status(500).json({ error: 'Failed to delete photo.' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`)
})
