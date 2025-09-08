"use client";

import { AdminLayoutClient } from "./_components/admin-layout-client";

const hideScrollbarStyle = `
  ::-webkit-scrollbar {
    display: none;
  }
  
  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style jsx global>{hideScrollbarStyle}</style>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </>
  );
}