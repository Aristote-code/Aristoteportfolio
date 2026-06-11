export interface ContentBlock {
  id: string;
  type: "text" | "image";
  content: string;
  order: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  color: string;
  order: number;
  hidden?: boolean;
  blocks?: ContentBlock[];
}

export const localProjects: PortfolioProject[] = [
  {
    id: "local_vast",
    title: "VAST",
    description:
      "Designed an AI-assisted call center ticketing workflow that turns customer calls into clear summaries, linked tickets, assignments, and follow-up actions.",
    image: "/projects/vast/card-cover.png",
    tags: ["AI UX", "Call Center", "Ticketing", "CRM", "Product Design"],
    link: "",
    color: "#3b5bfd",
    order: 1778745600000,
    blocks: [
      {
        id: "vast-role",
        type: "text",
        order: 0,
        content:
          "<p><strong>Role:</strong> Product Designer</p>\n<p><strong>Project Type:</strong> AI call center support, ticketing, and CRM workflow</p>",
      },
      {
        id: "vast-overview",
        type: "text",
        order: 1,
        content:
          "<h3><strong><span style=\"font-size: 32px;\">Overview</span></strong></h3>\n<p>VAST is an AI-assisted support platform designed for call center teams. The product helps agents move from a live customer conversation to a structured ticket by capturing the call transcript, generating a concise summary, surfacing action items, and keeping every follow-up detail in one place.</p>\n<p>The experience is built around a simple goal: make sure important call context does not disappear after the conversation ends. Agents can review the transcript, compare it with the AI summary, connect related tickets, assign owners, and track the next step without jumping between tools.</p>",
      },
      {
        id: "vast-image-ticket-view",
        type: "image",
        order: 2,
        content: "/projects/vast/tickets-view.png",
      },
      {
        id: "vast-challenge",
        type: "text",
        order: 3,
        content:
          "<h3><strong><span style=\"font-size: 32px;\">The Challenge</span></strong></h3>\n<p>Call center work moves quickly. Agents need to listen, respond, document, categorize, and route issues at the same time. Without a clear system, support teams can lose important details, duplicate existing issues, or delay follow-up because the ticket record does not fully capture the call.</p>\n<p>VAST needed to support three critical needs:</p>\n<ul>\n<li>Turn call conversations into reliable ticket records.</li>\n<li>Help agents identify related tickets before creating duplicate work.</li>\n<li>Make assignments, categories, SLA status, priority, and comments easy to review after the call.</li>\n</ul>",
      },
      {
        id: "vast-workflow",
        type: "text",
        order: 4,
        content:
          "<h3><strong><span style=\"font-size: 32px;\">Design Approach</span></strong></h3>\n<p>I structured the workflow around the agent's natural sequence: open a ticket, review the call, confirm the AI summary, enrich the ticket metadata, then hand it off for follow-up.</p>\n<h3><strong>1. Ticket List &amp; Detail View</strong></h3>\n<p>The ticket table gives agents a fast way to scan incoming issues by ID, caller, phone number, subject, category, priority, status, and assignee. Selecting a row opens a full detail panel so the agent can inspect the issue without losing context from the queue.</p>\n<h3><strong>2. Call Transcript + Summary</strong></h3>\n<p>The detailed ticket view separates the original transcript from the AI-generated summary. This keeps the AI output accountable: agents can compare the summary against the source conversation before saving or escalating the ticket.</p>\n<h3><strong>3. Related Ticket Detection</strong></h3>\n<p>When the system finds a similar issue, it alerts the agent before the ticket is finalized. This helps teams combine duplicate reports, continue work in an existing ticket, or link incidents that point to the same underlying service problem.</p>",
      },
      {
        id: "vast-image-create",
        type: "image",
        order: 5,
        content: "/projects/vast/ticket-creation.png",
      },
      {
        id: "vast-ai",
        type: "text",
        order: 6,
        content:
          "<h3><strong><span style=\"font-size: 32px;\">AI-Assisted Documentation</span></strong></h3>\n<p>The AI layer is designed as a documentation partner, not a replacement for the agent. It turns the call into a readable overview, extracts action items, and keeps the original transcript available for verification.</p>\n<p>This matters because call center tickets often become the source of truth for the next person who handles the case. The summary needed to be short enough to scan, but specific enough to preserve the customer's problem, attempted fixes, urgency, and next steps.</p>",
      },
      {
        id: "vast-image-transcription",
        type: "image",
        order: 7,
        content: "/projects/vast/transcription.png",
      },
      {
        id: "vast-image-summary",
        type: "image",
        order: 8,
        content: "/projects/vast/summary.png",
      },
      {
        id: "vast-image-empty-summary",
        type: "image",
        order: 9,
        content: "/projects/vast/empty-summary.png",
      },
      {
        id: "vast-ticket-linking",
        type: "text",
        order: 10,
        content:
          "<h3><strong><span style=\"font-size: 32px;\">Ticket Linking &amp; Follow-Up</span></strong></h3>\n<p>VAST treats each call as part of a broader support history. Related tickets are shown directly in the workflow, while the details panel keeps client information, assignment, department, category, SLA deadline, priority, and status visible for handoff.</p>\n<p>This makes it easier for a supervisor or support teammate to understand what happened, who owns the next action, and whether the issue should be merged, escalated, or continued independently.</p>",
      },
      {
        id: "vast-image-related",
        type: "image",
        order: 11,
        content: "/projects/vast/related-ticket-found.png",
      },
      {
        id: "vast-image-list-actions",
        type: "image",
        order: 12,
        content: "/projects/vast/tickets-list-actions.png",
      },
      {
        id: "vast-image-list-actions-related",
        type: "image",
        order: 13,
        content: "/projects/vast/tickets-list-actions-related.png",
      },
      {
        id: "vast-collaboration",
        type: "text",
        order: 14,
        content:
          "<h3><strong><span style=\"font-size: 32px;\">Comments &amp; Collaboration</span></strong></h3>\n<p>The comments area supports the human side of ticket follow-up. Team members can add context, record decisions, or leave updates for the next person handling the customer issue.</p>\n<p>Empty states were also designed so the interface stays understandable before data exists, especially when a ticket has not yet received a summary or comment thread.</p>",
      },
      {
        id: "vast-image-comments",
        type: "image",
        order: 15,
        content: "/projects/vast/comments.png",
      },
      {
        id: "vast-image-empty-comments",
        type: "image",
        order: 16,
        content: "/projects/vast/empty-comments.png",
      },
      {
        id: "vast-image-ticket-creation-list",
        type: "image",
        order: 17,
        content: "/projects/vast/ticket-creation-tickets-view.png",
      },
      {
        id: "vast-outcome",
        type: "text",
        order: 18,
        content:
          "<h3><strong><span style=\"font-size: 32px;\">Outcome</span></strong></h3>\n<p>The final experience documents calls in a way that is easier to trust and easier to act on. Agents get a clearer path from conversation to ticket, supervisors can see ownership and urgency faster, and support teams have a better foundation for merging duplicate reports or continuing follow-up work.</p>\n<p>For the portfolio, the project demonstrates how AI can improve operational workflows when it stays grounded in the user's real task: reducing manual note-taking, preserving context, and helping teams respond with more confidence.</p>",
      },
    ],
  },
];

export function mergeWithLocalProjects<T extends PortfolioProject>(
  projects: T[]
): Array<T | PortfolioProject> {
  const projectsWithLocalOverrides = projects.map((project) => {
    const localProject = localProjects.find(
      (candidate) =>
        candidate.title.trim().toLowerCase() ===
        project.title.trim().toLowerCase()
    );

    if (!localProject) {
      return project;
    }

    return {
      ...localProject,
      ...project,
      image: localProject.image,
      tags: project.tags?.length ? project.tags : localProject.tags,
      blocks: project.blocks?.length ? project.blocks : localProject.blocks,
    };
  });

  const existingIds = new Set(projectsWithLocalOverrides.map((project) => project.id));
  const existingTitles = new Set(
    projectsWithLocalOverrides.map((project) => project.title.trim().toLowerCase())
  );
  const additions = localProjects.filter(
    (project) =>
      !existingIds.has(project.id) &&
      !existingTitles.has(project.title.trim().toLowerCase())
  );

  return [...projectsWithLocalOverrides, ...additions].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}
