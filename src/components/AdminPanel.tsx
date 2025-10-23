import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, GripVertical, Image as ImageIcon, Type, LogOut, MoreHorizontal, X } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { RichTextEditor } from './RichTextEditor';
import { ImageUpload } from './ImageUpload';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'gahimaaristote1@gmail.com';
const ADMIN_PASSWORD = 'Ari#toteprince1960';
const ADMIN_KEY = 'admin_key_aristote_2025';

interface ContentBlock {
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
}

// Notion-style Block Component
function NotionBlock({ 
  block, 
  onUpdate, 
  onDelete 
}: { 
  block: ContentBlock; 
  onUpdate: (content: string) => void; 
  onDelete: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [block.content]);

  if (block.type === 'image') {
    return (
      <div className="group relative">
        {/* Hover Menu */}
        <div className="absolute -left-8 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="p-1 hover:bg-gray-100 rounded cursor-move"
            title="Drag to reorder"
          >
            <GripVertical className="w-3.5 h-3.5 text-[#8c8fa6]" />
          </button>
        </div>
        
        <div className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-50 rounded text-[#8c8fa6] hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="py-1">
          <ImageUpload
            value={block.content}
            onChange={onUpdate}
            onRemove={() => onUpdate('')}
            aspectRatio="aspect-auto"
            className=""
          />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      {/* Hover Menu */}
      <div className="absolute -left-8 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          className="p-1 hover:bg-gray-100 rounded cursor-move"
          title="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5 text-[#8c8fa6]" />
        </button>
      </div>

      <div className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-red-50 rounded text-[#8c8fa6] hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <RichTextEditor
        value={block.content}
        onChange={onUpdate}
        placeholder="Type something... Select text to format"
      />
    </div>
  );
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  color: string;
  order: number;
  blocks?: ContentBlock[];
}

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isServerAvailable, setIsServerAvailable] = useState<boolean | null>(null);

  // Check for existing session and server availability
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      checkServerAndFetchProjects();
    }
  }, []);

  const checkServerAndFetchProjects = async () => {
    try {
      // Check if server is available - use anon key for authorization
      const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYWljaHBwZWhkemZoeXZuZW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDYzNDAsImV4cCI6MjA3NjMyMjM0MH0.YVROD96sRl1Hs_ng8D01vwCiod4FTx4MRnCvb1-HIAA';
      const healthCheck = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/health`,
        { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ANON_KEY}`
          }
        }
      );
      
      if (healthCheck.ok) {
        setIsServerAvailable(true);
        await fetchProjects();
      } else {
        console.error('Health check failed:', healthCheck.status, await healthCheck.text());
        setIsServerAvailable(false);
        // Load from localStorage as fallback
        const localProjects = localStorage.getItem('admin_projects');
        if (localProjects) {
          setProjects(JSON.parse(localProjects));
        }
      }
    } catch (error) {
      console.error('Server not available, using local storage:', error);
      setIsServerAvailable(false);
      // Load from localStorage as fallback
      const localProjects = localStorage.getItem('admin_projects');
      if (localProjects) {
        setProjects(JSON.parse(localProjects));
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      await checkServerAndFetchProjects();
      setEmail('');
      setPassword('');
    } else {
      setLoginError('Invalid email or password');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setProjects([]);
    setSelectedProject(null);
    window.location.hash = '';
  };

  const fetchProjects = async () => {
    try {
      const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYWljaHBwZWhkemZoeXZuZW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDYzNDAsImV4cCI6MjA3NjMyMjM0MH0.YVROD96sRl1Hs_ng8D01vwCiod4FTx4MRnCvb1-HIAA';
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/projects`,
        {
          headers: {
            'Authorization': `Bearer ${ANON_KEY}`
          }
        }
      );

      const data = await response.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleCreateProject = () => {
    const newProject: Project = {
      id: '',
      title: '',
      description: '',
      image: '',
      tags: [],
      link: '',
      color: '#fef08a',
      order: Date.now(),
      blocks: [],
    };
    setSelectedProject(newProject);
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      // If server is available, save to server
      if (isServerAvailable) {
        const url = selectedProject.id
          ? `https://${projectId}.supabase.co/functions/v1/server/admin/projects/${selectedProject.id}`
          : `https://${projectId}.supabase.co/functions/v1/server/admin/projects`;

        console.log('Saving project to server:', url);
        console.log('Using admin key:', ADMIN_KEY);
        console.log('Project data:', selectedProject);

        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYWljaHBwZWhkemZoeXZuZW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDYzNDAsImV4cCI6MjA3NjMyMjM0MH0.YVROD96sRl1Hs_ng8D01vwCiod4FTx4MRnCvb1-HIAA';
        const response = await fetch(url, {
          method: selectedProject.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ANON_KEY}`,
            'X-Admin-Key': ADMIN_KEY,
          },
          body: JSON.stringify(selectedProject),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.project) {
          const updatedProjects = selectedProject.id
            ? projects.map(p => p.id === data.project.id ? data.project : p)
            : [...projects, data.project];
          
          setProjects(updatedProjects);
          localStorage.setItem('admin_projects', JSON.stringify(updatedProjects));
          setSelectedProject(null);
          alert('✅ Project saved successfully!');
        } else {
          console.error('Save failed:', data);
          alert('❌ Failed to save to server: ' + (data.error || `HTTP ${response.status}`));
        }
      } else {
        // Fallback: save to localStorage only
        const projectToSave = selectedProject.id 
          ? selectedProject 
          : { ...selectedProject, id: `project_${Date.now()}` };
        
        const updatedProjects = selectedProject.id
          ? projects.map(p => p.id === projectToSave.id ? projectToSave : p)
          : [...projects, projectToSave];
        
        setProjects(updatedProjects);
        localStorage.setItem('admin_projects', JSON.stringify(updatedProjects));
        setSelectedProject(null);
        alert('✅ Project saved locally! (Server unavailable - deploy the Edge Function to persist data)');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      
      // Try to save locally as fallback
      try {
        const projectToSave = selectedProject.id 
          ? selectedProject 
          : { ...selectedProject, id: `project_${Date.now()}` };
        
        const updatedProjects = selectedProject.id
          ? projects.map(p => p.id === projectToSave.id ? projectToSave : p)
          : [...projects, projectToSave];
        
        setProjects(updatedProjects);
        localStorage.setItem('admin_projects', JSON.stringify(updatedProjects));
        setSelectedProject(null);
        alert('⚠️ Saved locally only. Server error: ' + (error instanceof Error ? error.message : 'Network error'));
      } catch (localError) {
        alert('❌ Failed to save: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectToDelete: Project) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYWljaHBwZWhkemZoeXZuZW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDYzNDAsImV4cCI6MjA3NjMyMjM0MH0.YVROD96sRl1Hs_ng8D01vwCiod4FTx4MRnCvb1-HIAA';
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/admin/projects/${projectToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${ANON_KEY}`,
            'X-Admin-Key': ADMIN_KEY,
          },
        }
      );

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectToDelete.id));
        if (selectedProject?.id === projectToDelete.id) {
          setSelectedProject(null);
        }
      } else {
        const data = await response.json();
        alert('Failed to delete project: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const addBlock = (type: 'text' | 'image') => {
    if (!selectedProject) return;

    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      order: (selectedProject.blocks?.length || 0),
    };

    setSelectedProject({
      ...selectedProject,
      blocks: [...(selectedProject.blocks || []), newBlock],
    });
  };

  const updateBlock = (blockId: string, content: string) => {
    if (!selectedProject) return;

    setSelectedProject({
      ...selectedProject,
      blocks: selectedProject.blocks?.map(block =>
        block.id === blockId ? { ...block, content } : block
      ),
    });
  };

  const deleteBlock = (blockId: string) => {
    if (!selectedProject) return;

    setSelectedProject({
      ...selectedProject,
      blocks: selectedProject.blocks?.filter(block => block.id !== blockId),
    });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-['Gaegu'] text-[32px] text-[#474747] mb-2">
              Admin Login
            </h1>
            <p className="font-['Gaegu'] text-[16px] text-[#8c8fa6]">
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-['Gaegu'] text-[16px] text-red-600">
                  {loginError}
                </p>
              </div>
            )}

            <div>
              <label className="block font-['Gaegu'] text-[18px] text-[#474747] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#e5e7f0] rounded-lg font-['Gaegu'] text-[16px] focus:outline-none focus:border-[#8774ff] focus:ring-2 focus:ring-[#8774ff]/20"
                required
              />
            </div>

            <div>
              <label className="block font-['Gaegu'] text-[18px] text-[#474747] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#e5e7f0] rounded-lg font-['Gaegu'] text-[16px] focus:outline-none focus:border-[#8774ff] focus:ring-2 focus:ring-[#8774ff]/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8774ff] text-white py-3 rounded-lg font-['Gaegu'] text-[18px] hover:bg-[#7161df] transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Project Editor View
  if (selectedProject) {
    return (
      <div className="min-h-screen bg-white">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#e5e7f0] px-6 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 text-[#474747] hover:text-[#8774ff] transition-colors font-['Gaegu'] text-[16px]"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <span className="text-[#d0d0d0]">•</span>
              <span className="font-['Gaegu'] text-[14px] text-[#8c8fa6]">
                {selectedProject.id ? 'Editing' : 'New Project'}
              </span>
            </div>

            <div className="flex gap-3">
              {selectedProject.id && (
                <button
                  onClick={() => handleDeleteProject(selectedProject)}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-['Gaegu'] text-[16px] flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
              <button
                onClick={handleSaveProject}
                disabled={loading}
                className="px-6 py-2 bg-[#8774ff] text-white rounded-lg hover:bg-[#7161df] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Gaegu'] text-[16px]"
              >
                {loading ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Project Metadata Section */}
          <div className="mb-12 space-y-8">
            <div>
              <h2 className="font-['Solway'] text-[20px] text-[#474747] mb-6">
                Project Details
              </h2>
              
              {/* Project Title */}
              <div className="mb-6">
                <label className="block font-['Gaegu'] text-[18px] text-[#474747] mb-3">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={selectedProject.title}
                  onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                  placeholder="Enter project name..."
                  className="w-full px-4 py-3 border border-[#e5e7f0] rounded-lg font-['Gaegu'] text-[18px] text-[#474747] placeholder:text-[#d0d0d0] focus:outline-none focus:border-[#8774ff] focus:ring-2 focus:ring-[#8774ff]/20 transition-all"
                />
              </div>

              {/* Project Description */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-['Gaegu'] text-[18px] text-[#474747]">
                    Short Description *
                  </label>
                  <span className={`font-['Gaegu'] text-[14px] ${
                    selectedProject.description.length > 180 ? 'text-red-500' : 'text-[#8c8fa6]'
                  }`}>
                    {selectedProject.description.length}/180
                  </span>
                </div>
                <textarea
                  value={selectedProject.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 180) {
                      setSelectedProject({ ...selectedProject, description: value });
                    }
                  }}
                  placeholder="Brief description of the project (max 180 characters)..."
                  rows={3}
                  maxLength={180}
                  className="w-full px-4 py-3 border border-[#e5e7f0] rounded-lg font-['Gaegu'] text-[18px] text-[#474747] placeholder:text-[#d0d0d0] focus:outline-none focus:border-[#8774ff] focus:ring-2 focus:ring-[#8774ff]/20 transition-all resize-none"
                />
                <p className="mt-2 font-['Gaegu'] text-[14px] text-[#8c8fa6]">
                  💡 Keep it concise - this appears on the project card
                </p>
              </div>

              {/* Project Cover Image */}
              <div className="mb-6">
                <ImageUpload
                  label="Cover Image *"
                  value={selectedProject.image}
                  onChange={(url) => setSelectedProject({ ...selectedProject, image: url })}
                  onRemove={() => setSelectedProject({ ...selectedProject, image: '' })}
                  aspectRatio="aspect-square"
                />
                <p className="mt-2 font-['Gaegu'] text-[14px] text-[#8c8fa6]">
                  📐 Recommended: 600x600px or 800x800px (Square/1:1 ratio) • Max 5MB
                </p>
                <p className="mt-1 font-['Gaegu'] text-[13px] text-[#8c8fa6]">
                  💡 Images will be cropped to fill the card (150x150px display)
                </p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block font-['Gaegu'] text-[18px] text-[#474747] mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedProject.tags && selectedProject.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-[#f8f9fc] border border-[#e5e7f0] rounded-full font-['Gaegu'] text-[14px] text-[#474747] flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => {
                          const newTags = selectedProject.tags.filter((_, i) => i !== index);
                          setSelectedProject({ ...selectedProject, tags: newTags });
                        }}
                        className="text-[#8c8fa6] hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a tag and press Enter..."
                  className="w-full px-4 py-2.5 border border-[#e5e7f0] rounded-lg font-['Gaegu'] text-[16px] text-[#474747] placeholder:text-[#d0d0d0] focus:outline-none focus:border-[#8774ff] focus:ring-2 focus:ring-[#8774ff]/20 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const value = input.value.trim();
                      if (value && !selectedProject.tags.includes(value)) {
                        setSelectedProject({
                          ...selectedProject,
                          tags: [...selectedProject.tags, value]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>

              {/* External Link (Optional) */}
              <div className="mb-6">
                <label className="block font-['Gaegu'] text-[18px] text-[#474747] mb-3">
                  External Link (optional)
                </label>
                <input
                  type="url"
                  value={selectedProject.link}
                  onChange={(e) => setSelectedProject({ ...selectedProject, link: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 border border-[#e5e7f0] rounded-lg font-['Gaegu'] text-[16px] text-[#474747] placeholder:text-[#d0d0d0] focus:outline-none focus:border-[#8774ff] focus:ring-2 focus:ring-[#8774ff]/20 transition-all"
                />
                <p className="mt-2 font-['Gaegu'] text-[14px] text-[#8c8fa6]">
                  If provided, clicking the project card will open this link instead of showing the project detail page.
                </p>
              </div>

              {/* Card Color */}
              <div className="mb-6">
                <label className="block font-['Gaegu'] text-[18px] text-[#474747] mb-3">
                  Card Background Color
                </label>
                <div className="flex gap-3">
                  {['#FFE4B3', '#FFD4D4', '#D4F4DD', '#D4E4FF', '#F0D4FF', '#FFE4F1'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedProject({ ...selectedProject, color })}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        selectedProject.color === color
                          ? 'border-[#8774ff] scale-110'
                          : 'border-[#e5e7f0] hover:border-[#8c8fa6]'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-[#e5e7f0] pt-8">
              <h2 className="font-['Solway'] text-[20px] text-[#474747] mb-4">
                Project Content
              </h2>
              <p className="font-['Gaegu'] text-[16px] text-[#8c8fa6] mb-6">
                Add detailed content about your project below. Use text blocks for descriptions and image blocks for visuals.
              </p>
            </div>
          </div>

          {/* Content Blocks - Notion Style */}
          <div className="space-y-1 mb-4 min-h-[200px]">
            {selectedProject.blocks && selectedProject.blocks.length > 0 ? (
              selectedProject.blocks.map((block, index) => (
                <NotionBlock
                  key={block.id}
                  block={block}
                  onUpdate={(content) => updateBlock(block.id, content)}
                  onDelete={() => deleteBlock(block.id)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="font-['Gaegu'] text-[16px] text-[#8c8fa6] mb-4">
                  Empty page. Add some content blocks below ↓
                </p>
              </div>
            )}
          </div>

          {/* Add Block Buttons - Notion Style */}
          <div className="flex gap-2 pt-2 pb-4">
            <button
              onClick={() => addBlock('text')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[#8c8fa6] hover:text-[#474747] hover:bg-gray-100 rounded transition-colors font-['Gaegu'] text-[15px]"
            >
              <Plus className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() => addBlock('image')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[#8c8fa6] hover:text-[#474747] hover:bg-gray-100 rounded transition-colors font-['Gaegu'] text-[15px]"
            >
              <Plus className="w-4 h-4" />
              Image
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Projects List View (Notion-style)
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e5e7f0] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-['Gaegu'] text-[24px] text-[#474747]">
              Projects
            </h1>
            <span className="text-[#8c8fa6] font-['Gaegu'] text-[16px]">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
            {isServerAvailable === false && (
              <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded font-['Gaegu'] text-[12px] border border-orange-200">
                Local Mode
              </span>
            )}
            {isServerAvailable === true && (
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded font-['Gaegu'] text-[12px] border border-green-200">
                Connected
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-[#8c8fa6] hover:text-[#474747] hover:bg-gray-50 rounded-lg transition-colors font-['Gaegu'] text-[16px]"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={() => window.location.hash = ''}
              className="px-4 py-2 text-[#8c8fa6] hover:text-[#474747] hover:bg-gray-50 rounded-lg transition-colors font-['Gaegu'] text-[16px]"
            >
              View Portfolio
            </button>
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 px-6 py-2 bg-[#8774ff] text-white rounded-lg hover:bg-[#7161df] transition-colors font-['Gaegu'] text-[16px]"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-[#d0d0d0] mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="font-['Gaegu'] text-[24px] text-[#8c8fa6] mb-2">
              No projects yet
            </h2>
            <p className="font-['Gaegu'] text-[16px] text-[#8c8fa6] mb-6">
              Create your first project to get started
            </p>
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8774ff] text-white rounded-lg hover:bg-[#7161df] transition-colors font-['Gaegu'] text-[16px]"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors group border border-transparent hover:border-[#e5e7f0]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Gaegu'] text-[20px] text-[#474747] truncate">
                      {project.title || 'Untitled'}
                    </h3>
                    {project.tags.length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 rounded text-[12px] font-['Gaegu'] text-[#8c8fa6]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-[#8c8fa6] font-['Gaegu'] text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit →
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
