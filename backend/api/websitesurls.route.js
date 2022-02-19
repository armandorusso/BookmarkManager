import express from "express"

// Import control file that the route will use

import WebsitesController from "./websites.controller.js"

const router = express.Router()

router.route("/").get(WebsitesController.apiGetWebsites)

export default router
