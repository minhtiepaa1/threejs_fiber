// MyModel.tsx
import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector2, Raycaster, Vector3 } from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Html, useGLTF } from "@react-three/drei";

interface MyModelProps {
  modelPath: string;
}

const MyModel: React.FC<MyModelProps> = ({ modelPath }) => {
  const { camera } = useThree();
  const gltf = useGLTF(modelPath);
  const groupRef = useRef<any>();
  const [clickCount, setClickCount] = useState<number>(0);
  const [focusedObject, setFocusedObject] = useState<number | null>(null);
  const [objectPosition, setObjectPosition] = useState<Vector3 | null>(null);
  const raycaster = new Raycaster();

  const handlePointerDown = (event: any) => {
    const mouse = new Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
      getAllMeshes(groupRef.current),
      true
    );

    if (intersects.length > 0) {
      const index = getAllMeshes(groupRef.current).indexOf(
        intersects[0].object
      );
      setClickCount((prevClickCount) => prevClickCount + 1);

      // Nếu click 2 lần, thực hiện focus
      if (clickCount % 2 === 0) {
        // Lấy vị trí của đối tượng được click
        const targetPosition = intersects[0].object.position.clone();

        // Tweening để di chuyển camera đến đối tượng
        new TWEEN.Tween(camera.position)
          .to(
            {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z + 5,
            },
            500
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

        setObjectPosition(targetPosition);
        setFocusedObject(index);
      } else {
        // Khi click lần thứ 2 vào cùng một đối tượng, trở về vị trí camera gốc
        new TWEEN.Tween(camera.position)
          .to({ x: 0, y: 0, z: 10 }, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

        setObjectPosition(null);
        setFocusedObject(null);
      }
    }

    // Đặt lại số lần click
    setClickCount(1);
  };

  const handleResetCamera = () => {
    // Trở về vị trí camera gốc
    new TWEEN.Tween(camera.position)
      .to({ x: 0, y: 0, z: 10 }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

    setObjectPosition(null);
    setFocusedObject(null);
  };

  // Đệ quy để lấy tất cả các đối tượng mesh
  const getAllMeshes = (object: any): any[] => {
    let meshes: any[] = [];

    object.traverse((child: any) => {
      if (child.isMesh) {
        meshes.push(child);
      }
    });

    return meshes;
  };

  // Sử dụng useFrame để theo dõi sự kiện mỗi frame
  useFrame(() => {
    TWEEN.update();
  });

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      {/* Render các object từ gltf.scene */}
      {gltf.scene && <primitive object={gltf.scene} />}

      {/* Border cho mỗi object */}
      {gltf.scene &&
        getAllMeshes(gltf.scene).map((mesh, index) => (
          <mesh key={index} geometry={mesh.geometry} position={mesh.position}>
            <meshBasicMaterial
              color={focusedObject === index ? "red" : "transparent"}
              wireframe={true}
            />
          </mesh>
        ))}

      {/* Hiển thị thông tin vị trí của đối tượng được focus */}
      {objectPosition && (
        <Html position={[0, 0, 0]} center>
          <div style={{ background: "white", padding: "5px" }}>
            Focused Object Position: {objectPosition.x}, {objectPosition.y},{" "}
            {objectPosition.z}
          </div>
        </Html>
      )}

      {/* Nút Reset Camera */}
      <Html
        position={[-window.innerWidth / 2 + 70, window.innerHeight / 2 - 70, 0]}
        center
      >
        <button onClick={handleResetCamera}>Reset Camera</button>
      </Html>
    </group>
  );
};

export default MyModel;
