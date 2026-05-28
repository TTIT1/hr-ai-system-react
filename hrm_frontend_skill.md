# HRM System Frontend — Design & Architecture Skill

> Tài liệu hướng dẫn chi tiết để AI khác có thể xây dựng giao diện giống hệt dự án HRM System.
> Dựa trên phân tích mã nguồn thực tế từ `/home/ttit/Downloads/hrm-ai/hrm-ai/frontend`.

---

## 1. TECH STACK

| Layer | Công nghệ | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.1 |
| Language | TypeScript | ^5 |
| UI Library | React | 19.2.4 |
| CSS Framework | TailwindCSS v4 | ^4 |
| HTTP Client | Axios | 1.13.6 |
| Icons | Lucide React + Custom inline SVG | ^1.7.0 |
| Date Utils | date-fns | ^4.1.0 |
| Excel Export | xlsx + xlsx-js-style | ^0.18.5 |
| Theme | Custom CSS vars + localStorage | N/A |

### Package.json Scripts
```json
{
  "dev": "next dev --turbo --hostname 0.0.0.0",
  "build": "next build",
  "start": "next start --hostname 0.0.0.0"
}
```

---

## 2. TRIẾT LÝ THIẾT KẾ — "Premium Glassmorphism Dashboard"

### 2.1 Phong cách tổng quát
- **Glassmorphism** toàn bộ: sidebar, cards, modals đều dùng `backdrop-blur` + semi-transparent backgrounds
- **Typography**: Font-weight cực đậm (`font-black`), text transform `uppercase`, letter-spacing rộng (`tracking-widest`, `tracking-[0.3em]`)
- **Border-radius cực lớn**: Cards dùng `rounded-[40px]` đến `rounded-[56px]`, buttons dùng `rounded-2xl` đến `rounded-[32px]`
- **Dark-first**: Design tối ưu cho dark mode, light mode là secondary
- **Background ảnh thiên nhiên**: Dashboard có background image Unsplash phủ toàn màn hình với overlay gradient
- **Decorative orbs**: Các khối tròn blur lớn (`w-[500px]`) với gradient màu tím/xanh làm nền trang trí

### 2.2 Bảng màu chính
```css
:root {
  --primary: #6366f1;        /* Indigo-500 */
  --primary-hover: #4f46e5;  /* Indigo-600 */
  --accent: #8b5cf6;         /* Violet-500 */
  --app-bg-light: #f1f5f9;   /* Slate-100 */
  --app-bg-dark: #0a0a1f;    /* Near-black navy */
  --muted-fg: #64748b;       /* Slate-500 */
}
```

**Accent colors cho icons/cards:**
- Emerald-500 (`#10b981`) — Nhân viên, success
- Sky-500 (`#0ea5e9`) — Dự án
- Indigo-500 (`#6366f1`) — Chấm công, primary actions
- Rose-500 (`#f43f5e`) — Đơn từ, errors
- Amber-500 (`#f59e0b`) — Cấu hình, warnings

### 2.3 Badge/Status Colors
```css
.badge-on-time      { bg: rgba(16,185,129,0.15); color: #10b981; }
.badge-late         { bg: rgba(245,158,11,0.15); color: #f59e0b; }
.badge-insufficient { bg: rgba(139,92,246,0.15); color: #8b5cf6; }
.badge-absent       { bg: rgba(239,68,68,0.15);  color: #ef4444; }
.badge-approved     { bg: rgba(59,130,246,0.15);  color: #3b82f6; }
.badge-pending      { bg: rgba(234,179,8,0.15);   color: #eab308; }
```

---

## 3. HỆ THỐNG THEME (Light/Dark)

### 3.1 Cơ chế hoạt động
- Dùng `localStorage` key `hrm_theme_mode` lưu giá trị `light | dark | system`
- Script inline chạy `beforeInteractive` trong `<head>` để tránh flash
- CSS class trên `<html>`: `theme-light` hoặc `theme-dark` (+ `dark` cho Tailwind)
- Custom Tailwind variants: `@variant dark`, `@variant theme-dark`, `@variant theme-light`

