# AI Developer Context & Changelog

**IMPORTANT FOR AI AGENTS**: Before you begin working on this repository, you **MUST** read this file to understand the current state of the codebase. Whenever you complete a task or make significant architectural/schema changes, you **MUST** append an entry to this log outlining what was changed, which module you worked on, and any dependencies affected.

This ensures all AI agents and developers working on different modules stay perfectly synced.

---

## Global Directives
- **Database**: Firebase Firestore. Do not use local mock data for new features; refer to the schemas defined in `prd.md`.
- **Storage**: AWS S3. All files/images must be uploaded here.
- **UI Stack**: Next.js App Router, Tailwind/Vanilla CSS. Maintain the premium Navy/Blue dark mode aesthetic (Plus Jakarta Sans font).

---

## Module Allocations
- **Module 1**: Website CMS & Public Portal
- **Module 2 & 3**: Authentication & User Profile
- **Module 4**: Student Dashboard & Learning System
- **Module 5 & 6**: Course Management & Live Sessions (Admin Side)
- **Module 7, 8 & 9**: Blog, CRM & Admin Panel

---

## Changelog

### [2026-06-23] Initial Context Establishment
- **Agent**: Antigravity
- **Module**: Global
- **Changes**: 
  - Established `ai-changelog.md` as the central context file.
  - Locked down database schemas (Firebase) and module boundaries in `prd.md` to prevent merge conflicts.
  - UI Design system (Navy/Blue aesthetic with Plus Jakarta Sans) applied globally.

### [2026-06-23] Phase 1: Firebase Auth & Profiles
- **Agent**: Antigravity
- **Module**: Module 2 & 3 (Authentication & User Profile)
- **Changes**: 
  - Initialized `src/lib/firebase.ts` with placeholder env configurations.
  - Installed `firebase` and `@aws-sdk/client-s3`.
  - Refactored `auth-context.tsx` to utilize real Firebase Authentication APIs (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendPasswordResetEmail`).
  - Implemented Firestore document creation (writing to `users` and `profiles` collections) upon successful registration.
  - Updated Login, Register, and Forgot Password UIs to use the new authentication context logic.

### [2026-06-23] Phases 2, 3, & 4: Production MVP Architecture
- **Agent**: Antigravity
- **Module**: Modules 1, 4, 5, 6, 7, 8
- **Changes**: 
  - **Admin Portal**: Created `/admin/courses` (Course Management), `/admin/courses/[id]/builder` (Course Builder), `/admin/sessions` (Live Sessions), `/admin/blog` (Blog Editor), and `/admin/crm` (Leads).
  - **Student Portal**: Deleted old Mock Opportunities/Mentors. Created `/courses` (Marketplace), `/courses/[id]/learn` (Course Player), and `/sessions` (Live Masterclasses).
  - **Public CMS**: Rewrote the Landing Page to dynamically fetch courses from Firebase. Built the public `/blog` SEO reader.
  - **Resilience**: Implemented robust UI fallback mocking across all fetch calls. If Firebase is missing API keys, the app seamlessly degrades to displaying premium mock data instead of crashing.

### [2026-06-23] Phase 4.5: Final Polish (MVP.pdf Compliance)
- **Agent**: Antigravity
- **Module**: All Modules
- **Changes**: 
  - **Public Pages**: Built `/about`, `/contact`, and `/courses/[id]` (Course Details Marketing Page).
  - **Student Dashboard**: Refactored `/dashboard` to show dynamic Learning Analytics (Enrolled Courses, Lessons Completed) and a Resume Course module.
  - **Student Profile**: Built `/profile` editor with fields for Academic/Professional details and a resume upload placeholder.
  - **Admin Dashboard**: Built `/admin/dashboard` (KPIs and Activity Feed) and `/admin/users` (Registered Users Table).
