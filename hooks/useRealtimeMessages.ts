import { useEffect, useState } from 'react';
import { Message } from '../types/message';

function useRealtimeMessages() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessages(prevMessages => {
                const oneHourAgo = Date.now() - 3600000;
                return prevMessages.filter(msg => msg.timestamp > oneHourAgo);
            });
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return [messages, setMessages];
}

export default useRealtimeMessages;
