// This file is our main Database file
// Create database functions in here


let websites // Stores instance of our DB

export default class WebsiteUrlDAO 
{   
    // Connects to our DB. Called when our server starts
    static async injectDB(conn)
    {
        if(websites) // If the reference exists already
            return
        
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

    // Queries the database using the fields we got from the URL
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

}
