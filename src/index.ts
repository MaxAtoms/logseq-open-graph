import '@logseq/libs'

import { errorHandler, isValidHttpUrl } from './utils'
import { OgInformation, extractOgInformation } from './opengraph'

async function fetchWebsite(content: string) {
    const response = await fetch(content)
    const contentType = response.headers.get('content-type')

    if (contentType == null || !contentType.includes('text/html')) {
        errorHandler('Loaded URL is not a valid HTML page')
    }
    return response
}

let createBlockContent = (ogInfo: OgInformation) => {
    return `## ${ogInfo.ogTitle}
${ogInfo.ogUrl}
![](${ogInfo.ogImage}){:width 500}`
}

async function slashCommandHandler() {
    const block = await logseq.Editor.getCurrentBlock()
    const content = block?.content

    if (block == null || content == null || !isValidHttpUrl(content)) {
        errorHandler('Block does not contain a valid URL.')
    }

    const response = await fetchWebsite(content)
    const ogInfo = await extractOgInformation(await response.text())
    const newBlockContent = createBlockContent( ogInfo )

    await logseq.Editor.updateBlock(block.uuid, newBlockContent)
}

async function main() {
    logseq.Editor.registerSlashCommand('Fetch Open Graph information', async () =>
        slashCommandHandler()
    )
}

logseq.ready(main).catch(console.error)
