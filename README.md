# Task Manager — Vue 3 + TypeScript

A professional task management dashboard matching the provided design.

## 🗂 Project Structure

```
task-manager/
├── db/
│   └── db.json                    # JSON Server mock database
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── css/
│   │       ├── main.css           # CSS entry (imports all layers)
│   │       ├── variables.css      # Design tokens / CSS variables
│   │       ├── base.css           # Reset & base styles
│   │       └── utilities.css      # Reusable utility classes
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── StatsCard.vue      # Stat summary card
│   │   ├── layout/
│   │   │   ├── AppLayout.vue      # Main layout wrapper
│   │   │   ├── AppSidebar.vue     # Left navigation sidebar
│   │   │   └── AppTopbar.vue      # Top header bar
│   │   ├── tasks/
│   │   │   ├── TaskRow.vue        # Single task list row
│   │   │   └── TaskModal.vue      # Add / Edit task modal
│   │   └── ui/
│   │       ├── AppPagination.vue  # Pagination controls
│   │       └── ConfirmModal.vue   # Delete confirmation modal
│   ├── composables/
│   │   └── useApi.ts              # Axios API service layer
│   ├── router/
│   │   └── index.ts               # Vue Router config
│   ├── stores/
│   │   └── taskStore.ts           # Pinia task store
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── views/
│   │   ├── DashboardView.vue      # / — Main dashboard
│   │   ├── TasksView.vue          # /tasks
│   │   ├── CategoriesView.vue     # /categories
│   │   ├── UsersView.vue          # /users
│   │   └── SettingsView.vue       # /settings
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Run both dev server + JSON Server together
npm run dev

# App → http://localhost:5173
# API → http://localhost:3001
```

## 📦 Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Framework   | Vue 3 (Composition API)|
| Language    | TypeScript             |
| State       | Pinia                  |
| Routing     | Vue Router 4           |
| HTTP        | Axios                  |
| Mock DB     | JSON Server            |
| Build       | Vite 5                 |

## ✨ Features

- ✅ Full CRUD (Create, Read, Update, Delete) tasks
- ✅ Real-time stats (Total / Completed / In Progress / Pending)
- ✅ Search tasks by title, description, or assignee
- ✅ Filter by status (All / Completed / In Progress / Pending)
- ✅ Pagination (5 tasks per page, configurable in Settings)
- ✅ Add / Edit task modal with form validation
- ✅ Delete confirmation modal
- ✅ Fully responsive (mobile sidebar, adaptive layouts)
- ✅ Smooth CSS transitions and animations
- ✅ Professional sidebar with active route highlighting
- ✅ Categories, Users, Settings pages
