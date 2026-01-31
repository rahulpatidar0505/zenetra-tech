# Add Advanced Automation Practice Modules

## Overview

**Role:** Senior QA Automation Architect and Frontend Engineer  
**Objective:** Build a Playwright-focused practice application with real-world automation scenarios

**Goal:** Create intentionally tricky automation challenges that help students transition from beginner to production-ready Playwright engineers.

---

## Core Requirements

Enhance the existing practice app by adding new modules. Each module must:

- ✅ Be UI-driven
- ✅ Include intentional flakiness/complexity
- ✅ Be automation-testable
- ✅ Have clear user flows
- ✅ Mirror real enterprise applications
- ✅ Be accessible as a separate card on the Practice App dashboard

**Note:** These modules should be positioned near the Auto Waiting module.

---

## Module 1: Dynamic UI / Flaky Scenarios

### Purpose
Train users to handle unstable, async, and dynamic UI behavior using Playwright best practices.

### Features to Implement

**Dynamic Elements:**
- Appear after random delays (1–8 seconds)
- Load only after API response
- Loader overlays blocking interactions

**Interactive Buttons:**
- Initially disabled
- Enabled after conditions are met

**Unstable Identifiers:**
- Dynamic IDs
- Changing class names

**DOM Behavior:**
- Re-render on refresh
- Dynamic structure changes

### Automation Skills Covered
- Auto-waiting
- `waitFor`, `expect.toBeVisible`
- Stable locators (`role`, `text`, `data-testid`)
- Retry-safe assertions

---

## Module 2: Role-Based Access & Authorization

### Purpose
Simulate enterprise-grade authorization beyond simple login.

### User Roles
- **Admin:** Full access and CRUD operations
- **User:** Standard access
- **Guest:** Limited access

### Features

**Authentication & Authorization:**
- Login with different roles
- UI elements visible only for specific roles
- Restricted routes/pages
- Admin-only actions (CRUD)
- Unauthorized access redirects

**API + UI Integration:**
- API responses differ by role
- UI reflects backend permissions
- Simulate error codes:
  - `401 Unauthorized`
  - `403 Forbidden`

### Automation Skills Covered
- Auth state reuse
- API + UI validation
- Session & token handling

---

## Module 3: Localization / i18n Testing

### Purpose
Prepare testers for global applications.

### Features

**Language Switcher:**
- English (EN)
- French (FR)
- German (DE)

**Dynamic Content:**
- Text updates without page reload
- Locale-based date formats
- Locale-based currency symbols

**Optional:**
- RTL layout (Arabic or Hebrew)

### Automation Skills Covered
- Text assertions across locales
- Date & currency validation
- Layout validation for RTL
- Data-driven tests

---

## Module 4: Accessibility (a11y) Testing

### Purpose
Teach modern accessibility-first automation.

### Features
- Proper ARIA roles and labels
- Keyboard-only navigation
- Focus management (tab order)
- Screen-reader friendly elements
- Intentional accessibility violations (for learning)

### Automation Skills Covered
- `getByRole` locators
- Keyboard events
- Focus assertions
- Accessibility best practices

---

## Module 5: Visual Regression Testing

### Purpose
Introduce UI stability and layout validation.

### Features

**Responsive Design:**
- Multiple breakpoints
- Dynamic layout changes

**Theme Support (Optional):**
- Light/dark mode toggle

**Regression Detection:**
- Controlled UI changes to detect regressions

### Automation Skills Covered
- Screenshot comparison
- Viewport testing
- Cross-device layout validation

---

## Module 6: Error Handling & Negative Scenarios

### Purpose
Train testers to validate failure paths, not just happy flows.

### Features

**API Error Simulations:**
- `401 Unauthorized`
- `403 Forbidden`
- `500 Internal Server Error`
- Network failure/timeout simulation

**Form Validation:**
- Invalid form submissions
- Inline & global error messages
- Retry actions after failure

### Automation Skills Covered
- Network mocking
- Error assertions
- Negative testing strategies
- Resilient test design

---

## Implementation Guidelines

Each module should include:

1. **Clear UI sections** with logical organization
2. **Predictable but intentionally tricky behavior** to challenge testers
3. **Real product patterns** — avoid artificial demos
4. **Playwright automation learning** as the core design goal

**Design Philosophy:** Build challenges that reflect actual production scenarios and common automation pain points.