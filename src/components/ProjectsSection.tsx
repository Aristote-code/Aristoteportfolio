import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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
      <style>{`
        .project-content-block h1 {
          font-size: 36px;
          font-weight: 700;
          margin: 24px 0 16px 0;
          line-height: 1.2;
          font-family: 'Solway', serif;
          color: #474747;
        }
        
        .project-content-block h2 {
          font-size: 28px;
          font-weight: 600;
          margin: 20px 0 12px 0;
          line-height: 1.3;
          font-family: 'Solway', serif;
          color: #474747;
        }
        
        .project-content-block h3 {
          font-size: 22px;
          font-weight: 600;
          margin: 16px 0 8px 0;
          line-height: 1.3;
          font-family: 'Solway', serif;
          color: #474747;
        }
        
        .project-content-block p {
          margin: 10px 0;
          line-height: 1.8;
        }
        
        .project-content-block ul,
        .project-content-block ol {
          margin: 12px 0;
          padding-left: 24px;
        }
        
        .project-content-block li {
          margin: 6px 0;
        }
        
        .project-content-block blockquote {
          border-left: 3px solid #e5e7f0;
          padding-left: 16px;
          margin: 16px 0;
          color: #8c8fa6;
          font-style: italic;
        }
        
        .project-content-block a {
          color: #8774ff;
          text-decoration: underline;
        }
      `}</style>
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

          {/* Projects List - Horizontal Card Layout */}
          <div className="space-y-10 md:space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => project.link ? window.open(project.link, '_blank') : setSelectedProject(project)}
                className="group bg-white border-[3px] border-[#474747] rounded-2xl p-6 md:p-8 cursor-pointer hover:shadow-xl transition-all duration-300 min-h-[320px] md:min-h-[300px]"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 h-full">
                  {/* Project Image */}
                  <div className="relative w-full md:w-[320px] lg:w-[380px] h-[240px] md:h-[260px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {project.image ? (
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-[#8c8fa6] font-['Gaegu'] text-[16px]">No image</span>
                      </div>
                    )}
                    {/* Tag Badge */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-md">
                        <span className="text-[13px] md:text-[14px] font-['Gaegu'] text-[#474747] uppercase tracking-[0.1em] font-semibold">
                          {project.tags[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 flex flex-col justify-center min-h-0">
                    <h3 className="text-[32px] md:text-[36px] lg:text-[42px] font-['Solway'] text-[#474747] mb-4 leading-[1.1] line-clamp-2">
                      {project.title || 'Untitled Project'}
                    </h3>
                    
                    <p className="font-['Gaegu'] text-[17px] md:text-[19px] lg:text-[20px] text-[#8c8fa6] leading-[1.6] line-clamp-4">
                      {project.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Page */}
      {selectedProject && !selectedProject.link && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-40 overflow-y-auto"
          style={{
            backgroundImage: 'radial-gradient(circle, #d0d0d0 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        >
          <div className="min-h-screen py-8 md:py-16 px-4 md:px-8">
            <div className="max-w-3xl mx-auto bg-white">
              {/* Header with Breadcrumb */}
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center gap-2 text-[14px] md:text-[16px] font-['Gaegu'] text-[#8c8fa6] hover:text-[#474747] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back / Projects</span>
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-[#474747]" />
                </button>
              </div>

              {/* Hero Section */}
              <div className="mb-12 md:mb-16">
                <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-['Solway'] text-[#474747] mb-4 md:mb-6 leading-tight">
                  {selectedProject.title}
                </h1>
                <p className="font-['Gaegu'] text-[16px] md:text-[18px] lg:text-[20px] text-[#8c8fa6] leading-relaxed max-w-2xl">
                  {selectedProject.description}
                </p>
              </div>

              {/* Hero Image with Tags */}
              {selectedProject.image && (
                <div className="mb-12 md:mb-16">
                  <div className="relative rounded-2xl overflow-hidden border-[3px] border-[#474747] shadow-lg">
                    <ImageWithFallback
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  
                  {/* Tags Below Image */}
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {selectedProject.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 md:px-4 py-1.5 md:py-2 bg-white border-2 border-[#474747] rounded-full text-[13px] md:text-[14px] font-['Gaegu'] text-[#474747] uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Project Content Blocks */}
              {selectedProject.blocks && selectedProject.blocks.length > 0 && (
                <div className="space-y-16 md:space-y-20 mb-16">
                  {selectedProject.blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block, idx) => (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        {block.type === 'text' ? (
                          <div className="prose prose-lg max-w-none project-content-block">
                            <div
                              className="font-['Gaegu'] text-[16px] md:text-[18px] text-[#474747] leading-relaxed"
                              style={{
                                lineHeight: '1.8'
                              }}
                              dangerouslySetInnerHTML={{ __html: block.content }}
                            />
                          </div>
                        ) : (
                          block.content && (
                            <div className="rounded-xl overflow-hidden border-[3px] border-[#474747] shadow-md">
                              <ImageWithFallback
                                src={block.content}
                                alt="Project content"
                                className="w-full"
                              />
                            </div>
                          )
                        )}
                      </motion.div>
                    ))}
                </div>
              )}

              {/* Footer Navigation */}
              <div className="mt-16 md:mt-20 pt-8 border-t-2 border-[#474747]">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center gap-2 font-['Gaegu'] text-[18px] md:text-[20px] text-[#474747] hover:text-[#8774ff] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to all projects
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
