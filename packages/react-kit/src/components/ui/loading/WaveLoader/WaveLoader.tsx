import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import line1 from "./line1.png";
import line2 from "./line2.png";
import line3 from "./line3.png";
import line4 from "./line4.png";

const WaveContainer = styled.div`
  position: relative;
  width: 100%; /* Adjust width as needed */
  min-height: 200px; /* Adjust height as needed */
  overflow: hidden;
`;

const WaveLine = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const WaveLoader = () => {
  const waveRef1 = useRef<HTMLImageElement>(null);
  const waveRef2 = useRef<HTMLImageElement>(null);
  const waveRef3 = useRef<HTMLImageElement>(null);
  const waveRef4 = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const waveLines = [
      waveRef1.current,
      waveRef2.current,
      waveRef3.current,
      waveRef4.current
    ];
    const waveSpeeds = [100, 150, 200, 250]; // Array of wave speeds

    let rotationAngle = 0;

    function animateWave() {
      const time = Date.now();

      for (let i = 0; i < waveLines.length; i++) {
        const waveLine = waveLines[i];
        const waveSpeed = waveSpeeds[i];

        // Apply negative offsetX for right-to-left movement
        const offsetX = -time * waveSpeed * 0.00001;
        const offsetY = Math.sin(offsetX) * 25; // amplitude

        // Rotate the wave line
        const rotation = Math.sin(offsetX + rotationAngle) * 2;
        if (waveLine) {
          waveLine.style.transform = `translateY(${offsetY}px) rotateX(${rotation}deg)`;
        }
      }

      // Update rotation angle for next frame
      rotationAngle += 0.1;

      requestAnimationFrame(animateWave);
    }

    animateWave();
  }, []);
  return (
    <WaveContainer>
      <WaveLine src={line1} alt="Wave 1" ref={waveRef1} />
      <WaveLine src={line2} alt="Wave 2" ref={waveRef2} />
      <WaveLine src={line3} alt="Wave 3" ref={waveRef3} />
      <WaveLine src={line4} alt="Wave 4" ref={waveRef4} />
    </WaveContainer>
  );
};
