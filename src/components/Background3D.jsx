import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useApp } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

export const Background3D = () => {
  const containerRef = useRef(null);
  const { theme } = useApp();

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Color Palette Selection based on Theme & Hour
    const hour = new Date().getHours();
    let primaryColor, secondaryColor;

    if (hour >= 5 && hour < 12) {
      primaryColor = new THREE.Color(0x06b6d4); // Vibrant Cyan
      secondaryColor = new THREE.Color(0x3b82f6); // Electric Blue
    } else if (hour >= 12 && hour < 18) {
      primaryColor = new THREE.Color(0x6366f1); // Indigo
      secondaryColor = new THREE.Color(0x10b981); // Emerald
    } else if (hour >= 18 && hour < 22) {
      primaryColor = new THREE.Color(0xec4899); // Coral Pink
      secondaryColor = new THREE.Color(0x8b5cf6); // Sunset Purple
    } else {
      primaryColor = new THREE.Color(0x38bdf8); // Cyber Sky
      secondaryColor = new THREE.Color(0x818cf8); // Neon Violet
    }

    if (theme === 'light') {
      primaryColor.lerp(new THREE.Color(0x4f46e5), 0.3);
    }

    // 3. Floating 3D Geometric Meshes
    const meshesGroup = new THREE.Group();
    scene.add(meshesGroup);

    // Octahedron
    const octaGeom = new THREE.OctahedronGeometry(2.5, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.35 : 0.2
    });
    const octaMesh = new THREE.Mesh(octaGeom, octaMat);
    octaMesh.position.set(-10, 6, -10);
    meshesGroup.add(octaMesh);

    // Torus
    const torusGeom = new THREE.TorusGeometry(3.5, 0.6, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.25 : 0.15
    });
    const torusMesh = new THREE.Mesh(torusGeom, torusMat);
    torusMesh.position.set(12, -4, -8);
    meshesGroup.add(torusMesh);

    // Icosahedron
    const icoGeom = new THREE.IcosahedronGeometry(3, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.2 : 0.12
    });
    const icoMesh = new THREE.Mesh(icoGeom, icoMat);
    icoMesh.position.set(0, -12, -12);
    meshesGroup.add(icoMesh);

    // 4. Wave Particle Grid
    const GRID_SIZE = 55;
    const SEPARATION = 1.3;
    const numParticles = GRID_SIZE * GRID_SIZE;

    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    let idx = 0;
    for (let ix = 0; ix < GRID_SIZE; ix++) {
      for (let iz = 0; iz < GRID_SIZE; iz++) {
        positions[idx] = (ix - GRID_SIZE / 2) * SEPARATION;
        positions[idx + 1] = 0;
        positions[idx + 2] = (iz - GRID_SIZE / 2) * SEPARATION;

        const ratio = (ix + iz) / (GRID_SIZE * 2);
        const col = primaryColor.clone().lerp(secondaryColor, ratio);
        colors[idx] = col.r;
        colors[idx + 1] = col.g;
        colors[idx + 2] = col.b;

        idx += 3;
      }
    }

    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    gridGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 16;
    dotCanvas.height = 16;
    const dotCtx = dotCanvas.getContext('2d');
    const grad = dotCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    dotCtx.fillStyle = grad;
    dotCtx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(dotCanvas);

    const gridMaterial = new THREE.PointsMaterial({
      size: 0.75,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: theme === 'dark' ? 0.7 : 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleGrid = new THREE.Points(gridGeometry, gridMaterial);
    scene.add(particleGrid);

    // 5. GSAP Scroll Parallax
    const scrollObj = { y: 0 };
    const scrollTrigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.to(scrollObj, {
          y: self.progress * 25,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => {
            camera.position.y = 10 - scrollObj.y * 0.4;
            camera.position.z = 28 - scrollObj.y * 0.2;
            meshesGroup.rotation.y = scrollObj.y * 0.05;
            meshesGroup.position.y = scrollObj.y * 0.2;
          }
        });
      }
    });

    // 6. Mouse Interaction
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.015;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.015;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. Main Render Loop
    let count = 0;
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      count += 0.025;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      camera.position.x = Math.sin(count * 0.15) * 1.5 + targetX;
      camera.lookAt(0, -scrollObj.y * 0.2, 0);

      octaMesh.rotation.x += 0.008;
      octaMesh.rotation.y += 0.012;

      torusMesh.rotation.x += 0.006;
      torusMesh.rotation.z += 0.009;

      icoMesh.rotation.y += 0.01;

      // Animate wave grid
      const posArr = particleGrid.geometry.attributes.position.array;
      let pIdx = 1;
      for (let ix = 0; ix < GRID_SIZE; ix++) {
        for (let iz = 0; iz < GRID_SIZE; iz++) {
          posArr[pIdx] = Math.sin((ix + count) * 0.3) * 1.4 + Math.sin((iz + count) * 0.45) * 1.4;
          pIdx += 3;
        }
      }
      particleGrid.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      scrollTrigger.kill();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      gridGeometry.dispose();
      gridMaterial.dispose();
      texture.dispose();
      octaGeom.dispose();
      octaMat.dispose();
      torusGeom.dispose();
      torusMat.dispose();
      icoGeom.dispose();
      icoMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: theme === 'dark' ? 0.9 : 0.55
      }}
    />
  );
};
