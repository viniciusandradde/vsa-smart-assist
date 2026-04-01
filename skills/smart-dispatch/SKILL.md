---
name: smart-dispatch
description: Automatically routes React/frontend tasks to optimal Claude models (Opus/Sonnet/Haiku) based on complexity and executes them in parallel. Use when implementing features, fixing bugs, or tackling multi-step development work. This skill reads CLAUDE.md from the project to understand the codebase architecture and automatically routes work—don't use this skill if you're not doing substantial development work.
---

# Smart Model Dispatch for React/Frontend

This skill intelligently distributes development tasks across Claude models to optimize for speed, cost, and quality. It reads your project's architecture (from CLAUDE.md if available) and creates a parallel execution plan where independent tasks run concurrently.

## How It Works

The skill analyzes your task, breaks it into subtasks, assigns each to the right model, and dispatches them in parallel where possible:

```
PLAN PHASE (You analyze the task)
  ↓
DISPATCH PHASE (Independent tasks run in parallel)
  ├─ [Opus]   Architecture & planning
  ├─ [Sonnet] Implementation tasks (can run multiple in parallel)
  └─ [Haiku]  Mechanical tasks (can run multiple in parallel)
  ↓
INTEGRATE PHASE (You merge results)
```

## Model Routing Rules

### Opus — Complex reasoning & architecture (runs first)
- Architecture planning and design decisions
- Complex business logic design
- Feature requirement analysis
- Performance optimization strategies
- Refactoring large systems

**When to use Opus:** Your task requires understanding tradeoffs, designing systems, or planning multi-phase implementations.

### Sonnet — Standard implementation (runs after Opus if needed)
- Component implementation with business logic
- Hook implementation and custom logic
- API/webhook integration
- State management setup
- Feature implementation from architecture plan
- Complex bug fixes (when root cause analysis is needed)

**When to use Sonnet:** You need to build something substantial—components, business logic, integrations.

### Haiku — Fast, mechanical tasks (parallelizable)
- Generating `.styles.ts` or styled component files
- Writing i18n translation files
- Creating boilerplate code (mocks, fixtures, stubs)
- Writing unit tests and test utilities
- Formatting and linting fixes
- Updating imports and exports
- Simple bug fixes (obvious one-liners)

**When to use Haiku:** The task is repetitive, clearly-scoped, and doesn't require deep reasoning.

## Triggering & Detection

The skill triggers automatically when you mention:
- "Implement [feature]" / "Add [feature]"
- "Fix [bug]" / "Refactor [component]"
- "Build [page/component]"
- "Integrate [API/service]"
- Or explicitly: "Use smart-dispatch for..."

### Example Prompts That Trigger

✅ **"Implement a reports page showing ticket metrics"** — features need architecture
✅ **"Fix the Telegram notification not showing urgency"** — bug fix
✅ **"Add dark mode support to the dashboard"** — feature spanning UI + logic
✅ **"Create test suite for the api.ts module"** — substantial work
❌ **"Read this file"** — too simple, no dispatch needed

## Real-World Example: Implement Reports Feature

### Task
"Add a Reports page to the VSA Smart Assist dashboard showing ticket metrics over time (volume per day, urgency distribution, average resolution time)."

### Dispatch Plan

**STEP 1 [Opus]** — Architecture Planning
- Analyze existing codebase (read CLAUDE.md)
- Design data structure for metrics
- Decide: fetch from localStorage or n8n webhook?
- Plan page layout and visual hierarchy
- Output: Architecture document + implementation checklist

**STEP 2a, 2b [Sonnet × 2 in parallel]** — Implementation
- **2a:** Implement Report page component + filters
- **2b:** Implement useReportMetrics hook + data aggregation
- Both tasks run simultaneously (independent)
- Output: ReportPage.tsx, useReportMetrics.ts

