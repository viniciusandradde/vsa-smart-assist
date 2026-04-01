# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Quick Commands

| Task | Command |
|------|---------|
| **Run tests** | `npm test` or check `tests/` folder |
| **List all skills** | `ls -la skills/` |
| **Check skill syntax** | `cat skills/[skill-name]/SKILL.md` |
| **Git status** | `git status` |
| **View recent changes** | `git log --oneline -10` |

## Repository Overview

**Superpowers** is a collection of AI development skills (workflows) that extend Claude's capabilities across the full software development lifecycle.

- **17 skills** — each a complete workflow (brainstorming, TDD, debugging, code review, etc)
- **Platform support** — Claude Code, Cursor, Codex, OpenCode, Gemini CLI
- **Auto-triggering** — skills activate based on user intent; no explicit invocation needed
- **Open-source** — MIT licensed, actively maintained

## Directory Structure

```
superpowers/
├── skills/                      # Skill implementations (one folder per skill)
│   ├── brainstorming/          # Design refinement (triggers on feature planning)
│   ├── writing-plans/          # Implementation planning (creates task breakdown)
│   ├── subagent-driven-development/  # Autonomous task execution
│   ├── test-driven-development/      # RED-GREEN-REFACTOR cycle
│   ├── systematic-debugging/   # Root cause analysis workflow
│   ├── smart-dispatch/         # Model routing (Opus/Sonnet/Haiku parallel dispatch)
│   ├── writing-skills/         # Skill creation & iteration (meta-skill)
│   └── ... (11 more)
│
├── docs/                        # Documentation
│   ├── README.codex.md         # Codex-specific setup
│   ├── README.opencode.md      # OpenCode-specific setup
│   └── testing.md              # Testing approach for skills
│
├── agents/                      # Subagent instructions
│   ├── code-reviewer.md        # For code review tasks
│   └── ... (other agent workflows)
│
├── hooks/                       # Git hooks and automations
├── commands/                    # Slash command definitions
└── tests/                       # Test files for verification
```

## Skill Anatomy

Every skill has this structure:

```
skill-name/
├── SKILL.md                    # Main skill document (required)
│   ├── YAML frontmatter        # name, description (triggers skill)
│   └── Markdown body           # Instructions & examples
│
└── [Optional nested resources]
    ├── references/             # Reference docs (read as-needed)
    ├── scripts/                # Executable utilities
    └── assets/                 # Templates, icons, config files
```

### SKILL.md Format

```markdown
---
name: skill-identifier
description: When to trigger + what it does. Include both contexts where skill activates + specific phrases the user might say. Make description "pushy" - mention trigger phrases like "whenever you see X", "make sure to use this when Y happens".
---

# Skill Title

## How It Works
[Explanation of the skill's workflow]

## Core Workflow
[Step-by-step process]

## When To Use
[Explicit triggering conditions]

## Example
[Concrete before/after or step-by-step example]
```

**Key principle:** Skill descriptions are the primary triggering mechanism. Be explicit about when to activate. Avoid under-triggering.

## Philosophy & Design Principles

### 1. Mandatory Workflows, Not Suggestions

