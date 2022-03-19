import { SirenAPI } from "../services/insee-auth"
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

const sirenAPI = new SirenAPI({
    url: "https://api.insee.fr/token",
    client: process.env.SIREN_CLIENT,
    secret: process.env.SIREN_SECRET,
    access_token: process.env.SIREN_ACCESS_TOKEN,
    expires_at: +process.env.SIREN_EXPIRES_AT
})

interface IEntity {
    siren: number | string,
    denominationUniteLegale: string,
}

/** Obtenir à patir d'un nom d'entreprise toutes les entités incluant ce nom, on ne gardera que les N° siren, les noms, */
export async function inseeScrapper(name: string): Promise<IEntity[]> {

    const { access_token } = await sirenAPI.authentication()
    const inseeDocuments: Array<IEntity> = []
    const companyName = encodeURIComponent(`denominationUniteLegale:"${name}"`)
    try {
        const { header, unitesLegales } = await sirenAPI.axiosInstance.get(`https://api.insee.fr/entreprises/sirene/V3/siren?q=periode(${companyName})&masquerValeursNulles=true`, {
            headers: { "Authorization": `Bearer ${access_token}` }
        })

        if (header.statut == 200 && unitesLegales.length > 0) {

            for (const entities of unitesLegales) {

                /** On ne garde que les établissements actifs, c'est à dire sans dateFin */
                const [activeCompanies] = entities.periodesUniteLegale
                    .filter((eti: IEntity) => !Object.keys(eti).includes("dateFin"))
                    .map(({ denominationUniteLegale }: IEntity) => ({ denominationUniteLegale }))

                const { denominationUniteLegale } = activeCompanies
                const { siren } = entities

                inseeDocuments.push({
                    siren,
                    denominationUniteLegale,
                })

            }
        }
    } catch (error) {
        console.log(error)
    }

    return inseeDocuments
}

