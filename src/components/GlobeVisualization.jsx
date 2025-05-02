"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import { Box, Typography, CircularProgress } from "@mui/material";

// Earth texture
const earthLight = "/assets/earth_texture.jpg";

const Globe = () => {
  const { scene } = useThree();
  const meshRef = useRef(null);
  const [hovered] = useState(null);
  const texture = useLoader(TextureLoader, earthLight);

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const autoRotateTimer = useRef(null);
  const isAutoRotating = useRef(false);

  // Initialize globe and lights
  useEffect(() => {
    // Create geometry and material
    const geometry = new THREE.SphereGeometry(6.5, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      emissive: new THREE.Color(0x333333), // Emissive glow for dark mode
      emissiveIntensity: 0.3,
    });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    mesh.userData = {}; // Add userData for raycasting
    scene.add(mesh);

    // Add lights for dark mode
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.set(10, 10, 10);
    scene.add(ambientLight, pointLight);

    // Cleanup on unmount
    return () => {
      scene.remove(mesh, ambientLight, pointLight);
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [scene, texture]);

  // Handle pointer events
  const handlePointerDown = (event) => {
    isDragging.current = true;
    isAutoRotating.current = false;
    if (autoRotateTimer.current) {
      clearTimeout(autoRotateTimer.current);
    }
    previousMousePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerMove = (event) => {
    if (isDragging.current && meshRef.current) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.current.x,
        y: event.clientY - previousMousePosition.current.y,
      };
      rotationVelocity.current.y = deltaMove.x * 0.005;
      rotationVelocity.current.x = deltaMove.y * 0.005;
      previousMousePosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (autoRotateTimer.current) {
      clearTimeout(autoRotateTimer.current);
    }
    autoRotateTimer.current = setTimeout(() => {
      isAutoRotating.current = true;
    }, 1000);
  };

  useEffect(() => {
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (autoRotateTimer.current) {
        clearTimeout(autoRotateTimer.current);
      }
    };
  }, []);

  // Update globe rotation
  useFrame(() => {
    if (meshRef.current && !hovered) {
      if (isAutoRotating.current) {
        meshRef.current.rotation.y += 0.001;
      } else {
        meshRef.current.rotation.y += rotationVelocity.current.y;
        meshRef.current.rotation.x += rotationVelocity.current.x;
        if (!isDragging.current) {
          rotationVelocity.current.x *= 0.95;
          rotationVelocity.current.y *= 0.95;
        }
      }
      meshRef.current.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, meshRef.current.rotation.x)
      );
    }
  });

  return null;
};

const GlobeVisualization = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Loading 3D Globe...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Canvas camera={{ position: [0, 7, 20], fov: 45 }}>
        <Globe />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={false}
          minDistance={6}
          maxDistance={60}
        />
      </Canvas>
    </Box>
  );
};

export default GlobeVisualization;