Skills enforce disciplined processes. For example:
- **brainstorming** MUST run before implementation (no exceptions)
- **test-driven-development** enforces RED-GREEN-REFACTOR (don't skip)
- **verification-before-completion** checks that fixes are actually fixed

This prevents shipping half-finished work or making assumptions without validation.

### 2. Test-Driven Development (TDD) is Core

Every implementation task should:
1. Write failing test first (RED)
2. Watch it fail
3. Write minimal code to pass (GREEN)
4. Refactor if needed
5. Commit

Avoid:
- Writing code before tests
- Assuming tests will be added later
- Skipping tests for "simple" changes

### 3. YAGNI (You Aren't Gonna Need It)

- Don't generalize until needed (three similar lines is OK)
- Don't add configurability for hypothetical use cases
- Don't add error handling for "impossible" scenarios
- Don't over-design before validating requirements

### 4. Complexity Reduction

- Prefer simple solutions over "clever" ones
- Break large tasks into 2-5 minute chunks
- Verify intermediate outputs (don't accumulate uncertainty)
- Surface issues early (blocking > hoping it works later)

### 5. Systematic Over Ad-Hoc

- Use brainstorming for design (not freestyle coding)
- Use TDD for implementation (not trial-and-error)
- Use systematic-debugging for bugs (not random fixes)
- Follow processes, even for "obvious" tasks

## How Skills Trigger

Skills activate based on **user intent + skill description**. The skill creator (me, when developing skills) ensures descriptions include:

- **What the skill does** — specific capability
- **When to use it** — trigger phrases & contexts
- **Anti-patterns** — what NOT to use it for

Example:
```
✅ "You MUST use this before any creative work - creating
   features, building components, adding functionality, or
   modifying behavior."

❌ "For when you need to think about designs" (too vague)
```

## Modifying or Creating Skills

### To Edit an Existing Skill

1. Navigate to `skills/[skill-name]/SKILL.md`
2. Update the Markdown content
3. **Keep the frontmatter** (name + description) accurate—it's the trigger mechanism
4. Test with realistic prompts
5. Commit: `git commit -m "feat: improve [skill-name] for X scenario"`

### To Create a New Skill

Use the **writing-skills** skill (it's meta!). The skill will guide you through:
1. Defining skill intent
2. Writing the SKILL.md draft
3. Creating test cases
4. Running evaluations
5. Iterating based on feedback

Quick start:
```bash
mkdir -p skills/[new-skill-name]
# Create SKILL.md with frontmatter + content
# Commit and wait for automated testing
```

**Do NOT create skills without proper evaluation.** The writing-skills workflow ensures quality.

## Key Skills & When They Run

| Skill | Triggers | Output |
|-------|----------|--------|
| **brainstorming** | "implement X", "build Y", "add feature" | Design doc + approval |
| **writing-plans** | After design approved | Implementation plan (task list) |
| **subagent-driven-development** or **executing-plans** | With approved plan | Autonomous task completion with reviews |
| **test-driven-development** | During implementation | RED-GREEN-REFACTOR cycles |
| **systematic-debugging** | "fix this bug", "debug X", unusual behavior | Root cause analysis + fix |
| **requesting-code-review** | Task completion | Pre-review checklist |
| **smart-dispatch** | "implement feature", multi-step work | Parallel Opus/Sonnet/Haiku routing |
| **writing-skills** | "create skill", "improve skill" | Tested, evaluated skill with documentation |

## Conventions & Patterns

### Naming
- **Skill folders:** `kebab-case` (e.g., `test-driven-development`)
- **SKILL.md:** Always exactly this name
- **Git branches:** `feature/skill-name` or `fix/issue-name`

### Commits
Keep commits focused and describe the why:
```bash
git commit -m "feat: add smart-dispatch skill for React model routing

This skill routes React/frontend tasks to optimal Claude models
(Opus for architecture, Sonnet for implementation, Haiku for
boilerplate). Supports parallel execution of independent tasks."
```

Avoid:
- "update stuff", "fix things", "working on feature"
- Committing untested changes
- Large commits mixing unrelated changes

### Documentation
- Keep SKILL.md under 500 lines (reference external docs if needed)
- Use examples (before/after, step-by-step)
- Explain **why**, not just **what**
- Link to related skills

### Code & Scripts
- Skills bundled scripts are deterministic utilities (no side effects)
- Use Python for complex logic (most hooks/scripts use Python)
- Include minimal error handling (let errors surface during testing)

## Testing Philosophy

Skills are tested via:
1. **Qualitative review** — Does the output match intent?
2. **Quantitative evaluation** — metrics like pass rate, latency, token usage
3. **Human review** — Do you approve the outputs?
4. **Iteration** — Improve based on feedback

Test prompts should be:
- Realistic (something a real user would say)
- Specific (include context, details, constraints)
- Covering edge cases (not just happy path)

See `docs/testing.md` for detailed testing methodology.

## Frequently Asked Questions

### Q: Why are tests mandatory for skills?
**A:** Because skills trigger automatically and run unsupervised for hours. A bad skill can waste enormous amounts of compute + human time. Testing catches issues early.

### Q: What if a skill triggers when it shouldn't?
**A:** Update the `description` in the frontmatter to be more specific about trigger conditions. Avoid under-triggering (lose benefit) and over-triggering (waste compute).

### Q: Can I modify a skill for my specific project?
**A:** Yes, fork this repo and customize skills in your version. Or use the skill-creator workflow to add custom skills tailored to your project.

### Q: How do I debug a skill that's not triggering?
**A:** The description is the trigger. Check:
1. Does your prompt match the description's language?
2. Is the skill actually activated (check plugin settings)?
3. Is another skill triggering instead? (skills compete for relevance)

### Q: Can I add a new skill to this repo?
**A:** Absolutely! Fork, create the skill using writing-skills, test thoroughly, and submit a PR. Must include test cases + evaluation.

## Important Files to Know

| File | Purpose |
|------|---------|
| `README.md` | Public overview + installation |
| `RELEASE-NOTES.md` | Version history + changelog |
| `skills/[name]/SKILL.md` | Skill implementation |
| `docs/testing.md` | Testing methodology for skills |
| `.github/` | GitHub Actions, issue templates |
| `GEMINI.md` | Gemini CLI-specific setup |

## Development Workflow Example

**Task:** Improve `smart-dispatch` for better parallel execution

1. **Explore** — Read current SKILL.md, check git history
2. **Design** — What needs to improve? (use brainstorming)
3. **Plan** — Create step-by-step plan (use writing-plans)
4. **Implement** — Edit SKILL.md with new content
5. **Test** — Create test prompts, evaluate outputs (use writing-skills workflow if major change)
6. **Review** — Self-review against principles
7. **Commit** — `git commit -m "feat: improve smart-dispatch parallel execution logic"`
8. **Integrate** — Push to branch, create PR if needed

## Key Principles to Remember

1. **Skills are workflows, not tools** — They guide process, not just generate code
2. **Triggering > Optional** — Skills should trigger automatically based on clear intent signals
3. **Test-driven always** — Write tests before code, even for "simple" changes
4. **Design before implementation** — Brainstorm first, code second
5. **Complexity reduction** — Simple beats clever
6. **Process discipline** — Follow the workflow, even if it feels slow

---

**When in doubt,** ask "Would this pass the writing-skills evaluation?" If not, refine it. This repo maintains high quality through disciplined testing and iteration.
