import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCanvas = ({ theme, triggerPulse }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Determine Time of Day Color Palette
    const hour = new Date().getHours();
    let primaryColor, secondaryColor;

    if (hour >= 5 && hour < 10) {
      // Dawn / Sunrise
      primaryColor = new THREE.Color(0xf59e0b); // Warm Amber
      secondaryColor = new THREE.Color(0xec4899); // Coral Pink
    } else if (hour >= 10 && hour < 17) {
      // Day
      primaryColor = new THREE.Color(0x06b6d4); // Vibrant Cyan
      secondaryColor = new THREE.Color(0x3b82f6); // Electric Blue
    } else if (hour >= 17 && hour < 20) {
      // Sunset
      primaryColor = new THREE.Color(0x8b5cf6); // Sunset Purple
      secondaryColor = new THREE.Color(0xf43f5e); // Crimson
    } else {
      // Night / Cyberpunk
      primaryColor = new THREE.Color(0x6366f1); // Neon Indigo
      secondaryColor = new THREE.Color(0x10b981); // Emerald Cyan
    }

    // Adjust for light/dark theme
    if (theme === 'light') {
      primaryColor.lerp(new THREE.Color(0x4f46e5), 0.3);
    }

    // 3. Create 3D Particle Grid Wave Terrain
    const GRID_SIZE = 60;
    const SEPARATION = 1.2;
    const numParticles = GRID_SIZE * GRID_SIZE;

    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;
    for (let ix = 0; ix < GRID_SIZE; ix++) {
      for (let iz = 0; iz < GRID_SIZE; iz++) {
        positions[i] = (ix - GRID_SIZE / 2) * SEPARATION; // X
        positions[i + 1] = 0;                              // Y
        positions[i + 2] = (iz - GRID_SIZE / 2) * SEPARATION; // Z

        // Color interpolation across grid
        const ratio = (ix + iz) / (GRID_SIZE * 2);
        const col = primaryColor.clone().lerp(secondaryColor, ratio);
        colors[i] = col.r;
        colors[i + 1] = col.g;
        colors[i + 2] = col.b;

        scales[j] = 1.5;

        i += 3;
        j++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: theme === 'dark' ? 0.75 : 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 4. Mouse Motion Tracking
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.02;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.02;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Window Resize Listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let count = 0;
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      count += 0.03;

      // Smooth camera interpolation following mouse
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = Math.sin(count * 0.2) * 2 + targetX;
      camera.position.y = 15 - targetY;
      camera.lookAt(0, 0, 0);

      // Animate particle wave matrix
      const posArr = particles.geometry.attributes.position.array;
      let pIndex = 1; // Y coordinate offset

      for (let ix = 0; ix < GRID_SIZE; ix++) {
        for (let iz = 0; iz < GRID_SIZE; iz++) {
          posArr[pIndex] = (Math.sin((ix + count) * 0.3) * 1.5) +
                           (Math.sin((iz + count) * 0.5) * 1.5);
          pIndex += 3;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
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
        opacity: theme === 'dark' ? 0.85 : 0.5
      }} 
    />
  );
};
