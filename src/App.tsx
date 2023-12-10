import { OrbitControls, Stats, useGLTF } from "@react-three/drei";
import "./App.css";
import Canvas from "./components/threejs_custom/canvas";
import MyModel from "./components/loader/load3d";

function App() {
  const gltf = useGLTF("/3d/datacenter.glb");
  console.log("3d:", gltf);
  return (
    <div>
      <Canvas
        style={{ width: "100%", height: "100vh" }}
        camera={{ position: [7, 7, 7] }}
      >
        {/* {gltf.scene && (
          <primitive
            object={gltf.scene}
            // position={[0, 1, 0]}
            // children-0-castShadow
          />
        )} */}
        <MyModel modelPath="/3d/datacenter.glb" />
        <mesh>
          <ambientLight />
          <sphereGeometry />
          <meshStandardMaterial color="blue" wireframe />

          <axesHelper args={[5]} />
          <OrbitControls position={[0, 0, 0]} />
          <gridHelper args={[20, 20, 0xff0000, "teal"]} />
          <Stats />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
