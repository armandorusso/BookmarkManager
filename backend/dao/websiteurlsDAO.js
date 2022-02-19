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

    static async getWebsites({
        filters = null,
        page = 0,
        sectionPerPage = 20,
        // contents = null,
        // name = null,
        // field = null,
    } = {}) {
        let query

        if(filters)
        {
            if("name" in filters)
                query = {"name": {$eq: filters["name"] } }

            else if("field" in filters)
                query = {"field": {$eq: filters["name"] } }
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
