import { errorHandler } from "./utils"

export type OgInformation = {
    ogTitle: string;
    ogImage: string;
    ogUrl: string;
}

export async function extractOgInformation(webpage: string) : Promise<OgInformation> {
    let getMetaTagContent = (property: string) => {
        const metaTag = htmlHead.querySelector(`meta[property='og:${property}']`)
        return metaTag ? metaTag.getAttribute("content") : null
    }

    const parser = new DOMParser();
    const htmlHead = parser.parseFromString(webpage, "text/html").head

    const ogTitle = getMetaTagContent("title")
    const ogUrl = getMetaTagContent("url")
    const ogImage = getMetaTagContent("image")

    if(ogImage == null || ogTitle == null || ogUrl == null ) {
        errorHandler( "Could not grab image, title or url." )
    }

    return { ogTitle, ogImage, ogUrl };
}

