import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import svgPaths from "../imports/svg-6g023zi4pn";
import {
  mergeWithLocalProjects,
  type PortfolioProject,
} from "../data/localProjects";

type Project = PortfolioProject;

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

          <p className="mx-auto mb-12 max-w-[620px] text-center font-['Gaegu'] text-[20px] leading-[26px] text-[#474747]">
            Selected product design case studies covering AI user experience,
            call center workflows, CRM ticketing, design systems, and practical
            interface decisions from research to handoff.
          </p>

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
