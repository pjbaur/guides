# Instructional Design Guidance

Companion to `create-guide-prompt.md`. That prompt governs workflow, format, and visual style; this document governs pedagogy — how a guide teaches. Apply these principles when planning and writing the instructional content. Where the two conflict on implementation details (quiz format, HTML structure), the prompt wins.

The overriding objective: produce actual instructional material, not a learning plan or a list of resources. The document must teach the topic progressively from first principles, beginning at the minimum prerequisite floor and advancing through practical application, troubleshooting, tradeoffs, and advanced concepts. The reader should be able to use it as both a structured course of study and a long-term reference.

## 1. Define the end state

Begin by stating what the learner should be able to:

- Understand
- Explain
- Recognize
- Perform
- Build or create
- Analyze
- Debug or troubleshoot
- Evaluate or compare

Make these outcomes concrete and observable.

## 2. Define the prerequisite floor

Identify the minimum knowledge and skills needed to begin. Separate prerequisites into:

- **Hard prerequisites:** required before proceeding
- **Soft prerequisites:** helpful but not mandatory
- **Just-in-time prerequisites:** small supporting concepts introduced where needed

Include a brief self-assessment so the learner can identify gaps. For each hard prerequisite, provide either a compact refresher, a diagnostic exercise, or a recommendation for where it should be learned before continuing. Do not assume unstated background knowledge.

## 3. Teach from first principles

Decompose the topic into:

- Fundamental objects or entities
- Basic definitions
- Operations or actions
- Rules, constraints, and invariants
- Relationships between components
- Mechanisms and causal processes
- Larger systems and workflows
- Tradeoffs and design choices
- Failure modes and edge cases

Explain not only what something is, but:

- Why it exists
- What problem it solves
- How it works
- What assumptions it depends on
- Where the simplified model stops being accurate

## 4. Use progressive layering

Organize the material into progressive layers:

- Orientation and big-picture overview
- Prerequisite foundation
- Fundamental vocabulary and primitives
- Core mechanisms
- Combined systems and workflows
- Guided practical application
- Independent application
- Diagnosis and troubleshooting
- Tradeoffs, alternatives, and edge cases
- Advanced branches and continued study

Each section must depend only on concepts already introduced.

Use a spiral approach: revisit important concepts at increasing levels of depth rather than explaining everything at once. When revisiting a concept, explicitly distinguish the initial simplified model, the more complete model, and why the additional detail now matters.

## 5. Combine multiple teaching techniques

Use an appropriate combination of:

- First-principles explanation
- Top-down overview
- Bottom-up construction
- Worked examples
- Analogies
- Compare-and-contrast explanations
- Concept dependency mapping
- Guided discovery
- Problem-first instruction
- Project-based learning
- Retrieval practice
- Spaced review
- Cumulative exercises

Analogies must be labeled as analogies and followed by an explanation of where they break down.

## 6. Separate concepts, skills, and tasks

For every major module, clearly distinguish:

- **Concepts:** what the learner must understand
- **Skills:** what the learner must be able to do
- **Tasks:** concrete activities used to develop or demonstrate the skill

Do not substitute reading or watching for actual practice.

## 7. Structure every module consistently

Each major module should contain, where applicable:

- Module title and learning objectives
- Why the module matters
- Prerequisites and key vocabulary
- First-principles explanation and mental model
- Detailed instructional content
- Worked examples
- Diagrams or structured visual explanations
- Guided practice, then independent practice
- Reflection or explanation prompts
- Checkpoint questions with answers or answer guidance
- Common misconceptions and failure modes
- Troubleshooting guidance
- Practical deliverable or mini-project
- Mastery criteria
- What the module unlocks next

## 8. Progress tasks by cognitive difficulty

Exercises should advance through these stages:

1. Recognition
2. Recall
3. Explanation
4. Comparison
5. Guided execution
6. Modification of an existing example
7. Construction from scratch
8. Diagnosis and debugging
9. Application in a new context
10. Evaluation of alternatives

