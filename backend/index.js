// Connect to the database and start the server


import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import WebsiteUrlDAO from "./dao/websiteurlsDAO.js"

// Load env variables
dotenv.config()

// Access Mongo client
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

// Connect to the database
MongoClient.connect(
    process.env.WEBSITEDB_URI)
        .catch(err => {
            console.error(err.stack)
            process.exit(1)
        })
        .then(async client => {
            await WebsiteUrlDAO.injectDB(client) // Initial reference to the website collection
            app.listen(port, () => {
                console.log(`listening on port ${port}`)
            }) // Start webserver after all these checks
        })
    