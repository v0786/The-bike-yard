// Staff Sidebar Navigation
// Follows DESIGN.md, API.md §9, AUTH_SECURITY.md

type NavItem = {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
  roles: ("Super Admin" | "Owner" | "Manager" | "Sales Exec" | "Accountant" | "Insurance Staff" | "RTO Staff")[]
}

const staffNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/staff/dashboard", icon: null, roles: ["Super Admin", "Owner", "Manager", "Sales Exec", "Accountant", "Insurance Staff", "RTO Staff"] },
  { id: "leads", label: "Assigned Leads", href: "/staff/leads", icon: null, roles: ["Super Admin", "Owner", "Manager", "Sales Exec", "Insurance Staff", "RTO Staff"] },
  { id: "bookings", label: "Bookings", href: "/staff/bookings", icon: null, roles: ["Super Admin", "Owner", "Manager", "Sales Exec"] },
  { id: "test-rides", label: "Test Rides", href: "/staff/test-rides", icon: null, roles: ["Super Admin", "Owner", "Manager", "Sales Exec"] },
  { id: "finance", label: "Finance Tasks", href: "/staff/finance", icon: null, roles: ["Super Admin", "Owner", "Manager", "Accountant"] },
  { id: "insurance", label: "Insurance Tasks", href: "/staff/insurance", icon: null, roles: ["Super Admin", "Owner", "Insurance Staff"] },
  { id: "rto", label: "RTO Tasks", href: "/staff/rto", icon: null, roles: ["Super Admin", "Owner", "RTO Staff"] },
  { id: "tasks", label: "My Tasks", href: "/staff/tasks", icon: null, roles: ["Super Admin", "Owner", "Manager", "Sales Exec", "Accountant"] },
  { id: "profile", label: "My Profile", href: "/staff/profile", icon: null, roles: ["Super Admin", "Owner", "Manager", "Sales Exec", "Accountant", "Insurance Staff", "RTO Staff"] },
]

export function StaffSidebar() {
  // Get user role from session - in production this would come from auth state
  const userRole: string | null = typeof window !== "undefined" ? (window as any).userRole || null : null

  // Filter sidebar items based on user role
  const visibleItems = staffNavItems.filter((item) =>
    item.roles.includes(userRole as any)
  )

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
          {visibleItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="block rounded-md px-4 py-2.5 text-sm font-medium text-brand-primary hover:text-white hover:bg-brand-secondary/20 transition-colors"
                aria-current={item.href === typeof window !== "undefined" ? window.location.pathname : undefined}
              >
                {item.icon || (
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User role badge */}
      {userRole && (
        <div className="p-3 text-xs font-medium">
          {userRole}
        </div>
      )}
    </aside>
  )
}