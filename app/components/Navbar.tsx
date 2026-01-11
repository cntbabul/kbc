import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut } from '@/auth';
import './Navbar.css';

export default async function Navbar() {
    const session = await auth();
    const userName = session?.user?.name || "Guest";
    const userImage = session?.user?.image;
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <nav className="navbar">
            <div className="navbar-header">
                <Link href="/" className="logo-text">
                    KBC Quiz
                </Link>
            </div>

            <div className="nav-links">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
            </div>

            <div className="user-section-wrapper">
                {session?.user ? (
                    <div className="user-section">
                        <div className="user-info">
                            {userImage ? (
                                <Image
                                    src={userImage}
                                    alt={userName}
                                    width={32}
                                    height={32}
                                    className="user-avatar-img"
                                />
                            ) : (
                                <div className="user-avatar">
                                    <span>{userInitial}</span>
                                </div>
                            )}
                            <span className="user-name">{userName}</span>
                        </div>

                        <form action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/" })
                        }}>
                            <button type="submit" className="signout-btn">
                                Sign Out
                            </button>
                        </form>
                    </div>
                ) : (
                    <Link href="/login" className="login-btn">
                        Login / Signup
                    </Link>
                )}
            </div>
        </nav>
    );
}
