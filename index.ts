import '@logseq/libs'

async function fetchOGImage(content: string) : Promise<string> {
    const response = await fetch(content);
    const contentType = response.headers.get("content-type");

    if(contentType == null || !contentType.includes("text/html")) {
        throw new Error("Loaded URL is not a valid HTML page");
    }

    const html = await response.text();
    const parser = new DOMParser();
    const htmlHead = parser.parseFromString(html, "text/html").head;
    const metaTag = htmlHead.querySelector(`meta[property='og:image']`);
    const ogImage = metaTag ? metaTag.getAttribute("content") : null;

    if(ogImage == null) {
        throw new Error("Page does not contain image");
    }

    return ogImage;
}

async function main() {
  logseq.Editor.registerSlashCommand("Add Open Graph image", async () => {
    const block = await logseq.Editor.getCurrentBlock();
    const content = block?.content;

    if(block == null || content == null) {
        throw new Error("Block does not contain content");
    }

    const image = await fetchOGImage(content);

    var string=`![${content}](${image})`
    await logseq.Editor.updateBlock(block.uuid, string);
  });
}

// bootstrap
logseq.ready(main).catch(console.error);
