
import {
    LayoutGrid,
    Users,
    Car,
    FileText,
    Wallet,
    Receipt,
    BarChart3,
    Wrench,
    Settings,
    FileCheck,
} from 'lucide-react';

import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const navigationGroups: {
    title: string;
    items: NavItem[];
}[] = [
    {
        title: 'GÉNÉRAL',
        items: [
            {
                title: 'Tableau de bord',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'GESTION',
        items: [
            {
                title: 'Chauffeurs',
                href: '/chauffeurs',
                icon: Users,
            },
            {
                title: 'Véhicules',
                href: '/vehicules',
                icon: Car,
            },
            {
                title: 'Contrats',
                href: '/contrats',
                icon: FileText,
            },
        ],
    },
    {
        title: 'FINANCES',
        items: [
            {
                title: 'Versements',
                href: '/versements',
                icon: Wallet,
            },
            {
                title: 'Dépenses',
                href: '/depenses',
                icon: Receipt,
            },
            {
                title: 'Rapports mensuels',
                href: '/rapports/mensuel',
                icon: BarChart3,
            },
        ],
    },
    {
        title: 'SUIVI TECHNIQUE',
        items: [
            {
                title: 'Pannes',
                href: '/pannes',
                icon: Wrench,
            },
            {
                title: 'Entretiens',
                href: '/entretiens',
                icon: Settings,
            },
            {
                title: 'Documents véhicules',
                href: '/documents-vehicules',
                icon: FileCheck,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navigationGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
