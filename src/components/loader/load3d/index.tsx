import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

interface MyModelProps {
  modelPath: string;
}

const MyModel: React.FC<MyModelProps> = ({ modelPath }) => {
  const gltf = useGLTF(modelPath);
  const groupRef = useRef<any>();
  const [focusedObject, setFocusedObject] = useState<number | null>(null);

  // Sử dụng useFrame để theo dõi sự kiện mỗi frame
  useFrame(() => {
    // Thực hiện các xử lý logic tương tác với từng object bên trong gltf.scene
    // ở đây bạn có thể kiểm tra vị trí chuột và sự kiện hover
  });

  const handlePointerDown = (index: number, child: any) => {
    // Xử lý khi chuột được click vào object
    console.log("3d:", child);
    setFocusedObject(index);
  };

  return (
    <group ref={groupRef}>
      {/* Render các object từ gltf.scene */}
      {gltf.scene && <primitive object={gltf.scene} />}

      {/* Border cho mỗi object */}
      {gltf.scene &&
        gltf.scene.children.map((child, index) => (
          <mesh
            key={index}
            // geometry={child}
            position={child.position}
            onPointerDown={() => handlePointerDown(index, child)} // Xử lý khi chuột được click vào object
            onClick={() => handlePointerDown(index, child)}
          >
            <meshBasicMaterial
              color={focusedObject === index ? "red" : "transparent"}
              wireframe={true}
            />
          </mesh>
        ))}
    </group>
  );
};

export default MyModel;
