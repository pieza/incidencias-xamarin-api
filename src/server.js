const express = require("express")
const morgan = require("morgan")
const path = require("path")
const passport = require("passport")
const cors = require('cors')
const app = express()

// passport Config
require("./security/passport")

// server Settings
app.set("port", process.env.PORT || 3000)

// middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// passport middleware
app.use(passport.initialize())

// routes
app.use(process.env.API_PATH, require("./routes/user.route"))
app.use(process.env.API_PATH, require("./routes/incidence.route"))

// error handle
app.use((err, req, res, next) => {
  console.log(err)
  return res.status(501).json({ message: err.message })
})

module.exports = app