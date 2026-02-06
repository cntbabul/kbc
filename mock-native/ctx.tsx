import React from 'react';

const AuthContext = React.createContext<{
    signIn: () => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
} | null>(null);

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (!value) {
        throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [session, setSession] = React.useState<string | null>(null);

    return (
        <AuthContext.Provider
            value={{
                signIn: () => {
                    // Perform sign-in logic here
                    setSession('mock-session-token');
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading: false,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
