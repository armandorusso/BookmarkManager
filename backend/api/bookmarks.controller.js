import WebsiteUrlDAO from "../dao/bookmarksDAO.js"

export default class BookmarksController
{
    static async apiPostBookmark(req, resp, next)
    {
        try {

            // Body of the request?
            const bookmarkID = req.body.bookmark_id
            
            const bookmarkInfo = { 
                topic: req.body.topic,
                category: req.body.category,
                subject: req.body.subject,
                urls: req.body.url,
                pdf = req.body.pdf,
            }

            const dateAdded = new Date()

            const bookmarkResponse = await WebsiteUrlDAO.addBookmark(
                bookmarkID,
                bookmarkInfo,
                dateAdded,
            )

            resp.json( { status: "success" })
        }

        catch(e)
        {
            resp.status(500).json( { error: e.message })
        }
        
    }

    static async apiEditBookmark(req, resp, next)
    {
        try
        {
            const bookmarkID = req.body.bookmark_id
            const userID = req.body.user_id
            
            const bookmarkInfo = {
                topic: req.body.topic,
                category: req.body.category,
                subject: req.body.subject,
                urls: req.body.url,
                pdf = req.body.pdf,
            }

            const dateEdited = new Date()

            const bookmarkResponse = await WebsiteUrlDAO.updateBookmark(
                bookmarkID,
                userID, // Needed so we can make sure the one who created the bookmark can edit it
                bookmarkInfo,
                dateEdited,
            )

            var { error } = bookmarkResponse

            if(error)
                resp.status(400).json({ error })
            
            if(bookmarkResponse.modifiedCount == 0) // If it wasn't edited
            {
                throw new Error(
                    "Unable to update the bookmark. Make sure the user is the original poster"
                )
            }

            resp.json({ status: "success" })

        }

        catch(e)
        {
            resp.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteBookmark(req, resp, next)
    {
        try
        {
            const bookmarkID = req.query.id // This is the ID from the URL
            const userID = req.body.user_id // Not really needed

            console.log(bookmarkID)

            const bookmarkResponse = await WebsiteUrlDAO.deleteBookmark(
                bookmarkID,
                userID,
            )

            resp.json({ status: "success" })
        }

        catch(e)
        {
            resp.status(500).json({ error: e.message })
        }
    }
}