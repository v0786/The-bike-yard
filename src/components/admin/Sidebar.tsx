// Admin Sidebar Navigation
// Follows DESIGN.md, API.md §9, AUTH_SECURITY.md

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  roles: (
    | 'Super Admin'
    | 'Owner'
    | 'Manager'
    | 'Sales Exec'
    | 'Accountant'
    | 'Insurance Staff'
    | 'RTO Staff'
  )[];
};

const sidebarItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager', 'Sales Exec', 'Accountant'],
  },
  {
    id: 'brands',
    label: 'Brands & Models',
    href: '/admin/brands',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager'],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    href: '/admin/inventory',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager'],
  },
  {
    id: 'customers',
    label: 'Customers',
    href: '/admin/customers',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager', 'Sales Exec'],
  },
  {
    id: 'leads',
    label: 'Leads & CRM',
    href: '/admin/leads',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager', 'Sales Exec'],
  },
  {
    id: 'test-rides',
    label: 'Test Rides',
    href: '/admin/test-rides',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager', 'Sales Exec'],
  },
  {
    id: 'bookings',
    label: 'Bookings',
    href: '/admin/bookings',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager', 'Sales Exec'],
  },
  {
    id: 'sales',
    label: 'Sales',
    href: '/admin/sales',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager', 'Sales Exec'],
  },
  {
    id: 'payments',
    label: 'Payments',
    href: '/admin/payments',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager', 'Accountant'],
  },
  {
    id: 'invoices',
    label: 'Invoices',
    href: '/admin/invoices',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager', 'Accountant'],
  },
  {
    id: 'refunds',
    label: 'Refunds',
    href: '/admin/refunds',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager'],
  },
  {
    id: 'finance',
    label: 'Finance Applications',
    href: '/admin/finance',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager'],
  },
  {
    id: 'insurance',
    label: 'Insurance',
    href: '/admin/insurance',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Insurance Staff'],
  },
  {
    id: 'rto',
    label: 'RTO Applications',
    href: '/admin/rto',
    icon: null,
    roles: ['Super Admin', 'Owner', 'RTO Staff'],
  },
  {
    id: 'expenses',
    label: 'Expenses',
    href: '/admin/expenses',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Accountant'],
  },
  {
    id: 'staff',
    label: 'Staff Management',
    href: '/admin/staff',
    icon: null,
    roles: ['Super Admin', 'Owner', 'Manager'],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    icon: null,
    roles: ['Super Admin', 'Owner'],
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: null,
    roles: ['Super Admin', 'Owner'],
  },
];

export function AdminSidebar() {
  // Get user role from session - in production this would come from auth state
  const userRole: string | null =
    typeof window !== 'undefined' ? (window as any).userRole || null : null;

  // Filter sidebar items based on user role
  const visibleItems = sidebarItems.filter((item) => item.roles.includes(userRole as any));

  return (
    <aside className="border-r border-brand-secondary bg-bg-secondary min-h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-brand-secondary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tighter">The Bike Yard</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const pathname =
              typeof window !== 'undefined' ? window.location.pathname : '';
            const isActive =
              pathname === item.href ||
              (item.href === '/admin/dashboard' && pathname.startsWith('/admin'));
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`block rounded-md px-4 py-2.5 text-sm font-medium text-brand-primary hover:text-white hover:bg-brand-secondary/20 transition-colors ${isActive ? 'bg-brand-primary text-white' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon || (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Role badge */}
      {userRole && (
        <div className="p-3 text-xs font-medium {'Super Admin': 'bg-brand-primary text-white', 'Owner': 'bg-brand-secondary text-white', 'Manager': 'bg-brand-secondary/20 text-brand-primary', 'Sales Exec': 'bg-brand-secondary/20 text-brand-primary', 'Accountant': 'bg-brand-secondary/20 text-brand-primary', 'Insurance Staff': 'bg-brand-secondary/20 text-brand-primary', 'RTO Staff': 'bg-brand-secondary/20 text-brand-primary'}[userRole] || 'text-brand-secondary'}">
          {userRole}
        </div>
      )}
    </aside>
  );
}
