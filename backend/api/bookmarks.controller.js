import WebsiteUrlDAO from "../dao/websiteurlsDAO.js"

export default class BookmarksController
{
    static async apiPostBookmark(req, resp, next)
    {
        try {

            // Body of the request
            const bookmarkID = req.body.bookmark_id

            const userInfo = req.body.user_id
            
            const bookmarkInfo = { // Make this into a JSON object
                topic: req.body.topic,
                category: req.body.category,
                subject: req.body.subject,
                urls: req.body.url,
                // pdf: req.body.pdf,
            }

            const dateAdded = new Date()

            const bookmarkResponse = await WebsiteUrlDAO.addBookmark(
                bookmarkID,
                bookmarkInfo,
                dateAdded,
                userInfo,
            )

            resp.json( { status: "Success!" })
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
            const userID = req.body.user_id // Needed so that only the user can edit the sections and URLs
                                            // Later, I want to add a way so that anyone can edit the section (instead of just the user who created it)
            
            const bookmarkInfo = {
                topic: req.body.topic,
                category: req.body.category,
                subject: req.body.subject,
                urls: req.body.url,
                // pdf: req.body.pdf,
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

            resp.json({ status: "Success!" })

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
            const userID = req.body.user_id // Not really needed in the future (see Edit function)
                                            // But also, in a prod env, you shouldn't have anything in the body for a delete request
            console.log(bookmarkID)

            const bookmarkResponse = await WebsiteUrlDAO.deleteBookmark(
                bookmarkID,
                userID,
            )

            resp.json({ status: "Success!" })
        }

        catch(e)
        {
            resp.status(500).json({ error: e.message })
        }
    }
}