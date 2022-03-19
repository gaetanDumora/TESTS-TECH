import { societeCrawler } from "./societe-com"

test("crawler retourne un object", async () => {
    const data = await societeCrawler("petzl-distribution", "388381642")
    expect(data).toBeDefined()
    expect(data.chiffreAffaires).toEqual("non publié")
})