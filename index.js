import express from "express"
import connectDB from "./lib/connectDB.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import webHookRouter from "./routes/webhook.route.js"
import { clerkMiddleware } from "@clerk/express"
import cors from "cors"

const app = express()

app.use(express.json())

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use("/webhooks", webHookRouter)

app.use(clerkMiddleware())

app.use("/users", userRouter)
app.use("/posts", postRouter)
app.use("/comments", commentRouter)

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  connectDB()
  console.log("Server running on", PORT)
})
