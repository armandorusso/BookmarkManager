import WebsiteUrlDAO from "../dao/websiteurlsDAO.js";

export default class WebsitesController
{
    static async apiGetWebsites(req, resp, next)
    {
        // Convert the "?websitesPerPage=" part in the URL into an int. Same thing with page #
        const websitesPerPage = req.query.websitesPerPage ? parseInt(req.query.websitesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}

        if(req.query.name)
            filters.name = req.query.name
        
        else if(req.query.field)
            filters.field = req.query.field
        
        else if(req.query.contents)
            filters.contents = req.query.contents
        
        
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
}