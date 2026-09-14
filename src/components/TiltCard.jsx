import React, { useRef, useState } from 'react';

export const TiltCard = ({ children, className = '', style = {}, ...props }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8; // Pitch tilt angle
    const rotateY = ((x - centerX) / centerX) * 8;  // Yaw tilt angle

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glowX, glowY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`card card-3d ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(12px) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
        background: isHovered
          ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, var(--glass-glow), var(--card-bg))`
          : 'var(--card-bg)',
        transition: isHovered ? 'transform 0.1s ease-out, background 0.2s ease' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s ease',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
