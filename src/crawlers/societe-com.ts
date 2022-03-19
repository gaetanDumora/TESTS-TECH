import jsdom from 'jsdom'
const { JSDOM } = jsdom

interface ISocieteDocument {
    companyType: string,
    effectif: string,
    chiffreAffaires: string
}

export async function societeCrawler(name: string, siren: string)
    : Promise<ISocieteDocument> {
        
    try {
        const url = `https://www.societe.com/societe/${name}-${siren}.html`
        const { document } = (await JSDOM.fromURL(url)).window
        let chiffreAffaires: string = ""

        /** Trouvons le chiffre d'affaires dans le tableau HTML de la page */
        const tr: HTMLCollectionOf<HTMLTableRowElement> = document.getElementsByTagName("tr")

        for (let index = 0; index < tr.length; index++) {
            const element = tr.item(index)?.textContent
            if (element?.includes("Chiffre d'affaires")) {
                const allNumbers = element.match(/\d+/g)?.filter(num => num.length > 5)
                chiffreAffaires = allNumbers?.length ? allNumbers[0] : "non publié"
                break
            }
        }

        const companyType = document.getElementById("ape-histo-description")?.textContent ?? ""
        const effectifMoyen = document.getElementById("trancheeff-histo-description")?.textContent
        const trancheEffectif = document.getElementById("effmoy-histo-description")?.textContent
        const effectif = trancheEffectif ? trancheEffectif : effectifMoyen ? effectifMoyen : "0"

        return {
            companyType,
            effectif,
            chiffreAffaires
        }
    } catch (error) {
        console.log(error)
        throw(error)
    }

}   