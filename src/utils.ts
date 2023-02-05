import '@logseq/libs'

export function isValidHttpUrl(string: string) {
    let url:URL;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export function errorHandler(message:string) : never {
    logseq.UI.showMsg(message);
    throw new Error(message);
}
