import { Canvas as ThreeCanvas, CanvasProps } from "@react-three/fiber";
import React from "react";

const Canvas: React.FC<CanvasProps> = ({ children, ...props }) => {
  return <ThreeCanvas {...props}>{children}</ThreeCanvas>;
};

export default Canvas;
