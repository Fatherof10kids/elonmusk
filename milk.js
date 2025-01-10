

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#matter-canvas')
  
    let canvasWidth = canvas.offsetWidth
    let canvasHeight = canvas.offsetHeight
  
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Constraint, Events, Body, Vector, Bounds } = Matter
  
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
          hasBounds: true,
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
          render: { visible: true }
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
    
  
    function updateImagePositionAndRotation(person) {
  
     // Body parts and images should already be mapped
     const images = {
      head: document.getElementById('head'),
      chest: document.getElementById('chest'),
      rightUpperArm: document.getElementById('rightUpperArm'),
      rightLowerArm: document.getElementById('rightLowerArm'),
      leftUpperArm: document.getElementById('leftUpperArm'),
      leftLowerArm: document.getElementById('leftLowerArm'),
      leftUpperLeg: document.getElementById('leftUpperLeg'),
      leftLowerLeg: document.getElementById('leftLowerLeg'),
      rightUpperLeg: document.getElementById('rightUpperLeg'),
      rightLowerLeg: document.getElementById('rightLowerLeg'),
    };
  
    // Scale factor (0.3)
    const scale = 0.35;
  
    // Update position and rotation for each body part
    Composite.allBodies(person).forEach(body => {
      const img = images[body.label]; // Get the corresponding image
      if (img) {
        const position = body.position;
        const angle = body.angle;
  
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
    });
  
    }
  
    function ragdoll(x, y, scale, options) {
      scale = typeof scale === 'undefined' ? 1 : scale;
      
      var Body = Matter.Body,
          Bodies = Matter.Bodies,
          Constraint = Matter.Constraint,
          Composite = Matter.Composite,
          Common = Matter.Common;
      
      var headOptions = Common.extend({
          label: 'head',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]
          },
          render: { fillStyle: "#00000000" }
      }, options);
      
      var chestOptions = Common.extend({
          label: 'chest',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
          },
          render: { fillStyle: "#00000000" }
      }, options);
      
      var leftArmOptions = Common.extend({
          label: 'leftUpperArm',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: 10 * scale
          },
          render: { fillStyle: "#00000000" }
      }, options);
      
      var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
          label: 'leftLowerArm',
          render: { fillStyle: "#00000000" }
      });
      
      var rightArmOptions = Common.extend({
          label: 'rightUpperArm',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: 10 * scale
          },
          render: { fillStyle: "#00000000" }
      }, options);
      
      var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
          label: 'rightLowerArm',
      });
      
      var leftLegOptions = Common.extend({
          label: 'leftUpperLeg',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: 10 * scale
          },
          render: { fillStyle: "#00000000" }
      }, options);
      
      var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
          label: 'leftLowerLeg',
          render: { fillStyle: "#00000000" }
      });
      
      var rightLegOptions = Common.extend({
          label: 'rightUpperLeg',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: 10 * scale
          },
          render: { fillStyle: "#00000000" }
      }, options);
      
      var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
          label: 'rightLowerLeg',
          render: { fillStyle: "#00000000" }
      });
      
      var head = Bodies.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions);
      var chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
      var rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions);
      var rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions);
      var leftUpperArm = Bodies.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions);
      var leftLowerArm = Bodies.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions);
      var leftUpperLeg = Bodies.rectangle(x - 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, leftLegOptions);
      var leftLowerLeg = Bodies.rectangle(x - 10 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions);
      var rightUpperLeg = Bodies.rectangle(x + 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, rightLegOptions);
      var rightLowerLeg = Bodies.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, rightLowerLegOptions);
      
      // Create image elements for each body part (use your own image paths)
      const headImg = createImageElement('/assets/head.png', 'head',10);
      const chestImg = createImageElement('/assets/body.png', 'chest',9);
      const rightUpperArmImg = createImageElement('/assets/rightUpperArm.png', 'rightUpperArm',8);
      const rightLowerArmImg = createImageElement('/assets/rightLowerArm.png', 'rightLowerArm',8);
      const leftUpperArmImg = createImageElement('/assets/leftUpperArm.png', 'leftUpperArm',8);
      const leftLowerArmImg = createImageElement('/assets/leftLowerArm.png', 'leftLowerArm',8);
      const leftUpperLegImg = createImageElement('/assets/leftUpperLeg.png', 'leftUpperLeg',8);
      const leftLowerLegImg = createImageElement('/assets/leftLowerLeg.png', 'leftLowerLeg',8);
      const rightUpperLegImg = createImageElement('/assets/rightUpperLeg.png', 'rightUpperLeg',8);
      const rightLowerLegImg = createImageElement('/assets/rightLowerLeg.png', 'rightLowerLeg',8);
  
      var chestToRightUpperArm = Constraint.create({
          bodyA: chest,
          pointA: {
              x: 24 * scale,
              y: -23 * scale
          },
          pointB: {
              x: 0,
              y: -8 * scale
          },
          bodyB: rightUpperArm,
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var chestToLeftUpperArm = Constraint.create({
          bodyA: chest,
          pointA: {
              x: -24 * scale,
              y: -23 * scale
          },
          pointB: {
              x: 0,
              y: -8 * scale
          },
          bodyB: leftUpperArm,
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var chestToLeftUpperLeg = Constraint.create({
          bodyA: chest,
          pointA: {
              x: -10 * scale,
              y: 30 * scale
          },
          pointB: {
              x: 0,
              y: -10 * scale
          },
          bodyB: leftUpperLeg,
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var chestToRightUpperLeg = Constraint.create({
          bodyA: chest,
          pointA: {
              x: 10 * scale,
              y: 30 * scale
          },
          pointB: {
              x: 0,
              y: -10 * scale
          },
          bodyB: rightUpperLeg,
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var upperToLowerRightArm = Constraint.create({
          bodyA: rightUpperArm,
          bodyB: rightLowerArm,
          pointA: {
              x: 0,
              y: 15 * scale
          },
          pointB: {
              x: 0,
              y: -25 * scale
          },
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var upperToLowerLeftArm = Constraint.create({
          bodyA: leftUpperArm,
          bodyB: leftLowerArm,
          pointA: {
              x: 0,
              y: 15 * scale
          },
          pointB: {
              x: 0,
              y: -25 * scale
          },
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var upperToLowerLeftLeg = Constraint.create({
          bodyA: leftUpperLeg,
          bodyB: leftLowerLeg,
          pointA: {
              x: 0,
              y: 20 * scale
          },
          pointB: {
              x: 0,
              y: -20 * scale
          },
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var upperToLowerRightLeg = Constraint.create({
          bodyA: rightUpperLeg,
          bodyB: rightLowerLeg,
          pointA: {
              x: 0,
              y: 20 * scale
          },
          pointB: {
              x: 0,
              y: -20 * scale
          },
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var headContraint = Constraint.create({
          bodyA: head,
          pointA: {
              x: 0,
              y: 25 * scale
          },
          pointB: {
              x: 0,
              y: -35 * scale
          },
          bodyB: chest,
          stiffness: 0.6,
          render: {
              visible: false
          }
      });
      
      var legToLeg = Constraint.create({
          bodyA: leftLowerLeg,
          bodyB: rightLowerLeg,
          stiffness: 0.01,
          render: {
              visible: false
          }
      });
      
      var person = Composite.create({
          bodies: [
              chest, head, leftLowerArm, leftUpperArm, 
              rightLowerArm, rightUpperArm, leftLowerLeg, 
              rightLowerLeg, leftUpperLeg, rightUpperLeg
          ],
          constraints: [
              upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm, 
              chestToRightUpperArm, headContraint, upperToLowerLeftLeg, 
              upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg,
              legToLeg
          ]
      });
      
      return person;
      }
  
    function createRagdoll() {
      const x = 100
      const y = 100
      const opt = 1.3
      var rag = ragdoll(x,y,opt)
      Composite.add(engine.world, rag)
      return rag
    }

    function updateImagePositionAndRotation_bill(person) {
  
        // Body parts and images should already be mapped
        const images = {
         head: document.getElementById('head_bill'),
         chest: document.getElementById('chest_bill'),
         rightUpperArm: document.getElementById('rightUpperArm_bill'),
         rightLowerArm: document.getElementById('rightLowerArm_bill'),
         leftUpperArm: document.getElementById('leftUpperArm_bill'),
         leftLowerArm: document.getElementById('leftLowerArm_bill'),
         leftUpperLeg: document.getElementById('leftUpperLeg_bill'),
         leftLowerLeg: document.getElementById('leftLowerLeg_bill'),
         rightUpperLeg: document.getElementById('rightUpperLeg_bill'),
         rightLowerLeg: document.getElementById('rightLowerLeg_bill'),
       };
     
       // Scale factor (0.3)
       const scale = 0.4;
     
       // Update position and rotation for each body part
       Composite.allBodies(person).forEach(body => {
         const img = images[body.label]; // Get the corresponding image
         if (img) {
           const position = body.position;
           const angle = body.angle;
     
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
       });
     
       }

    function ragdoll_bill(x, y, scale, options) {
        scale = typeof scale === 'undefined' ? 1 : scale;
        
        var Body = Matter.Body,
            Bodies = Matter.Bodies,
            Constraint = Matter.Constraint,
            Composite = Matter.Composite,
            Common = Matter.Common;
        
        var headOptions = Common.extend({
            label: 'head',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]
            },
            render: { fillStyle: "#00000000" }
        }, options);
        
        var chestOptions = Common.extend({
            label: 'chest',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
            },
            render: { fillStyle: "#00000000" }
        }, options);
        
        var leftArmOptions = Common.extend({
            label: 'leftUpperArm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: { fillStyle: "#00000000" }
        }, options);
        
        var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
            label: 'leftLowerArm',
            render: { fillStyle: "#00000000" }
        });
        
        var rightArmOptions = Common.extend({
            label: 'rightUpperArm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: { fillStyle: "#00000000" }
        }, options);
        
        var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
            label: 'rightLowerArm',
        });
        
        var leftLegOptions = Common.extend({
            label: 'leftUpperLeg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: { fillStyle: "#00000000" }
        }, options);
        
        var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
            label: 'leftLowerLeg',
            render: { fillStyle: "#00000000" }
        });
        
        var rightLegOptions = Common.extend({
            label: 'rightUpperLeg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: { fillStyle: "#00000000" }
        }, options);
        
        var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
            label: 'rightLowerLeg',
            render: { fillStyle: "#00000000" }
        });
        
        var head = Bodies.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions);
        var chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
        var rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions);
        var rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions);
        var leftUpperArm = Bodies.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions);
        var leftLowerArm = Bodies.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions);
        var leftUpperLeg = Bodies.rectangle(x - 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, leftLegOptions);
        var leftLowerLeg = Bodies.rectangle(x - 10 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions);
        var rightUpperLeg = Bodies.rectangle(x + 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, rightLegOptions);
        var rightLowerLeg = Bodies.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, rightLowerLegOptions);
        
        // Create image elements for each body part (use your own image paths)
        const headImg = createImageElement('/assets/bill/head.png', 'head_bill',10);
        const chestImg = createImageElement('/assets/bill/body.png', 'chest_bill',9);
        const rightUpperArmImg = createImageElement('/assets/bill/rightUpperArm.png', 'rightUpperArm_bill',8);
        const rightLowerArmImg = createImageElement('/assets/bill/rightLowerArm.png', 'rightLowerArm_bill',7);
        const leftUpperArmImg = createImageElement('/assets/bill/leftUpperArm.png', 'leftUpperArm_bill',8);
        const leftLowerArmImg = createImageElement('/assets/bill/leftLowerArm.png', 'leftLowerArm_bill',7);
        const leftUpperLegImg = createImageElement('/assets/bill/leftUpperLeg.png', 'leftUpperLeg_bill',8);
        const leftLowerLegImg = createImageElement('/assets/bill/leftLowerLeg.png', 'leftLowerLeg_bill',8);
        const rightUpperLegImg = createImageElement('/assets/bill/rightUpperLeg.png', 'rightUpperLeg_bill',8);
        const rightLowerLegImg = createImageElement('/assets/bill/rightLowerLeg.png', 'rightLowerLeg_bill',8);
    
        var chestToRightUpperArm = Constraint.create({
            bodyA: chest,
            pointA: {
                x: 24 * scale,
                y: -23 * scale
            },
            pointB: {
                x: 0,
                y: -8 * scale
            },
            bodyB: rightUpperArm,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var chestToLeftUpperArm = Constraint.create({
            bodyA: chest,
            pointA: {
                x: -24 * scale,
                y: -23 * scale
            },
            pointB: {
                x: 0,
                y: -8 * scale
            },
            bodyB: leftUpperArm,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var chestToLeftUpperLeg = Constraint.create({
            bodyA: chest,
            pointA: {
                x: -10 * scale,
                y: 30 * scale
            },
            pointB: {
                x: 0,
                y: -10 * scale
            },
            bodyB: leftUpperLeg,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var chestToRightUpperLeg = Constraint.create({
            bodyA: chest,
            pointA: {
                x: 10 * scale,
                y: 30 * scale
            },
            pointB: {
                x: 0,
                y: -10 * scale
            },
            bodyB: rightUpperLeg,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var upperToLowerRightArm = Constraint.create({
            bodyA: rightUpperArm,
            bodyB: rightLowerArm,
            pointA: {
                x: 0,
                y: 15 * scale
            },
            pointB: {
                x: 0,
                y: -25 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var upperToLowerLeftArm = Constraint.create({
            bodyA: leftUpperArm,
            bodyB: leftLowerArm,
            pointA: {
                x: 0,
                y: 15 * scale
            },
            pointB: {
                x: 0,
                y: -25 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var upperToLowerLeftLeg = Constraint.create({
            bodyA: leftUpperLeg,
            bodyB: leftLowerLeg,
            pointA: {
                x: 0,
                y: 20 * scale
            },
            pointB: {
                x: 0,
                y: -20 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var upperToLowerRightLeg = Constraint.create({
            bodyA: rightUpperLeg,
            bodyB: rightLowerLeg,
            pointA: {
                x: 0,
                y: 20 * scale
            },
            pointB: {
                x: 0,
                y: -20 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var headContraint = Constraint.create({
            bodyA: head,
            pointA: {
                x: 0,
                y: 25 * scale
            },
            pointB: {
                x: 0,
                y: -35 * scale
            },
            bodyB: chest,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });
        
        var legToLeg = Constraint.create({
            bodyA: leftLowerLeg,
            bodyB: rightLowerLeg,
            stiffness: 0.01,
            render: {
                visible: false
            }
        });
        
        var person = Composite.create({
            bodies: [
                chest, head, leftLowerArm, leftUpperArm, 
                rightLowerArm, rightUpperArm, leftLowerLeg, 
                rightLowerLeg, leftUpperLeg, rightUpperLeg
            ],
            constraints: [
                upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm, 
                chestToRightUpperArm, headContraint, upperToLowerLeftLeg, 
                upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg,
                legToLeg
            ]
        });
        
        return person;
        }
    
    function createRagdoll_bill() {
        const x = 400
        const y = 100
        const opt = 1.3
        var rag = ragdoll_bill(x,y,opt)
        Composite.add(engine.world, rag)
        return rag
    }

    function followCombinedBody(person) {
        // Get the center of the combined body (the center of mass)
        var body = Composite.allBodies(person).find(body => body.label === 'chest'); 

        if (body) {
            var bounds = body.bounds;
            var center = {
                x: (bounds.min.x + bounds.max.x) / 2,
                y: (bounds.min.y + bounds.max.y) / 2
            };
        }

        // Set the canvas width and height (fixed)
        const canvasWidth = render.options.width;
        const canvasHeight = render.options.height;

        // Define the margin (half the height of the viewport, to give a centered view)
        var margin = canvasHeight / 2;
    
        // Set the camera (viewport) to follow the combined body
        Render.lookAt(render, {
            min: { x: 0, y: body.position.y - margin },
            max: { x: canvasWidth, y: body.position.y + margin }
        });
    }

    init()
    var person = createRagdoll()
    var bill = createRagdoll_bill()
    createWalls()
  
    // get the centre of the viewport
    var viewportCentre = {
        x: render.options.width * 0.5,
        y: render.options.height * 0.5
    };

    // create limits for the viewport
    var extents = {
        min: { x: -300, y: -300 },
        max: { x: 1100, y: 900 }
    };

    // keep track of current bounds scale (view zoom)
    var boundsScaleTarget = 1,
        boundsScale = {
            x: 1,
            y: 1
        };
  
    Events.on(engine, 'afterUpdate', () => {
      //updateImageCar(car);
      updateImagePositionAndRotation(person);
      updateImagePositionAndRotation_bill(bill);
      followCombinedBody(person);
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