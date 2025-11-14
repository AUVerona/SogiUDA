'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: {
    user: {
      name: string;
      email: string;
      role: string;
      scuola: string;
    };
  };
}

export default function DashboardLayout({ children, session }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  let menuItems;
  if (session.user.role === 'admin') {
    menuItems = [
      { name: 'Storico Assegnazioni', path: '/dashboard/admin/storico', icon: '▦' },
      { name: 'Utenti', path: '/dashboard/admin/utenti', icon: '▣' },
      { name: 'Cestino', path: '/dashboard/admin/cestino', icon: '🗑️' },
    ];
  } else {
    menuItems = [
      { name: 'Assegnazione Ore', path: '/dashboard/assegnazione', icon: '▣' },
      { name: 'Storico Assegnazioni', path: '/dashboard/storico', icon: '▦' },
      { name: 'Impostazioni', path: '/dashboard/impostazioni', icon: '⚙' },
    ];
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className={styles.logo}>SOGI UDA</h1>
        </div>

        <div className={styles.topbarRight}>
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{session.user.name}</span>
              <span className={styles.userRole}>
                {session.user.role === 'admin' ? 'Amministratore' : 'Docente'}
              </span>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Esci
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <nav className={styles.sidebarNav}>
          <div className={styles.schoolInfo}>
            <span className={styles.schoolLabel}>Scuola</span>
            <span className={styles.schoolName}>{session.user.scuola}</span>
          </div>

          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`${styles.menuItem} ${pathname === item.path ? styles.menuItemActive : ''}`}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  {sidebarOpen && <span className={styles.menuText}>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`${styles.mainContent} ${sidebarOpen ? styles.mainContentWithSidebar : styles.mainContentFull}`}>
        {children}
      </main>
    </div>
  );
}
