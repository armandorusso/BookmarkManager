// Routes the user to a specified site

import express from "express"

// Import control file that the route will use
import WebsitesController from "./websites.controller.js"
import BookmarksController from "./bookmarks.controller.js"

const router = express.Router()

router.route("/").get(WebsitesController.apiGetWebsites)
router.route("/id/:id").get(WebsitesController.apiGetWebsitesById) // Get

router.route("/bookmarks")
    .post(BookmarksController.apiPostBookmark) // Post
    .put(BookmarksController.apiEditBookmark) // Put
    .delete(BookmarksController.apiDeleteBookmark) // Delete
export default router
