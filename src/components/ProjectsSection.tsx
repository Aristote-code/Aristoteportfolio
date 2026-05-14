import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import svgPaths from "../imports/svg-6g023zi4pn";

interface ContentBlock {
  id: string;
  type: "text" | "image";
  content: string;
  order: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  color: string;
  order?: number;
  hidden?: boolean;
  blocks?: ContentBlock[];
}

const localProjects: Project[] = [
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

function mergeWithLocalProjects(projects: Project[]) {
  const existingIds = new Set(projects.map((project) => project.id));
  const existingTitles = new Set(
    projects.map((project) => project.title.trim().toLowerCase())
  );
  const additions = localProjects.filter(
    (project) =>
      !existingIds.has(project.id) &&
      !existingTitles.has(project.title.trim().toLowerCase())
  );

  return [...projects, ...additions].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white box-border content-stretch flex flex-col md:flex-row gap-[16px] md:gap-[64px] items-center md:items-center p-[12px] md:pl-[8px] md:pr-[64px] md:py-[8px] relative rounded-[16px] shrink-0 w-[280px] md:w-[700px]">
      {/* Image Container */}
      <div className="relative shrink-0 w-full md:w-[268px] h-[180px] md:h-[268px]">
        <div className="absolute inset-0 overflow-clip rounded-[8px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ImageWithFallback
              src={
                project.image ||
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"
              }
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="box-border content-stretch flex flex-col gap-[12px] md:gap-[16px] grow items-start md:items-start min-h-px min-w-0 pb-[12px] md:pb-[24px] pt-[4px] md:pt-[24px] px-[4px] md:px-0 relative w-full text-center md:text-left overflow-hidden">
        {/* Heading */}
        <div className="box-border content-stretch flex flex-col items-center md:items-start relative shrink-0 w-full">
          <div className="flex flex-col font-['Solway',_sans-serif] font-bold justify-center not-italic relative shrink-0 text-[#474747] text-[28px] w-full">
            <p className="leading-[33.6px] truncate">{project.title}</p>
          </div>
        </div>
        {/* Description */}
        <div className="content-stretch flex flex-col items-center md:items-start relative shrink-0 w-full overflow-hidden">
          <div className="flex flex-col font-['Gaegu',_sans-serif] justify-center leading-[24px] not-italic relative shrink-0 text-[#474747] text-[20px] w-full overflow-hidden">
            <p className="line-clamp-3 break-words">
              {project.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {/* Hand-drawn Border SVG */}
      <div className="absolute inset-[-6px] md:inset-[-9px_-5px_-9px_-11px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 716 302"
        >
          <g id="svg1435461913_528">
            <path
              d={svgPaths.p151fe80}
              id="Vector"
              stroke="#474747"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.09506"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const visibleProjects = projects.filter((project) => !project.hidden);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/projects`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.projects) {
        setProjects(mergeWithLocalProjects(data.projects));
      } else {
        setProjects(mergeWithLocalProjects([]));
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects(mergeWithLocalProjects([]));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen py-16 md:py-32 px-4 md:px-8">
        <div className="w-full max-w-[720px] mx-auto">
          {/* Title */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-12 md:mb-24">
            <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full"></div>
            <h2 className="text-[32px] md:text-[42px] font-['Solway'] text-[#474747] whitespace-nowrap">
              Projects
            </h2>
            <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full"></div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="font-['Gaegu'] text-[20px] text-[#8c8fa6]">
                Loading projects...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && visibleProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="font-['Gaegu'] text-[20px] text-[#8c8fa6]">
                No projects yet. Check back soon!
              </p>
            </div>
          )}

          {/* Projects List */}
          <div className="space-y-12 flex flex-col items-center">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50 overflow-y-auto hide-scrollbar"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="min-h-screen py-16 px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto">
              <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-['Gaegu'] text-[16px] text-[#8c8fa6]">
                  Projects / {selectedProject.title}
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-[#474747] bg-[#fff2b8] px-5 py-2.5 font-['Gaegu'] text-[19px] text-[#474747] shadow-[3px_3px_0_#474747] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#474747]"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Visit live website
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="rounded-full border-2 border-transparent p-2 transition-colors hover:border-[#e5e7f0] hover:bg-gray-100"
                    aria-label="Close project details"
                  >
                    <X className="w-6 h-6 text-[#474747]" />
                  </button>
                </div>
              </div>

              <h1 className="text-[52px] font-['Solway'] font-bold text-[#474747] mb-4 leading-[62px]">
                {selectedProject.title}
              </h1>
              <p className="font-['Gaegu'] text-[20px] text-[#474747] mb-12 leading-[24px]">
                {selectedProject.description}
              </p>

              {selectedProject.link && (
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-12 inline-flex items-center gap-2 rounded-full border-2 border-[#474747] bg-white px-5 py-3 font-['Gaegu'] text-[20px] text-[#474747] transition-colors hover:bg-[#f8f9fc]"
                >
                  <ExternalLink className="h-5 w-5" />
                  Visit live website
                </a>
              )}

              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-12">
                  {selectedProject.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-[#f8f9fc] border-2 border-[#e5e7f0] rounded-lg text-[16px] font-['Gaegu'] text-[#474747]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Project Content Blocks */}
              {selectedProject.blocks && selectedProject.blocks.length > 0 && (
                <div className="space-y-6 mb-12">
                  {[...selectedProject.blocks]
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div key={block.id}>
                        {block.type === "text" ? (
                          <div
                            className="font-['Gaegu'] text-[20px] text-[#474747] leading-[24px] prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        ) : (
                          block.content && (
                            <div className="rounded-lg overflow-hidden border-2 border-[#e5e7f0] bg-[#f8f9fc]">
                              <ImageWithFallback
                                src={block.content}
                                alt={`${selectedProject.title} project screen`}
                                className="w-full h-auto"
                              />
                            </div>
                          )
                        )}
                      </div>
                    ))}
                </div>
              )}

              <div className="mt-16 pt-8 border-t-2 border-[#474747]">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="font-['Gaegu'] text-[20px] text-[#474747] hover:underline"
                >
                  ← Back to all projects
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
