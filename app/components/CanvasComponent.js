"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Canvas.module.css";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null); // Store the animation frame ID
  const [circles, setCircles] = useState([]);
  const [circleCount, setCircleCount] = useState(0);

  // Animation function
  const animateCircles = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const updatedCircles = circles.map((circle) => {
      if (circle.radius >= circle.maxRadius || circle.collided) {
        return { ...circle, collided: true };
      }

      const newRadius = circle.radius + 1;

      // Detect collisions with other circles
      let isCollided = false;
      for (const otherCircle of circles) {
        if (
          circle.id !== otherCircle.id &&
          Math.hypot(circle.x - otherCircle.x, circle.y - otherCircle.y) <
            newRadius + otherCircle.radius
        ) {
          isCollided = true;
          break;
        }
      }

      if (!isCollided) {
        circle.radius = newRadius;
      }

      return {
        ...circle,
        collided: isCollided,
        opacity: circle.opacity - 0.01,
      };
    });

    setCircles(updatedCircles.filter((circle) => circle.opacity > 0));
    setCircleCount(
      updatedCircles.filter((circle) => circle.opacity > 0).length,
    );

    // Draw the circles
    updatedCircles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${circle.color.r}, ${circle.color.g}, ${circle.color.b}, ${circle.opacity})`;
      ctx.fill();
    });

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animateCircles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    animationFrameRef.current = requestAnimationFrame(animateCircles);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [circles]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newCircle = {
      id: Date.now(),
      x,
      y,
      radius: 1,
      maxRadius: 2000,
      opacity: 1,
      collided: false,
      color: {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      },
    };

    setCircles((prev) => [...prev, newCircle]);
  };

  const clearCanvas = () => {
    setCircles([]);
    setCircleCount(0);
  };

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onClick={handleCanvasClick}
      ></canvas>
      <div className={styles.controls}>
        <button onClick={clearCanvas}>Clear Canvas</button>
        <span>Active Circles: {circleCount}</span>
      </div>
    </div>
  );
};

export default CanvasComponent;
