import { ArrowRight, Layers } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import Button from "../../components/Button";
import Navbar from "../../components/Navbar";
import ProjectCard from "../../components/ProjectCard";
import Upload from "../../components/Upload";
import { createProject } from "../../lib/puter.action";

export function meta() {
  return [
    { title: "Roomify" },
    { name: "description", content: "Welcome to Roomify!" },
  ];
}

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);

  const handleUploadComplete = async (base64: string) => {
    const newId = window.crypto.randomUUID();
    const name = `Residence ${newId}`;

    const newItem = {
      id: newId,
      name,
      sourceImage: base64,
      renderedImage: undefined,
      timestamp: Date.now(),
    };

    const saved = await createProject({ item: newItem, visibility: "private" });

    if (!saved) {
      throw new Error("Failed to create project");
    }

    setProjects((prev) => [newItem, ...prev]);

    navigate(`/visualizer/${newId}`, {
      state: {
        initialImage: saved.sourceImage,
        initialRendered: saved.renderedImage || null,
        name,
      },
    });

    return true;
  };

  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Introducing Roomify 2.0</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with Roomify</h1>

        <p className="subtitle">
          Roomify is an AI-first design environment that helps you visualize,
          render and ship architectural projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />

          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>
              <h3>Uplaod your floor plan</h3>
              <p>Supports JPG, PNG formats up to 10MB</p>
            </div>

            <Upload onComplete={handleUploadComplete} />
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>
                Your latest work and shared community projects, all in one
                place.
              </p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map(
              ({ id, name, renderedImage, sourceImage, timestamp }) => (
                <ProjectCard
                  key={id}
                  name={name}
                  timestamp={timestamp}
                  renderedImage={renderedImage}
                  sourceImage={sourceImage}
                />
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
