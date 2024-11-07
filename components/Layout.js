// components/Layout.js
import React from 'react';
import Link from 'next/link';

const Layout = ({ children }) => (
  <div className='main'>
    <header>
      <nav>
        <Link href="/" className='nav-link'>Home</Link>
        <Link href="/dashboard" className='nav-link'>Dashboard</Link>
        <Link href="/marketplace" className='nav-link'>Marketplace</Link>
        <Link href="/mint" className='nav-link'>Mint</Link>
        <Link href="/songs" className='nav-link'>Songs</Link>
      </nav>
    </header>
    <main>{children}</main>
  </div>
);

export default Layout;
