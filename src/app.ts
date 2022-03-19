import express from 'express'
import dotenv from 'dotenv'
import { join } from 'path'
import homeRoute from "./routes/homeRouter"
dotenv.config({ path: "./.env" })
const app = express()

const PORT = process.env.PORT

app.set("views", join(__dirname, "views"))
app.set("view engine", "pug")
app.use(express.static(join(__dirname, "public")))

app.use("/", homeRoute)

app.listen(PORT, () => {
  console.log(`Listening to requests on http://localhost:${PORT}`)
})