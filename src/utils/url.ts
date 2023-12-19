export function openLink(url: string, { openInNew = false } = {}) {
    const link = document.createElement('a');
    link.href = url;
    if (openInNew) {
        link.target = '_blank';
    }
    link.click();
}