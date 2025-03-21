interface SidebarLink {
    to: string;
    icon: string;
    label: string;
    isModal?: boolean;
}

export const sidebarLinks: SidebarLink[] = [
    {
      to: "/dashboard",
      icon: "fa-home",
      label: "Dashboard"
    },
    {
      to: "/orders",
      icon: "fa-table",
      label: "Pedidos"
    },
    {
      to: "/performance",
      icon: "fa-chart-line",
      label: "Desempenho"
    },
    {
      to: "/about",
      icon: "fa-cogs",
      label: "Sobre o sistema"
    },
    {
      to: "/feedback",
      icon: "fa-comments",
      label: "Feedback"
    }
  ];