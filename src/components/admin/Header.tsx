// Admin Header
// Follows DESIGN.md, API.md §9, AUTH_SECURITY.md

export function AdminHeader() {
  return (
    <header className="bg-bg-secondary border-b border-brand-secondary flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tighter">The Bike Yard</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-secondary"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 21v2a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
          </svg>
          <span className="ml-2 text-sm font-medium text-brand-primary">Super Admin</span>
        </div>

        <button
          className="p-2 rounded-lg hover:bg-brand-secondary/20 transition-colors"
          aria-label="Open notifications"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l2.88 5.32a59.69 59.69 0 0 1-.41 2.51c-.77 2.11-2.36 3.89-4.68 5.04a1.06 1.06 0 0 1-.54-.82l.15-1.68c0-.41.16-.58.53-.53L12 5.16l-7.08 1.55a1.07 1.07 0 0 1-.76-.3l-.15-.12a.741 .741 0 0 0-.44-.13l-.08-.12a.627 .627 0 0 1-.37-.28l-.04-.05a.578 .578 0 0 1-.12-.08L3.82 2.08a1.082 1.082 0 0 1-.09-.33L2 12l1.68 7.08a1.082 1.082 0 0 1-.3.72l-.12.15a.741 .741 0 0 0-.13-.44l-.12-.08a.628 .628 0 0 1-.28-.37l-.05-.04a.58 .58 0 0 1-.08-.12l-.12-.15L12 21.25l8.907-2.88a59.93 59.93 0 0 1-2.51-.41L12 3Zm0 4.59l.01-.01L12 5.69l.01-.01a5.94 5.94 0 0 0 1.07-1.12l1.25-2.5c.53-.55.53-1.28 0-1.83l-1.25-2.5a5.94 5.94 0 0 0-1.07-1.12L12 6.16l-.01-.01a5.94 5.94 0 0 1-1.07-1.12 5.94 5.94 0 0 0-1.07 1.12L12 7.33l1.25 2.5c.53.55.53 1.28 0 1.83l-1.25 2.5a5.94 5.94 0 0 0 1.07 1.12l1.25-.35a59.35 59.35 0 0 1 1.07 1.07Zm-5.91 7.66l-.54 1.08c-.12.24-.28.46-.48.68l-1.25-2.5c-.45-.93-.77-1.75-1.07-2.58a.676 .676 0 0 1-.05-.73l.09-.25a3.09 3.09 0 0 1 .73-.5l1.68.71c.52.24.77.54.92.87l.45 1.38.02.01c.02.07.06.15.08.23l.31 1.2c.07.26.07.53.05.78l-1.25 2.5c-.39.96-.78 1.66-1.19 2.3a.678 .678 0 0 1-.31.78l.09.25a3.12 3.12 0 0 1-.5.73l-.09.25a5.83 5.83 0 0 1-.74 1.05l-.54-1.08c-.2-.38-.44-.76-.68-1.14l-1.25 2.5a5.94 5.94 0 0 1-1.07 1.12l-.54 1.08c-.12.24-.28.46-.48.68l-1.25-2.5c-.45-.93-.77-1.75-1.07-2.58a.676 .676 0 0 1-.05-.73l.09-.25a3.09 3.09 0 0 1 .73-.5l1.68-.71c.52-.24.77-.54.92-.87l-.45-1.38.02-.01c.02-.07.06-.15.08-.23l.31-1.2c.07-.26.07-.53.05-.78Z" />
          </svg>
          <span className="ml-2 text-sm font-medium text-brand-primary">Super Admin</span>
        </button>
      </div>
    </header>
  );
}
