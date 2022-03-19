import express, { Request, Response } from "express"
import { inseeScrapper } from "../crawlers/insee-siren"
import { societeCrawler } from '../crawlers/societe-com'

const router = express.Router()

interface IQueryHome {
    companyName: string
}
router.get("/", async (req: Request<{}, {}, {}, IQueryHome>, res: Response) => {
    if (req.query.companyName) {
        const { companyName } = req.query
        res.render("home", { companies: await inseeScrapper(companyName) })
    } else {
        res.render("home")
    }
})

interface IQueryDetail {
    name: string,
    siren: string
}
router.get("/details", async (req: Request<{}, {}, {}, IQueryDetail>, res: Response) => {
    const { name, siren } = req.query
    res.render("detail", { name, ...await societeCrawler(name, siren) })
})

export default router
