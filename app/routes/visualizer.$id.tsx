import { useParams } from "react-router";

const VisualizerId = () => {
  const { id } = useParams<{ id: string }>();

  return <div>Visualizer: {id}</div>;
};

export default VisualizerId;
