

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#matter-canvas')

  let canvasWidth = canvas.offsetWidth
  let canvasHeight = canvas.offsetHeight

  const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Constraint, Events, Body, Vector } = Matter

  let engine, render, runner, mouse, mouseConstraint

  function init() {
    engine = Engine.create({
      constraintIterations: 10,
      positionIterations: 10
    })

    render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: 1
      }
    })

    mouse = Mouse.create(canvas)

    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false }
      }
    })

    render.mouse = mouse;

    runner = Runner.create()

    Render.run(render)
    Runner.run(runner, engine)

    mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
    Composite.add(engine.world, mouseConstraint)
  }

  function createWalls()
  {
        const wallColor = '#34d2eb'
            // Create ground composite that surrounds the canvas
        const ground = Composite.create();

        // Create the four walls (edges) of the canvas
        const wallThickness = 10; // Thickness of walls

        // Left wall
        const leftWall = Bodies.rectangle(0, canvasHeight / 2 - 200, wallThickness, canvasHeight, { isStatic: true,  render: { fillStyle: wallColor }});
        // Right wall
        const rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2 - 200, wallThickness, canvasHeight, { isStatic: true , render: { fillStyle: wallColor } });
        // Top wall
        const topWall = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, wallThickness, { isStatic: true, render: { fillStyle: wallColor } });
        // Bottom wall
        const bottomWall = Bodies.rectangle(canvasWidth / 2, canvasHeight - 200, canvasWidth, wallThickness, { isStatic: true, render: { fillStyle: wallColor } });

        // Add the walls to the ground composite
        Composite.add(ground, [leftWall, rightWall, topWall, bottomWall]);

        Composite.add(engine.world, ground);
  }

  function createSeesaw(){
    var group = Body.nextGroup(true);

    var catapult = Bodies.rectangle(350, 900, 450, 20, { collisionFilter: { group: group } });

    Composite.add(engine.world, [
        catapult,
        Bodies.rectangle(350, 900, 30, 100, { isStatic: true, collisionFilter: { group: group }, render: { fillStyle: '#060a19' } }),
        Bodies.circle(550, 100, 50, { density: 0.005 }),
        Constraint.create({ 
            bodyA: catapult, 
            pointB: { x: catapult.position.x, y: catapult.position.y - 30 },
            stiffness: 1,
            length: 0
        })
    ]);

  }

  init()
  createWalls()
  createSeesaw()


  Events.on(engine, 'afterUpdate', () => {
    //updateImageCar(car);
  });


  window.addEventListener('resize', () => {
    // canvasWidth = innerWidth
    // canvasHeight = innerHeight
    // render.canvas.width = canvasWidth
    // render.canvas.height = canvasHeight
    // resizeFilter()

  })

})

function randomNumBetween(min, max) {
  return Math.random() * (max - min) + min
}