### 3.2 CSS Variables theo theme
```css
.theme-light {
  --app-bg: #f1f5f9;
  --glass-bg: rgba(255, 255, 255, 0.6);
  --glass-border: rgba(15, 23, 42, 0.08);
}

.theme-dark {
  --app-bg: #0a0a1f;
  --glass-bg: rgba(15, 23, 42, 0.5);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

### 3.3 Glass CSS Classes
```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: var(--glass-dark-bg);
  backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid var(--glass-dark-border);
}
```

---

## 4. CẤU TRÚC THƯ MỤC

```
frontend/
├── app/
│   ├── globals.css              # Design system CSS (theme vars, glass, badges)
│   ├── layout.tsx               # Root layout (theme boot script, orbs)
│   ├── page.tsx                 # Root redirect → /login
│   ├── not-found.tsx            # Custom 404
│   ├── (auth)/
│   │   ├── layout.tsx           # Minimal layout for auth pages
│   │   └── login/page.tsx       # Login form (glassmorphism card)
│   └── (dashboard)/
│       ├── layout.tsx           # Auth guard + Sidebar + Header + ChatWidget
│       ├── loading.tsx          # Skeleton loading (animate-pulse)
│       ├── error.tsx            # Error boundary
│       ├── dashboard/page.tsx   # Main dashboard (weather + checkin + cards)
│       ├── employees/           # Employee CRUD + detail + components/
│       ├── attendance/          # Attendance calendar + team matrix
│       ├── apologies/           # Apology requests + review
│       ├── leave/               # Leave management
│       ├── ot/                  # Overtime requests
│       ├── projects/            # Project management + members
│       ├── holidays/            # Holiday management
│       ├── company/             # Company config + departments + positions
│       ├── settings/            # Role matrix + permissions
│       ├── chat/                # AI chatbot
│       └── _users/              # User account management (admin)
├── components/
│   ├── AuthProvider.tsx         # React Context for session + useSession() + useRBAC()
│   ├── Sidebar.tsx              # Sidebar nav with permission filtering
│   ├── Header.tsx               # Top bar (weather, clock, breadcrumb, notifications)
│   ├── Avatar.tsx               # Deterministic color avatar from name
│   ├── Toast.tsx                # Floating toast notifications
│   ├── ConfirmDialog.tsx        # Modal confirm (danger/warning/info variants)
│   ├── SearchableSelect.tsx     # Portal-based dropdown with search
│   ├── ChatWidget.tsx           # Floating AI chatbot widget
│   ├── ThemeToggle.tsx          # Light/Dark/System toggle
│   ├── ChangePasswordModal.tsx  # Password change modal
│   ├── NotificationPanel.tsx    # Sliding notification panel
│   ├── DraggableModal.tsx       # Draggable modal base
│   └── RoleDialog.tsx           # RBAC role editor
├── lib/
│   ├── api.ts                   # Axios instance + interceptors + token refresh
│   ├── auth.ts                  # Session helpers (clearSession)
│   ├── theme.ts                 # Theme mode get/set/apply
│   ├── utils.ts                 # formatVND, formatDate, formatTime, getInitials, getAvatarColor
│   ├── leaveApi.ts              # Leave API functions
│   ├── projectApi.ts            # Project API functions
│   ├── roleApi.ts               # Role API functions
│   └── permissionApi.ts         # Permission API functions
└── types/
    └── index.ts                 # All TypeScript interfaces (mirrors Spring Boot DTOs)
```

---

## 5. PATTERNS THIẾT KẾ GIAO DIỆN

### 5.1 Root Layout Pattern
```tsx
// app/layout.tsx
<html lang="vi" suppressHydrationWarning>
  <head>
    <Script id="theme-boot" strategy="beforeInteractive">
      {/* Inline script to read localStorage and set theme class */}
    </Script>
  </head>
  <body>
    {/* Decorative background orbs */}
    <div className="fixed -top-24 -right-24 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
    <div className="fixed -bottom-24 -left-24 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px]" />
    
    <ThemeInitializer />
    <HealthcheckProbe />
    {children}
  </body>
