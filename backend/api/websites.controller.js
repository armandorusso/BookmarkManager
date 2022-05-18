// This file reads the URL, assigns the fields from the URL to variables and
// passes it to our database functions in order to get or put our data

import WebsiteUrlDAO from "../dao/websiteurlsDAO.js";

export default class WebsitesController
{
    static async apiGetWebsites(req, resp, next)
    {
        // Convert the "?websitesPerPage=" part in the URL into an int. Same thing with page #
        const websitesPerPage = req.query.websitesPerPage ? parseInt(req.query.websitesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}

        // Check in the URL if there contains any of these fields. If so,
        // assign it to filters, and pass it to getWebsites 
        // which queries our database
        if(req.query.category)
            filters.category = req.query.category
        
        else if(req.query.topic)
            filters.topic = req.query.topic
        
        else if(req.query.subject)
            filters.subject = req.query.subject
        
        

        // Query the database using our filters and other fields we just obtained
        // from the URL
        const { sectionsList, totalNumberofSections } = await WebsiteUrlDAO.getWebsites( {
            filters,
            page,
            websitesPerPage,
        })

        // Send back the response after we get our websites/sections
        let response = {
            websites_and_sections: sectionsList,
            page: page,
            filters: filters,
            entires_per_page: websitesPerPage,
            total_results: totalNumberofSections,
        }

        resp.json(response)
    
    }

    static async apiGetWebsitesById(req, resp, next) 
    {
        try 
        {
            let id = req.params.id || {}

            let website = await WebsiteUrlDAO.getWebsitesById(id) // Pass response data to the DB

            if(!website) // If it returns nothing
            {
                resp.status(404).json( { error: "Website not found"})
                return
            }

            resp.json(website)
        }
        
        catch(e)
        {
            console.log(`api, ${e}`)
            resp.status(500).json( {error: e})
        }
    }

    static async apiGetWebsiteTopics(req, resp, next)
    {
        try
        {
            let topics = await WebsiteUrlDAO.getWebsiteTopics()

            resp.json(topics)
        }
        
        catch(e)
        {
            console.log(`api, ${e}`)
            resp.status(500).json( {error: `topic, ${e}`})
        }
    }

}