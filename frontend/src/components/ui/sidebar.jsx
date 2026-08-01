import * as React from 'react';
import { Dialog } from '@base-ui/react';
import { PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_STORAGE_KEY = 'simklinik-sidebar';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

/**
 * SidebarContext — state collapsible sidebar.
 * `collapsed` hanya berpengaruh di desktop (lg+);
 * di mobile sidebar selalu tampil sebagai sheet.
 */
const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within <SidebarProvider>');
  }
  return context;
}

const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;

const SidebarProvider = React.forwardRef(
  (
    { defaultCollapsed = false, storageKey = SIDEBAR_STORAGE_KEY, className, children },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState(() => {
      try {
        return localStorage.getItem(storageKey) === 'true';
      } catch {
        return defaultCollapsed;
      }
    });
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
      try {
        localStorage.setItem(storageKey, String(collapsed));
      } catch {
        /* storage tidak tersedia — abaikan */
      }
    }, [collapsed, storageKey]);

    React.useEffect(() => {
      const onKeyDown = (event) => {
        if (
          event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          setCollapsed((prev) => !prev);
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const toggleSidebar = React.useCallback(
      () => setCollapsed((prev) => !prev),
      []
    );

    return (
      <SidebarContext.Provider
        value={{ collapsed, toggleSidebar, mobileOpen, setMobileOpen }}
      >
        <div ref={ref} className={cn('flex min-h-svh w-full', className)}>
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile — sheet */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
        <Dialog.Portal>
          <Dialog.Popup className="fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-sidebar shadow-xl outline-none lg:hidden">
            {children}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Desktop — kolom fixed, collapse ke ikon */}
      <aside
        ref={ref}
        data-state={collapsed ? 'collapsed' : 'expanded'}
        className={cn(
          'hidden h-svh shrink-0 overflow-hidden border-r border-line bg-sidebar transition-[width] duration-300 ease-in-out lg:block',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          className
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
});
Sidebar.displayName = 'Sidebar';

/**
 * SidebarInset — konten utama di samping sidebar (analog <main>).
 */
const SidebarInset = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex min-w-0 flex-1 flex-col', className)}
    {...props}
  >
    {children}
  </div>
));
SidebarInset.displayName = 'SidebarInset';

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('shrink-0 p-3', className)} {...props} />
));
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-auto shrink-0 p-3', className)} {...props} />
));
SidebarFooter.displayName = 'SidebarFooter';

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('min-h-0 flex-1 overflow-y-auto p-3', className)}
    {...props}
  />
));
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex w-full flex-col gap-1', className)} {...props} />
));
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-ink-muted',
      className
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <nav ref={ref} className={cn('flex w-full flex-col gap-1', className)} {...props} />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('group/menu-item relative w-full', className)} {...props} />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mx-3 h-px shrink-0 bg-outline-variant', className)}
    {...props}
  />
));
SidebarSeparator.displayName = 'SidebarSeparator';

/**
 * SidebarTrigger — toggle sidebar.
 * Desktop: collapse/expand; Mobile: buka sheet.
 */
const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, setMobileOpen } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle sidebar"
      onClick={(event) => {
        onClick?.(event);
        if (isMobile()) setMobileOpen(true);
        else toggleSidebar();
      }}
      className={cn(
        'flex size-9 items-center justify-center rounded-[8px] text-ink-soft transition-colors hover:bg-sidebar-hover hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
        className
      )}
      {...props}
    >
      <PanelLeft className="size-5" />
    </button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle sidebar"
      onClick={toggleSidebar}
      className={cn(
        'group/rail absolute right-0 top-0 z-20 hidden h-full w-2 -translate-x-1/2 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:rounded-full after:bg-outline-variant/50 hover:after:bg-brand-600 lg:flex',
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

export {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
};