</html>
```

### 5.2 Dashboard Layout Pattern
```tsx
// app/(dashboard)/layout.tsx — Client Component
// 1. Fetch session via GET /api/auth/me (HTTPOnly cookie)
// 2. If no session → redirect to /login
// 3. Render:
<AuthProvider session={session}>
  <div className="flex h-screen overflow-hidden">
    {/* Full-screen background image */}
    <div className="fixed inset-0 bg-cover bg-center brightness-[0.35]"
         style={{ backgroundImage: "url('unsplash-nature-image')" }} />
    
    {/* Gradient overlay */}
    <div className="fixed inset-0 bg-gradient-to-tr from-[#020617]/80 via-[#020617]/20 to-transparent" />
    
    <Sidebar session={session} collapsed={collapsed} />
    <div className="flex flex-col flex-1">
      <Header session={session} collapsed={collapsed} pathname={pathname} />
      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-2">
        {children}
      </main>
    </div>
    <ChatWidget />
  </div>
</AuthProvider>
```

### 5.3 Card Pattern (Dashboard Feature Cards)
```tsx
// Card với icon + label + sub-label
<Link href="/employees" className="
  bg-white/80 dark:bg-white/5 
  backdrop-blur-3xl 
  rounded-[40px] 
  p-8 
  border border-black/5 dark:border-white/10 
  shadow-xl dark:shadow-3xl 
  hover:bg-white dark:hover:bg-white/10 
  transition-all 
  flex flex-col justify-between 
  group
">
  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
    <svg>...</svg>
  </div>
  <div className="mt-8">
    <h3 className="text-2xl font-black uppercase tracking-tighter">Nhân viên</h3>
    <p className="text-xs font-bold text-slate-500 dark:text-white/30 uppercase tracking-widest mt-2">Quản lý hồ sơ</p>
  </div>
</Link>
```

### 5.4 Table Pattern (trong page CRUD)
```tsx
// Typical data table structure
<div className="glass-dark rounded-[32px] overflow-hidden border border-black/5 dark:border-white/10">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-black/5 dark:border-white/5">
          <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 dark:text-white/30 uppercase tracking-widest">
            Column Name
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
          <td className="px-6 py-4">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Value</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### 5.5 Form Input Pattern
```tsx
<div>
  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2 ml-1">
    Label Name
  </label>
  <input
    className="w-full px-6 py-4 rounded-2xl 
      bg-black/[0.03] dark:bg-white/5 
      border border-black/5 dark:border-white/10 
      text-slate-900 dark:text-white 
      placeholder-slate-500 dark:placeholder-white/20 
      text-sm font-bold 
      focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 
      transition-all tracking-tight"
  />
</div>
```

### 5.6 Primary Button Pattern
```tsx
<button className="
  w-full py-5 rounded-2xl 
  font-black text-xs uppercase tracking-[0.3em] 
  text-white bg-indigo-600 hover:bg-indigo-500 
  shadow-2xl shadow-indigo-600/30 
  disabled:opacity-60 
  transition-all hover:scale-[1.02] active:scale-95 duration-300 
  ring-4 ring-indigo-500/10
">
  Label Text
</button>
```

### 5.7 Modal/Dialog Pattern
```tsx
<div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onCancel} />
  
  {/* Content */}
  <div className="relative bg-white dark:bg-slate-900 rounded-[32px] shadow-3xl w-full max-w-md overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-200">
    <div className="p-8">
      {/* Icon + Title + Message */}
    </div>
    <div className="px-8 py-6 bg-slate-50/50 dark:bg-white/5 flex gap-3 border-t border-black/5 dark:border-white/5">
      {/* Cancel + Confirm buttons */}
    </div>
  </div>
</div>
```

