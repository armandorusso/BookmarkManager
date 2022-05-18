// This file is our main Database file
// Create database functions in here
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let websites // Stores instance of our DB


export default class WebsiteUrlDAO 
{   
    // **Connects to our DB. Called when our server starts**
    static async injectDB(conn)
    {
        if(websites) // If the reference exists already
            return
        
        // MongoDB creates an instance for us automatically if it doesn't exist 
        try
        {
            websites = await conn.db(process.env.WEBSITES_NS).collection("WebsiteCollection")
        }

        catch(e)
        {
            console.error(
                `Unable to establish a connection handle in websiteurlsDAO: ${e}`,
            )
        }
    }

    // **Queries the database using the fields we got from the URL**

    // Get Request
    static async getWebsites({
        filters = null,
        page = 0,
        sectionPerPage = 20,
        // contents = null,
        // name = null,
        // field = null,
    } = {}) {

        // Create our query
        let query

        if(filters)
        {
            if("topic" in filters)
                query = {"topic": {$eq: filters["topic"] } }

            else if("category" in filters)
                query = {"category": {$eq: filters["category"] } }
                
            else if("subject" in filters)
                query = {"subject": {$eq: filters["subject"] } }
        }

        // Query the database
        let section_topics

        try
        {
            section_topics = await websites.find(query)
        }

        catch(e)
        {
            console.error(`Unable to execute query, ${e}`)

            return { secionsList: [], totalNumberofSections: 0}
        }


        // Limit the amount of data we are getting and go to the corresponding page number
        const displaySections = section_topics.limit(sectionPerPage).skip(sectionPerPage * page)
        
        try
        {
            const sectionsList = await displaySections.toArray()
            const totalNumberofSections = await websites.countDocuments(query)

            return { sectionsList, totalNumberofSections }
        }

        catch(e)
        {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            
            return { secionsList: [], totalNumberofSections: 0}
        }

    }


    static async getWebsitesById(bookmarkId)
    {

        try 
        {
            const pipeline = [
                // Stage 1: Filter the data
                {
                    $match: { bookmark_id: new ObjectId(bookmarkId)}
                }
            ]

            return await websites.aggregate(pipeline).next();
        }

        catch(e)
        {
            console.error(`Could not obtain the specific website from the database: ${e}`)
            throw e
        }

    }

    static async getWebsiteTopics()
    {
        let topics = []

        try 
        {
            topics = await websites.distinct("topic")

            return topics
        }

        catch(e)
        {
            console.error(`Could not obtain the specific topics from the database: ${e}`)
            throw e
        }
    }

    // Add object to DB
    static async addBookmark(bookmarkId, bookmarkInfo, dateAdded, userInfo)
    {
        try
        {
            const bookmarksAndWebsites = { date: dateAdded,
                websites: bookmarkInfo.urls,
                category: bookmarkInfo.category,
                topic: bookmarkInfo.topic,
                subject: bookmarkInfo.subject,
                user_id: userInfo,
                bookmark_id: ObjectId(bookmarkId),
            }
            
            // Insert into DB
            return await websites.insertOne(bookmarksAndWebsites)
        }

        catch(e)
        {
            console.error(`Unable to add bookmark to DB: ${e}`)

            return { error: e }
        }

    }

    // Edit object in DB
    static async updateBookmark(bookmarkId, userId, bookmarkInfo, dateEdited)
    {

        try
        {
            const updateResponse = await websites.updateOne(
                { user_id: userId, // Looks for the right user and object ID. This also ensures its the same user who added the bookmark is updating it
                  _id: ObjectId(bookmarkId) },
                  { $set: { websites: bookmarkInfo.urls, 
                    category: bookmarkInfo.category,
                    topic: bookmarkInfo.topic,
                    date: dateEdited, 
                }})
            
            return updateResponse
        }

        catch(e)
        {
            console.error(`Unable to update object in the database: ${e}`)

            return { error: e }
        }

    }

    static async deleteBookmark(bookmarkId, userId)
    {
        try
        {
            const deleteResponse = await websites.deleteOne( 
                { _id: ObjectId(bookmarkId), user_id: userId })
            
            return deleteResponse
        }

        catch(e)
        {
            console.error(`Unable to delete bookmark (possibly not found): ${e}`)

            return { error: e }
        }
    }

}
