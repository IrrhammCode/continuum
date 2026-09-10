import React, { createContext, useContext, useState, useEffect } from "react";
import type { Project } from "../../shared/types";

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  selectProjectId: (id: string) => void;
  createProject: (data: {
    title: string;
    genre: string;
    logline: string;
    seasonNumber?: number;
    totalEpisodes?: number;
  }) => Promise<Project>;
  loading: boolean;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = "continuum_active_project_id";

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProjectState] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const list: Project[] = await res.json();
      setProjects(list);

      const savedId = localStorage.getItem(STORAGE_KEY);
      const matched = list.find((p) => p.id === savedId);
      if (matched) {
        setActiveProjectState(matched);
      } else if (list.length > 0) {
        setActiveProjectState(list[0]);
        localStorage.setItem(STORAGE_KEY, list[0].id);
      }
    } catch (err) {
      console.error("[ProjectContext] Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const setActiveProject = (p: Project) => {
    setActiveProjectState(p);
    localStorage.setItem(STORAGE_KEY, p.id);
  };

  const selectProjectId = (id: string) => {
    const found = projects.find((p) => p.id === id);
    if (found) {
      setActiveProject(found);
    }
  };

  const createProject = async (data: {
    title: string;
    genre: string;
    logline: string;
    seasonNumber?: number;
    totalEpisodes?: number;
  }): Promise<Project> => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create project");
    }

    const newProject: Project = await res.json();
    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProject);
    return newProject;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        selectProjectId,
        createProject,
        loading,
        refreshProjects: fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return ctx;
}