### 5.8 Page Header Pattern (trên mỗi page CRUD)
```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
      Page Title
    </h1>
    <p className="text-sm font-bold text-white/40 uppercase tracking-widest mt-2">
      Subtitle description
    </p>
  </div>
  <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">
    + Thêm mới
  </button>
</div>
```

### 5.9 Loading Skeleton Pattern
```tsx
// app/(dashboard)/loading.tsx
<div className="flex-1 space-y-4 p-8 pt-6 animate-pulse">
  <div className="h-10 w-[200px] bg-slate-200 dark:bg-slate-800 rounded-md" />
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
    {/* repeat */}
  </div>
</div>
```

---

## 6. SIDEBAR NAVIGATION

### 6.1 Cấu trúc NAV_ITEMS
```tsx
const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tổng quan', icon: 'grid', 
    roles: ['OFFICIAL','PROBATION','INTERN','OUTSOURCE','PART-TIME','PM','HR','ADMIN'] },
  { href: '/employees', label: 'Nhân viên', icon: 'users', 
    roles: [...], permission: 'EMP_VIEW' },
  // ...
];
```

### 6.2 Filtering logic
```tsx
const visibleItems = NAV_ITEMS.filter((item) => {
  const hasRequiredRole = item.roles.includes(session.role);
  if (!hasRequiredRole) return false;
  if (item.permission) {
    return session.permissions?.includes(item.permission) ?? false;
  }
  return true;
});
```

### 6.3 Active state styling
```
Active: bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)] ring-1 ring-white/10
Inactive: text-slate-900 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5
```

---

## 7. AUTHENTICATION & API

### 7.1 Auth Flow
1. Login form POST `/api/auth/login` → Backend sets HTTPOnly cookies (access + refresh)
2. Dashboard layout calls `GET /api/auth/me` to get session
3. Axios interceptor catches 401 → auto-refresh via `POST /api/auth/refresh`
4. If refresh fails → redirect to `/login`

### 7.2 Axios Instance Config
```tsx
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,  // Critical for cookies
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});
```

### 7.3 AuthProvider Context
```tsx
// useSession() — get current session
const { session } = useSession();

// useRBAC() — check permissions
const { hasRole, hasPermission } = useRBAC();
hasRole('ADMIN', 'HR');
hasPermission('EMP_VIEW_ALL');
```

---

## 8. UTILITY FUNCTIONS

```tsx
// Format tiền VNĐ: 10500000 → "10.500.000 ₫"
formatVND(amount: number): string

// Format ngày: "2024-03-15" → "15/03/2024"
formatDate(dateStr: string): string

// Format giờ: "2024-03-15T09:32:00" → "09:32"
formatTime(isoStr: string): string

// Avatar initials: "Nguyễn Văn A" → "NVA"
getInitials(fullName: string): string

// Deterministic avatar color from name
getAvatarColor(name: string): string  // Returns hex from 8-color palette
```

---

## 9. TYPOGRAPHY RULES

| Element | Classes |
|---|---|
| Page Title (H1) | `text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter` |
| Section Title | `text-2xl font-black uppercase tracking-tighter` |
| Card Title | `text-xl font-black uppercase tracking-wider` |
| Body Text | `text-sm font-bold` |
| Label | `text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30` |
| Sub-label | `text-[9px] font-bold tracking-widest uppercase opacity-60` |
| Badge | `text-[10px] font-black uppercase tracking-widest` |
| Button | `font-black text-xs uppercase tracking-[0.3em]` |
| Navbar Item | `text-sm font-black uppercase tracking-[0.15em]` |

---

## 10. RESPONSIVE BREAKPOINTS

| Breakpoint | Usage |
|---|---|
| Mobile-first | All base styles |
| `sm:` (640px) | Weather widget visibility, button sizing |
| `md:` (768px) | Sidebar relative positioning, grid cols |
| `lg:` (1024px) | Header pill navigation, 12-col grid |
| `xl:` (1280px) | Hero flex-row layout |

