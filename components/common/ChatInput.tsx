import { supabase } from '../lib/supabaseClient';

function ChatInput() {
    // ... existing code ...

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) {
                throw new Error(`handleGoogleLogin: Error logging in with Google - ${error.message}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* ... existing input elements ... */}
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
}
// ... existing code ...
