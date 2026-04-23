import { ArrowRight, Clock } from "lucide-react";

type Props = {
  name?: string | null;
  timestamp: number;
  renderedImage?: string | null;
  sourceImage: string;
};

const ProjectCard = ({
  name,
  timestamp,
  renderedImage,
  sourceImage,
}: Props) => {
  return (
    <div className="project-card group">
      <div className="preview">
        <img src={renderedImage || sourceImage} alt="Project" />
        <div className="badge">
          <span>Community</span>
        </div>
      </div>
      <div className="card-body">
        <div>
          <h3>{name}</h3>
          <div className="meta">
            <Clock size={12} />
            <span>{new Date(timestamp).toLocaleDateString()}</span>
            <span>By TonyJSX</span>
          </div>
        </div>
        <div className="arrow">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
