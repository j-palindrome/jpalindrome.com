import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Page() {
  const canvasRef = useRef(null!);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setAnimationLoop(() => renderer.render(scene, camera));
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="h-screen w-screen" />
    </div>
  );
}
