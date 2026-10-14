import React from "react";
import { AdminLayoutShell } from "@/components/admin/AdminSidebar";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata = {
  title: "Painel Editorial | Belezura News CMS",
  description: "Sistema de gerenciamento de conteúdo e radar de notícias do Belezura News.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AuthProvider>
  );
}
