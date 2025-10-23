import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import svgPaths from '../imports/svg-6g023zi4pn';

interface ContentBlock {
  id: string;
  type: 'text' | 'image';
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
  blocks?: ContentBlock[];
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white box-border content-stretch flex gap-[64px] items-center pl-[8px] pr-[64px] py-[8px] relative rounded-[16px] shrink-0 w-[700px]">
      {/* Image Container */}
      <div className="relative shrink-0 size-[268px]">
        <div className="absolute inset-0 overflow-clip rounded-[8px]">
          <div className="absolute left-0 overflow-clip size-[268px] top-0">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <ImageWithFallback
                src={project.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'}
                alt={project.title}
                className="absolute h-full left-[-25.07%] max-w-none top-0 w-[150.15%] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="basis-0 box-border content-stretch flex flex-col gap-[24px] grow h-[252px] items-start min-h-px min-w-px pb-[42.4px] pt-[31px] px-0 relative shrink-0">
        {/* Heading */}
        <div className="box-border content-stretch flex flex-col items-start pb-[0.6px] pt-0 px-0 relative shrink-0 w-full">
          <div className="flex flex-col font-['Solway',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474747] text-[28px] w-full">
            <p className="leading-[33.6px]">{project.title}</p>
          </div>
        </div>
        {/* Description */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <div className="flex flex-col font-['Gaegu',_sans-serif] justify-center leading-[24px] not-italic relative shrink-0 text-[#8c8fa6] text-[20px] w-full">
            <p>{project.description || 'No description available.'}</p>
          </div>
        </div>
      </div>

      {/* Hand-drawn Border SVG */}
      <div className="absolute inset-[-9px_-5px_-9px_-11px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 716 302">
          <g id="svg1435461913_528">
            <path d={svgPaths.p151fe80} id="Vector" stroke="#474747" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.09506" />
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/projects`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
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
            <h2 className="text-[32px] md:text-[42px] font-['Solway'] text-[#474747] whitespace-nowrap">Projects</h2>
            <div className="h-[3px] w-[40px] md:w-[87px] bg-[#474747] rounded-full"></div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="font-['Gaegu'] text-[20px] text-[#8c8fa6]">Loading projects...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-12">
              <p className="font-['Gaegu'] text-[20px] text-[#8c8fa6]">No projects yet. Check back soon!</p>
            </div>
          )}

          {/* Projects List */}
          <div className="space-y-12 flex flex-col items-center">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => project.link ? window.open(project.link, '_blank') : setSelectedProject(project)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && !selectedProject.link && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-40 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div className="min-h-screen py-16 px-8" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="font-['Gaegu'] text-[16px] text-[#8c8fa6]">Projects / {selectedProject.title}</div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[#474747]" />
                </button>
              </div>

              <h1 className="text-[42px] font-['Solway'] text-[#474747] mb-4">{selectedProject.title}</h1>
              <p className="font-['Gaegu'] text-[20px] text-[#8c8fa6] mb-12 leading-[24px]">{selectedProject.description}</p>

              {selectedProject.image && (
                <div className="mb-12 rounded-xl overflow-hidden border-[3px] border-[#474747]">
                  <ImageWithFallback
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>
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
                  {selectedProject.blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div key={block.id}>
                        {block.type === 'text' ? (
                          <div
                            className="font-['Gaegu'] text-[18px] text-[#474747] leading-[1.65] prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        ) : (
                          block.content && (
                            <div className="rounded-lg overflow-hidden">
                              <ImageWithFallback
                                src={block.content}
                                alt="Project content"
                                className="w-full"
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
