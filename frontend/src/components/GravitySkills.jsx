import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const CATEGORY_COLORS = {
  "Programming": "#00f0ff",
  "AI/ML": "#b026ff",
  "Databases": "#39ff14",
  "Soft skills": "#ff7300",
  "Tools": "#00ffcc"
};

export default function GravitySkills({ skills }) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!skills || skills.length === 0) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events, Composite, Body, Vector } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0; // Disable downward gravity, we will use custom attraction

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: 600,
        wireframes: false,
        background: 'transparent'
      }
    });

    const width = render.options.width;
    const height = render.options.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create boundaries
    const walls = [
      Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true, render: { visible: false } }),
      Bodies.rectangle(width / 2, height, width, 50, { isStatic: true, render: { visible: false } }),
      Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, render: { visible: false } }),
      Bodies.rectangle(width, height / 2, 50, height, { isStatic: true, render: { visible: false } })
    ];
    World.add(engine.world, walls);

    // Create skill nodes
    const skillBodies = skills.map(skill => {
      // Radius based on proficiency (stronger = larger/heavier)
      const radius = 20 + (skill.proficiency / 100) * 40; 
      
      const body = Bodies.circle(
        Math.random() * width, 
        Math.random() * height, 
        radius, 
        {
          restitution: 0.8,
          frictionAir: 0.05,
          render: {
            fillStyle: CATEGORY_COLORS[skill.category] || "#ffffff",
            strokeStyle: 'rgba(255,255,255,0.5)',
            lineWidth: 2
          },
          plugin: {
            skillData: skill
          }
        }
      );
      return body;
    });

    World.add(engine.world, skillBodies);

    // Add Mouse Constraint
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    World.add(engine.world, mouseConstraint);

    render.mouse = mouse; // keep the mouse in sync with rendering

    // Custom physics: attract to center based on strength
    Events.on(engine, 'beforeUpdate', () => {
      skillBodies.forEach(body => {
        const skill = body.plugin.skillData;
        const forceMagnitude = 0.0001 * (skill.proficiency / 100);
        
        // Direction to center
        const dir = Vector.sub({ x: centerX, y: centerY }, body.position);
        const dist = Vector.magnitude(dir);
        
        if (dist > 0) {
           const normalizedDir = Vector.normalise(dir);
           const force = Vector.mult(normalizedDir, forceMagnitude);
           Body.applyForce(body, body.position, force);
        }
      });
    });

    // Hover effect
    Events.on(mouseConstraint, 'mousemove', (event) => {
      const foundPhysics = Matter.Query.point(skillBodies, event.mouse.position);
      if (foundPhysics.length > 0) {
        const body = foundPhysics[0];
        setHoveredSkill(body.plugin.skillData);
        setTooltipPos({ x: event.mouse.absolute.x, y: event.mouse.absolute.y });
        render.canvas.style.cursor = 'pointer';
      } else {
        setHoveredSkill(null);
        render.canvas.style.cursor = 'default';
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Custom drawing for text labels on bodies
    Events.on(render, 'afterRender', () => {
        const context = render.context;
        context.font = "12px Inter, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#fff";

        skillBodies.forEach(body => {
            const skill = body.plugin.skillData;
            context.fillText(skill.name, body.position.x, body.position.y);
        });
    });

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (engineRef.current) {
        World.clear(engineRef.current.world);
        Engine.clear(engineRef.current);
      }
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, [skills]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div ref={sceneRef} style={{ width: '100%', minHeight: '600px', borderRadius: '16px', overflow: 'hidden' }} className="glass-panel" />
      
      {hoveredSkill && (
        <div className="skill-tooltip" style={{ left: tooltipPos.x, top: tooltipPos.y, opacity: 1 }}>
          <h4>{hoveredSkill.name}</h4>
          <p>Category: {hoveredSkill.category}</p>
          <p>Proficiency: {hoveredSkill.proficiency}%</p>
          <p>Demand Score: {hoveredSkill.demand_score}/100</p>
        </div>
      )}
    </div>
  );
}
