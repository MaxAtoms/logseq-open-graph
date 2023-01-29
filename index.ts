function main() {
  logseq.Editor.registerSlashCommand("Open Graph", async () => {
    const block = await logseq.Editor.getCurrentBlock();
    const content = block.content;
    logseq.App.showMsg(`Loading link: ${content}`);
    var image = await fetch(content)
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (!contentType.includes("text/html")) {
          logseq.App.showMsg("Invalid content-type");
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html").head;
        const meta = doc.querySelector(`meta[property='og:image']`);
        const ogImage = meta ? meta.getAttribute("content") : null;
        logseq.App.ShowMsg(`Image link is: ${ogImage}`);
        return ogImage;
      })
      .catch((error) => {
        logseq.App.showMsg("Could not load the webpage");
      });

    var string=`![${content}](${image})`
    await logseq.Editor.updateBlock(block.uuid, string);
  });
}

// bootstrap
logseq.ready(main).catch(console.error);
