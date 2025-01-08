

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#matter-canvas')

  let canvasWidth = canvas.offsetWidth
  let canvasHeight = canvas.offsetHeight

  const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Constraint, Events, Body } = Matter

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

  function createCyberTruck(){
    // Set up the desired weight and dimensions for the rectangle
    const weight = 10000; // in kilograms
    const width = 200; // in pixels (width of the rectangle)
    const height = 50; // in pixels (height of the rectangle)

    // Assuming 1 pixel = 1 cm, so the volume is in cubic centimeters
    const area = width * height; // area in square centimeters

    // Set the density to ensure the mass is 10 kg
    // Mass = Density * Area, so Density = Mass / Area
    const density = weight / area; // density in kg/cm²

    // Create the stack of Cybertrucks
    const numCybertrucks = 5; // Number of Cybertrucks to stack
    const initialX = 500; // Starting x position for the stack
    let initialY = 850; // Starting y position for the first Cybertruck

    for (let i = 0; i < numCybertrucks; i++) {
    // Create each Cybertruck and stack them vertically
    const cyberTruck = Bodies.rectangle(initialX, initialY, width, height, {
        density: density,
        render: {
            sprite: {
              texture: '/assets/CyberTruck.png', // Path to the image
              xScale: 0.2,  // Scale the image based on the width of the rectangle
              yScale: 0.2   // Scale the image based on the height of the rectangle
            }
        }
    });

    // Add the Cybertruck to the Matter.js world
    Composite.add(engine.world, cyberTruck);

    // Update the y-position for the next Cybertruck to stack it above the previous one
    initialY -= height; // Move up by the height of one Cybertruck
    }
  }


  function createImageElement(src, id, zIndex = 1) {
    const img = document.createElement('img');
    img.src = src;
    img.id = id;
    img.classList.add('attachedImage');
    
    // Apply z-index for stacking order
    img.style.zIndex = zIndex;
    
    document.body.appendChild(img);
    return img;
  }
  

  function updateImageCar(car) {

    // Body parts and images should already be mapped
    const img = document.getElementById('cyberTruck');
 
    // Scale factor (0.3)
    const scale = 0.35;
 
    if (img) {
    const position = car.position;
    const angle = car.angle;

    // Set the width and height to 0.3 of the original size (scaled)
    img.style.width = `${img.naturalWidth * scale}px`;
    img.style.height = `${img.naturalHeight * scale}px`;

    // Update position
    img.style.left = `${position.x - img.width / 2}px`;
    img.style.top = `${position.y - img.height / 2}px`;

    // Update rotation (convert radians to degrees)
    const rotationInDegrees = angle * (180 / Math.PI);
    img.style.transform = `rotate(${rotationInDegrees}deg)`;
    }
 
   }

   function createWreckingBall(){
    var ball = Bodies.circle(100, 400, 50, { density: 2000, frictionAir: 0.005, render: {
        sprite: {
          texture: '/assets/wrecking_ball.png', // Path to the image
          xScale: 0.6,  // Scale the image based on the width of the rectangle
          yScale: 0.6   // Scale the image based on the height of the rectangle
        }
    }});
    
    Composite.add(engine.world, ball);
    Composite.add(engine.world, Constraint.create({
        pointA: { x: 380, y: 450 },
        bodyB: ball,
        stiffness: 0.9,
        length: 350,
        render: {
            strokeStyle: 'black', // Set the constraint line color to black
            lineWidth: 1 // Optional: you can adjust the line width if needed
        }
    }));
   }

  init()
  createWalls()
  createCyberTruck()
  createWreckingBall()


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