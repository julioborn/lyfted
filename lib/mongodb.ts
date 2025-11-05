import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  throw new Error("Por favor define la variable de entorno MONGODB_URI en .env.local")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var myMongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.myMongoose || { conn: null, promise: null }

if (!global.myMongoose) {
  global.myMongoose = cached
}

async function conectarDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("[v0] MongoDB conectado exitosamente")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default conectarDB