### Sidebar Responsive Behavior
- Mobile: sidebar slides in/out with overlay backdrop (`-translate-x-full` → `translate-x-0`)
- Desktop: sidebar toggles between collapsed (88px icon-only) and expanded (280px)

---

## 11. ANIMATION PATTERNS

```css
/* Hover scale on icons */
group-hover:scale-110 transition-transform

/* Button press feedback */
active:scale-95 hover:scale-[1.02]

/* Smooth transitions */
transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]

/* Pulse indicator */
animate-pulse

/* Fade-in on mount (Tailwind animate-in plugin) */
animate-in fade-in zoom-in duration-700
animate-in fade-in slide-in-from-left-4 duration-500

/* Loading spinner */
animate-spin (border-4 border-indigo-500/20 border-t-indigo-500 rounded-full)
```

---

## 12. KEY DESIGN TOKENS (Tailwind Classes)

### Spacing & Radius
```
Card padding:     p-8 to p-10
Card radius:      rounded-[32px] to rounded-[56px]
Button radius:    rounded-2xl to rounded-[32px]
Input radius:     rounded-2xl
Modal radius:     rounded-[32px]
Icon container:   w-14 h-14 rounded-2xl
```

### Shadows
```
Card:   shadow-xl dark:shadow-3xl
Button: shadow-2xl shadow-indigo-600/30
Icon:   shadow-2xl
Modal:  shadow-3xl
```

### Borders
```
Light: border border-black/5
Dark:  border border-white/10
Divider light: border-b border-black/5
Divider dark:  border-b border-white/5
```

### Backgrounds (semi-transparent)
```
Card light:    bg-white/80
Card dark:     bg-white/5
Input light:   bg-black/[0.03]
Input dark:    bg-white/5
Hover light:   hover:bg-black/5
Hover dark:    hover:bg-white/5
Backdrop blur:  backdrop-blur-3xl
```

---

## 13. NGÔN NGỮ GIAO DIỆN

Toàn bộ UI được viết bằng **tiếng Việt**, bao gồm:
- Labels, placeholders, button texts
- Error messages
- Toast notifications
- Status badges (ĐÚNG GIỜ, ĐI MUỘN, THIẾU GIỜ, VẮNG MẶT...)
- Navigation labels (Tổng quan, Nhân viên, Chấm công, Giải trình...)

---

## 14. CHECKLIST KHI TẠO TRANG MỚI

1. **File**: Tạo `app/(dashboard)/feature-name/page.tsx` (use client)
2. **Auth**: Dùng `useSession()` từ `AuthProvider` để lấy session
3. **RBAC**: Check permission trước khi render nội dung (`hasPermission('CODE')`)
4. **API**: Import `api` từ `@/lib/api`, gọi REST endpoints
5. **Toast**: Import `Toast, ToastState` cho thông báo
6. **Document title**: Set `document.title = 'Tên trang | HRM System'` trong useEffect
7. **Page header**: H1 + subtitle + action button
8. **Data table**: Sử dụng glass-dark card + table pattern
9. **Modals**: Portal-based, backdrop blur, rounded-[32px]
10. **Loading**: Skeleton với animate-pulse
11. **Error**: try/catch với toast error messages bằng tiếng Việt

---

## 15. VÍ DỤ THAM CHIẾU (Reference Files)

| Pattern | File |
|---|---|
| Login Page | `app/(auth)/login/page.tsx` |
| Dashboard | `app/(dashboard)/dashboard/page.tsx` |
| CRUD Page | `app/(dashboard)/employees/page.tsx` |
| Detail Page | `app/(dashboard)/employees/[id]/page.tsx` |
| Sidebar | `components/Sidebar.tsx` |
| Header | `components/Header.tsx` |
| Toast | `components/Toast.tsx` |
| Modal/Dialog | `components/ConfirmDialog.tsx` |
| Dropdown | `components/SearchableSelect.tsx` |
| Avatar | `components/Avatar.tsx` |
| API Client | `lib/api.ts` |
| Types | `types/index.ts` |
| CSS System | `app/globals.css` |
