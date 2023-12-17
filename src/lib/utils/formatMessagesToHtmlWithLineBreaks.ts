export default function formatMessagesToHtmlWithLineBreaks(messages: string[]): string {
    return messages.map(item => `${item}</br>`).join('');
}