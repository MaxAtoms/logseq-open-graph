import '@logseq/libs'

import { errorHandler, isValidHttpUrl } from "./utils"

type OgInformation = {
    ogTitle: string;
    ogImage: string;
    ogUrl: string;
}

async function fetchWebsite(content: string) {
    const response = await fetch(content)
    const contentType = response.headers.get("content-type")

    if(contentType == null || !contentType.includes("text/html")) {
        throw new Error("Loaded URL is not a valid HTML page")
    }
    return response;
}

async function fetchOgInformation(webpage: string) : Promise<OgInformation> {
    const parser = new DOMParser();
    const htmlHead = parser.parseFromString(webpage, "text/html").head

    const metaTag3 = htmlHead.querySelector(`meta[property='og:url']`)
    const metaTag2 = htmlHead.querySelector(`meta[property='og:title']`)
    const metaTag = htmlHead.querySelector(`meta[property='og:image']`)

    const ogUrl = metaTag3 ? metaTag3.getAttribute("content") : null
    const ogImage = metaTag ? metaTag.getAttribute("content") : null
    const ogTitle = metaTag2 ? metaTag2.getAttribute("content") : null

    if(ogImage == null || ogTitle == null || ogUrl == null ) {
        errorHandler( "Could not grab image, title or url." )
    }

    return { ogTitle, ogImage, ogUrl };
}

async function updateBlockContent(blockUuid:string, ogInfo:OgInformation) {

    var string=`## ${ogInfo.ogTitle}
${ogInfo.ogUrl}
![](${ogInfo.ogImage}){:width 500}`

    await logseq.Editor.updateBlock(blockUuid, string)
}

async function slashCommandHandler() { 
    const block = await logseq.Editor.getCurrentBlock()
    const content = block?.content

    if(block == null || content == null || !isValidHttpUrl(content)) {
        errorHandler("Block does not contain a valid URL.")
    }

    const response = await fetchWebsite(content)
    const ogInfo = await fetchOgInformation(await response.text());
    updateBlockContent(block.uuid, ogInfo);
}

async function main() {
    logseq.Editor.registerSlashCommand("Fetch Open Graph information", async () => slashCommandHandler())
}

// bootstrap
logseq.ready(main).catch(console.error)
