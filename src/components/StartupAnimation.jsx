import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, ChevronRight, Clock, ShieldCheck, Zap } from 'lucide-react';

export const StartupAnimation = ({ onComplete }) => {
  const containerRef = useRef(null);
  const clockContainerRef = useRef(null);
  const volumetricRaysRef = useRef(null);
  const goldRingRef = useRef(null);
  const cyanRingRef = useRef(null);
  const textRef = useRef(null);
  const statusRef = useRef(null);
  const flashOverlayRef = useRef(null);
  const particleDustRef = useRef(null);
  
  const [statusText, setStatusText] = useState('INITIALIZING ROUTINX ENGINE...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Initial 3D Depth-of-Field & Perspective States
    gsap.set(clockContainerRef.current, {
      scale: 0.15,
      opacity: 0,
      rotationX: 25,
      rotationY: -20,
      z: -300,
      filter: 'blur(12px)'
    });
    
    gsap.set([goldRingRef.current, cyanRingRef.current], {
      scale: 0.2,
      opacity: 0,
      rotation: -90
    });

    gsap.set(volumetricRaysRef.current, {
      opacity: 0,
      scale: 0.4,
      rotation: 0
    });

    gsap.set(textRef.current, { opacity: 0, y: 30, filter: 'blur(6px)' });
    gsap.set(flashOverlayRef.current, { opacity: 0 });

    // Progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18) + 6;
      });
    }, 110);

    setTimeout(() => setStatusText('CALIBRATING 3D VOLUMETRIC RAYTRACING...'), 500);
    setTimeout(() => setStatusText('ALIGNING ROUTINE & EXPENSE MATRICES...'), 1100);
    setTimeout(() => setStatusText('SYNCHRONIZING HABIT STREAKS & 2FA VAULT...'), 1700);
    setTimeout(() => setStatusText('ROUTINX READY — WELCOME EXPLORER!'), 2300);

    // 3D Cinematic Pop-Up Emergence Sequence
    tl
    // 1. Volumetric God Rays start radiating behind
    .to(volumetricRaysRef.current, {
      opacity: 0.85,
      scale: 1.1,
      duration: 1.2,
      ease: 'power2.out'
    }, 0.1)
    
    // 2. 3D Clock Icon pops up and floats forward from the deep dark navy background
    .to(clockContainerRef.current, {
      scale: 1,
      opacity: 1,
      rotationX: 0,
      rotationY: 0,
      z: 0,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'back.out(1.8)'
    }, 0.2)

    // 3. Neon Cyan & Gold Glowing Rings rotate into place
    .to(goldRingRef.current, {
      scale: 1,
      opacity: 0.9,
      rotation: 45,
      duration: 1.0,
      ease: 'power2.out'
    }, 0.4)
    .to(cyanRingRef.current, {
      scale: 1,
      opacity: 0.95,
      rotation: -60,
      duration: 1.0,
      ease: 'power2.out'
    }, 0.5)

    // 4. Subtle continuous floating & rotation of god rays
    .to(volumetricRaysRef.current, {
      rotation: 90,
      duration: 2.5,
      ease: 'none'
    }, 0.5)

    // 5. Typography and Status Reveal with crisp gold & cyan accents
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power2.out'
    }, 0.7)

    // 6. Cinematic expansion and seamless light transition into the main app
    .to(clockContainerRef.current, {
      scale: 2.8,
      opacity: 0.95,
      duration: 0.7,
      ease: 'power3.in'
    }, '+=0.4')
    .to(flashOverlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.in'
    }, '-=0.45')
    .to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.45,
      ease: 'power2.out'
    });

    return () => {
      clearInterval(interval);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(ellipse at center, #0a1124 0%, #050b18 45%, #02050d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        perspective: '1200px'
      }}
      onClick={() => onComplete && onComplete()}
      title="Click anywhere to jump directly into RoutinX"
    >
      {/* Background Volumetric God Rays & Ambient Shimmer */}
      <div 
        ref={volumetricRaysRef}
        style={{
          position: 'absolute',
          width: '750px',
          height: '750px',
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(212, 175, 55, 0.22) 0deg, rgba(6, 182, 212, 0.0) 40deg, rgba(6, 182, 212, 0.3) 90deg, rgba(212, 175, 55, 0.0) 140deg, rgba(212, 175, 55, 0.25) 180deg, rgba(6, 182, 212, 0.0) 230deg, rgba(6, 182, 212, 0.3) 270deg, rgba(212, 175, 55, 0.0) 320deg, rgba(212, 175, 55, 0.22) 360deg)',
          filter: 'blur(28px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Atmospheric Ambient Light Flares */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '25%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '25%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(45px)',
        pointerEvents: 'none'
      }} />

      {/* Outer Cyan Energy Ring */}
      <div 
        ref={cyanRingRef}
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          border: '1.5px solid rgba(6, 182, 212, 0.45)',
          boxShadow: '0 0 35px rgba(6, 182, 212, 0.3), inset 0 0 25px rgba(6, 182, 212, 0.15)',
          pointerEvents: 'none'
        }}
      />

      {/* Inner Metallic Gold Orbital Ring */}
      <div 
        ref={goldRingRef}
        style={{
          position: 'absolute',
          width: '270px',
          height: '270px',
          borderRadius: '50%',
          border: '2px dashed rgba(245, 197, 66, 0.55)',
          boxShadow: '0 0 30px rgba(245, 197, 66, 0.35)',
          pointerEvents: 'none'
        }}
      />

      {/* 3D Floating Dynamic Clock App Icon with Volumetric Glow & Pop-up Effect */}
      <div 
        ref={clockContainerRef}
        style={{
          position: 'relative',
          width: '150px',
          height: '150px',
          borderRadius: '34px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(212, 175, 55, 0.45), 0 0 80px rgba(6, 182, 212, 0.35)',
          border: '2px solid rgba(245, 197, 66, 0.65)',
          background: '#070f22',
          zIndex: 10,
          transformStyle: 'preserve-3d'
        }}
      >
        <img 
          src="/routinx_3d_clock_icon.jpg" 
          alt="RoutinX 3D Floating Clock Icon" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />

        {/* Specular Glint Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Premium Cinematic Typography & Status Monitor */}
      <div 
        ref={textRef}
        style={{
          marginTop: '2.4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.8rem',
          zIndex: 10,
          textAlign: 'center'
        }}
      >
        {/* Brand Name with Gold & Cyan Metallic Gradient */}
        <div style={{
          fontSize: '2.6rem',
          fontWeight: 900,
          letterSpacing: '0.16em',
          background: 'linear-gradient(135deg, #f5c542 0%, #38bdf8 50%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 35px rgba(245, 197, 66, 0.4)',
          fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
          lineHeight: 1.1
        }}>
          ROUTINX
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '0.78rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          fontWeight: 800,
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>DAILY ROUTINE</span>
          <span style={{ color: '#f5c542' }}>•</span>
          <span>EXPENSES</span>
          <span style={{ color: '#06b6d4' }}>•</span>
          <span>3D TRACKER</span>
        </div>

        {/* High-Tech Progress Bar with Gold & Cyan Fluid Gradient */}
        <div style={{ width: '280px', marginTop: '0.6rem' }}>
          <div style={{
            height: '5px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #f5c542, #06b6d4, #10b981)',
              boxShadow: '0 0 15px #f5c542',
              transition: 'width 0.15s ease'
            }} />
          </div>

          {/* Dynamic Console Status Message */}
          <div 
            ref={statusRef}
            style={{
              fontSize: '0.7rem',
              color: '#38bdf8',
              fontFamily: 'monospace',
              marginTop: '0.6rem',
              letterSpacing: '0.06em',
              fontWeight: 600
            }}
          >
            {statusText} ({Math.min(progress, 100)}%)
          </div>
        </div>

        <div style={{
          fontSize: '0.72rem',
          color: 'rgba(255, 255, 255, 0.45)',
          marginTop: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          <span>Click anywhere to start instantly</span>
          <ChevronRight size={13} color="#f5c542" />
        </div>
      </div>

      {/* Seamless Radiant Light Burst Overlay */}
      <div 
        ref={flashOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(245, 197, 66, 0.85) 30%, rgba(6, 182, 212, 0.95) 60%, rgba(5, 11, 24, 1) 100%)',
          pointerEvents: 'none',
          zIndex: 30
        }}
      />
    </div>
  );
};