**STEP 3a, 3b, 3c [Haiku × 3 in parallel]** — Mechanical Tasks
- **3a:** Generate Report.styles.ts and layout components
- **3b:** Write i18n keys for labels, tooltips, empty states
- **3c:** Create unit tests for hook + mocks
- All run simultaneously
- Output: .styles.ts, i18n/*.json, *.test.ts

### Timeline
```
Time  Action
├─ T0  You describe the feature
├─ T1  Opus creates architecture plan
├─ T2  Sonnet tasks (2a, 2b) dispatched & run in parallel
├─ T3  Haiku tasks (3a, 3b, 3c) dispatched & run in parallel
└─ T4  You integrate results into main branch
```

## How to Use This Skill

### Step 1: Describe Your Task
Give a clear description of what you want to build or fix. Examples:
- "Implement a user feedback form on the settings page"
- "Debug why the status update mutation isn't optimistically updating the dashboard"
- "Add batch operations (delete/reassign) to the ticket table"

### Step 2: I'll Create the Plan
The skill will:
- Read your CLAUDE.md to understand project structure
- Break the task into parallel-safe subtasks
- Assign each to Opus/Sonnet/Haiku
- Show you the plan before executing

Example:
```
DISPATCH PLAN: Add Batch Operations Feature

[Opus] Design batch operation system
  - Define action types (delete, reassign, change status)
  - Design state management approach
  - Estimate complexity

[Sonnet] Implement BatchOperationService
  - API calls + optimistic updates
  - Toast notifications for results

[Sonnet] Update Dashboard UI
  - Checkbox selection + bulk action dropdown
  - Loading states during operations

[Haiku] Generate styles + tests
  - BatchActions.styles.ts (selection UI styling)
  - Write mocks for batch service
  - Unit tests for batch logic
```

### Step 3: Approve & Launch
Review the plan. If it looks good, I'll:
- Dispatch Opus task first
- Once Opus finishes, launch all Sonnet tasks in parallel
- Once Sonnet finishes, launch all Haiku tasks in parallel
- Present integrated results for review

### Step 4: Integrate
You review each model's output, integrate them, test, and commit.

## Parallel Execution Rules

**Opus always runs first.** It creates the architecture that downstream tasks depend on.

**Sonnet tasks can run in parallel IF they don't depend on each other.**
- ✅ Parallel: Component implementation + Hook implementation
- ✅ Parallel: API integration + State management setup
- ❌ Sequential: Component depends on hook result (hook must finish first)

**Haiku tasks almost always run in parallel.**
- ✅ Parallel: Styles + i18n + tests (completely independent)
- Exception: If test utilities depend on mocks, run mocks first

## How I Determine Parallelism

When creating the plan, I ask:
- Do these tasks share state or dependencies?
- Can one task work without waiting for another?
- Can outputs be merged without conflicts?

If yes to questions 2-3, tasks run in parallel. Otherwise, sequential.

## Project Context

I read your `CLAUDE.md` (if it exists) to understand:
- Project structure and architecture patterns
- Build tools and testing frameworks
- Key libraries and integrations
- Known limitations and conventions

This helps me route tasks appropriately. For example, if your CLAUDE.md says "use React Query for data fetching", I'll ensure Sonnet implements accordingly.

## Output Integration

Each model produces self-contained outputs:

**Opus** → Architecture document, design decisions, checklist
**Sonnet** → Implementation code (.tsx, .ts with full logic)
**Haiku** → Styles, translations, tests, boilerplate

You review all outputs and integrate them into your codebase. The skill doesn't modify your files—it produces code for you to review and merge.

## Cost & Time Optimization

By routing work strategically:
- **Opus** (expensive) does 20% of work (planning)
- **Sonnet** (medium) does 50% of work (implementation)
- **Haiku** (cheap) does 30% of work (boilerplate & tests)

This costs ~40% less than using Opus for everything, while maintaining quality.

Parallel execution also compresses timeline:
- Sequential (all Opus): 3 hours
- Parallel (Opus → Sonnet || Haiku): ~45 minutes

## When NOT to Use This Skill

- **Simple, one-step tasks** ("Add a button with this text")
- **Quick fixes** ("Fix typo in line 42")
- **Code review** (use another skill)
- **Debugging single issues** (use systematic-debugging skill)

If your task takes <15 minutes and doesn't involve architecture decisions, just ask Claude directly.

## Tips for Best Results

1. **Be specific:** "Add dark mode" is vague. "Add dark mode toggle in navbar, sync to localStorage, apply Tailwind dark: classes" is actionable.

2. **Mention constraints:** "Needs to work on mobile" or "Must be <500KB" helps Sonnet/Haiku optimize.

3. **Link to requirements:** If you have a design doc, API spec, or user story, share the link or text.

4. **Review Opus plan first:** Before dispatching Sonnet/Haiku, review Opus's architecture. Catch issues early.

5. **Test integration:** When you merge outputs, run tests and verify behavior. Each model works independently, but integration requires your validation.

## Example: Debug the Telegram Webhook

Task: "The Telegram notification isn't showing the ticket urgency badge in the message."

Dispatch:
- **[Opus]** Analyze the webhook payload, message format, and Telegram API limits
- **[Sonnet]** Fix the notification formatting logic (add urgency emoji/bold)
- **[Haiku]** Write test for notification format, mock bot response

All can run in parallel because:
- Opus → produces analysis (informs but doesn't block)
- Sonnet → modifies `webhook.ts`
- Haiku → creates test file + mocks

Result: Urgency badge appears in Telegram messages ✅

---

**Ready to use smart-dispatch?** Describe your task clearly and I'll create the dispatch plan!
