const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const session = require("express-session")

const KnexSessionStore = require("connect-session-knex")(session)

const authRouter = require("./auth/auth-router")
const userRouter = require("./users/user-router")

const server = express()

const config = {
  name: "sessionId", // the default would be sid, but that would reveal our stack
  secret: "keep it secret, keep it safe!", // to encrypt/decrypt the cookie
  cookie: {
    maxAge: 1000 * 60 * 60, // how long is the session valid for, in milliseconds
    secure: false, // used over https only, should be true in production
    httpOnly: true, // cannot access the cookie from JS using document.cookie
    // keep this true unless there is a good reason to let JS access the cookie
  },
  resave: false, // we might need to set this to true to avoid idle sessions being deleted
  // eslint-disable-next-line max-len
  saveUninitialized: false, // keep it false to avoid storing sessions and sending cookies for unmodified sessions
  store: new KnexSessionStore({
    // eslint-disable-next-line global-require
    knex: require("../database/dbConfig"), // configured instance of knex
    tablename: "sessions", // table that will store sessions inside the db, name it anything you want
    sidfieldname: "sid", // column that will hold the session id, name it anything you want
    createtable: true, // if the table does not exist, it will create it automatically
    // eslint-disable-next-line max-len
    clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
  }),
}

server.use(session(config))
server.use(cors())
server.use(express.json())
server.use(helmet())

server.use("/api/auth", authRouter)
server.use("/api/users", userRouter)

module.exports = server