Do not jump directly from definitions to advanced projects.

## 9. Include assessments and feedback

Include:

- Initial diagnostic assessment
- Short knowledge checks throughout
- Module-end mastery checks
- Cumulative review questions
- Practical assessments
- A final capstone
- A final self-assessment rubric

For questions with objective answers, provide an answer key (hidden until revealed). For open-ended tasks, provide evaluation criteria, example characteristics of a strong answer, and common weak approaches.

## 10. Include practical projects

Include several projects of increasing difficulty:

- Small guided exercise
- Module-level mini-project
- Intermediate integrative project
- Final capstone project

For every project, include: purpose, requirements, constraints, suggested steps, expected deliverables, evaluation rubric, optional stretch goals, common problems, and troubleshooting hints. Where multiple project choices are appropriate, offer two or three alternatives suited to different interests.

## 11. Include study and review guidance

Provide a realistic study workflow based on the learner's available time:

- Recommended study-session structure
- Reading and practice balance
- Review cadence and retrieval-practice schedule
- Cumulative review points
- Suggested milestones and a progress checklist
- Criteria for moving forward or repeating a section

Use estimated effort ranges rather than pretending every learner progresses at the same speed.

## 12. Include a dependency-aware roadmap

Provide both a concept map showing prerequisite relationships and a suggested execution sequence organized by phase or week. Explain why the sequence is ordered as shown.

## 13. Handle terminology carefully

- Define each important term when it first appears.
- Include a glossary near the end, and link important terms to their glossary entries.
- Avoid introducing unexplained jargon.
- Distinguish closely related terms with comparison tables.
- Highlight terminology that is commonly confused.

## 14. Address misconceptions and failure modes

Throughout the document, identify:

- Beginner misconceptions
- Oversimplified explanations
- Common procedural mistakes
- Incorrect intuitions
- Signs that understanding is incomplete
- Frequent real-world failures
- Debugging or recovery strategies

Explain why each misconception is tempting and how to replace it with a better mental model.

## 15. Include advanced branches

After the core path, identify possible specialization branches. For each branch, include:

- What it focuses on
- Who it is suited for
- Additional prerequisites
- Suggested next concepts
- Example projects
- How it relates to the core material

## Resources are secondary

The guide itself must teach the subject; resources supplement it. Where useful, recommend a limited number of high-quality resources — primary documentation, books, courses, interactive tools, practice environments, reference sheets. For each, explain what it is best used for, when in the learning sequence to use it, and whether it is free or paid when known. Do not fabricate titles, authors, URLs, products, features, or availability; omit or mark as unverified anything that cannot be confirmed.

## Content quality rules

- Be specific and instructional. Do not produce an outline disguised as a guide.
- No placeholders ("explain this concept here") and no generic instructions ("study the basics").
- Write the explanations, examples, exercises, and assessments in full.
- Explain causal relationships rather than listing facts. Prefer concrete examples.
- Make assumptions explicit. Distinguish required material from optional enrichment.
- Keep the central learning path focused on the stated goal; remove material that does not meaningfully support the outcome.
- When the topic is too large for the stated depth, define a realistic core scope and identify excluded material.
- When there are multiple valid approaches, compare them briefly and recommend a default path.
- Ensure exercises test the stated learning objectives.
- Ensure every advanced concept has its prerequisites introduced earlier.
- Ensure the final capstone demonstrates the stated end-state capabilities.

## Final pedagogy audit

Before delivering, audit the guide for:

- Hidden prerequisites
- Undefined terminology
- Concepts presented out of dependency order
- Abrupt jumps in difficulty
- Passive activities without corresponding practice
- Exercises without sufficient instruction
- Assessments unrelated to the objectives
- Duplicate or unnecessary sections
- Overly broad scope

Correct these issues before returning the document.
