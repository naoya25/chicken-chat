function pruneMessagesByLength(messages: string[]): string[] {
    const maxLength = 500;
    let totalLength = 0;
    return messages.filter(message => {
        totalLength += message.length;
        return totalLength <= maxLength;
    });
}
