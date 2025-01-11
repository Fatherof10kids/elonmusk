
const simulation_height = 10500;

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

    function createDashedWall(x, isLeftWall) {
        const wallThickness = 20;
        const blockHeight = 100;  // Height of each "dash" block
        const wallColor = '#777'; // Color for the wall
        const dashColor = '#333'; // Color for the dashed blocks
        const wallBlocks = [];
        const numBlocks = Math.floor(simulation_height / blockHeight); // Total number of blocks to stack
        
        for (let i = 0; i < numBlocks; i++) {
            // Alternate the color for a dashed effect (alternating between wallColor and dashColor)
            const color = i % 2 === 0 ? dashColor : wallColor;
    
            // Create a rectangular block for the dash
            const block = Bodies.rectangle(
                x, 
                i * blockHeight + blockHeight / 2, // Y position of each block, stacked vertically
                wallThickness, 
                blockHeight, 
                { 
                    isStatic: true, 
                    render: { fillStyle: color }
                }
            );
            
            wallBlocks.push(block);
        }
    
        // Add the blocks to the world
        Composite.add(engine.world, wallBlocks);
    }
  
    function createWalls()
    {
          const wallColor = '#34d2eb'
              // Create ground composite that surrounds the canvas
          const ground = Composite.create();
  
          // Create the four walls (edges) of the canvas
          const wallThickness = 10; // Thickness of walls

          createDashedWall(0, true); // Left wall
            createDashedWall(canvasWidth, false); // Right wall
  
          // Left wall
          //const leftWall = Bodies.rectangle(0, canvasHeight / 2 - 200, wallThickness, canvasHeight, { isStatic: true,  render: { fillStyle: wallColor }});
          // Right wall
          ///const rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2 - 200, wallThickness, canvasHeight, { isStatic: true , render: { fillStyle: wallColor } });
          // Top wall
          const topWall = Bodies.rectangle(canvasWidth / 2, 500, canvasWidth, wallThickness, { label: 'topWall', isStatic: true, render: { fillStyle: wallColor } });
          // Bottom wall
          const bottomWall = Bodies.rectangle(canvasWidth / 2, simulation_height, canvasWidth, wallThickness, { isStatic: true, render: { fillStyle: wallColor } });
  
          // Add the walls to the ground composite
          Composite.add(ground, [topWall, bottomWall]);
  
          Composite.add(engine.world, ground);
    }

    function calculateDistanceToGround(ragdoll, groundY) {
        var leftFootY = ragdoll.bodies.find(body => body.label === 'leftLowerLeg').position.y;
        var rightFootY = ragdoll.bodies.find(body => body.label === 'rightLowerLeg').position.y;
        
        // Get the lowest y-coordinate of both feet
        var lowestY = Math.max(leftFootY, rightFootY);
        
        // Calculate the distance from the bottom of the ragdoll to the ground
        var distanceToGround = groundY - lowestY;
        
        return distanceToGround;
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
          render: {
            sprite: {
              texture: '/assets/head.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      }, options);
      
      var chestOptions = Common.extend({
          label: 'chest',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
          },
          render: {
            sprite: {
              texture: '/assets/body.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      }, options);
      
      var leftArmOptions = Common.extend({
          label: 'leftUpperArm',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: 10 * scale
          },
          render: {
            sprite: {
              texture: '/assets/leftUpperArm.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      }, options);
      
      var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
          label: 'leftLowerArm',
          render: {
            sprite: {
              texture: '/assets/leftLowerArm.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      });
      
      var rightArmOptions = Common.extend({
          label: 'rightUpperArm',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: 10 * scale
          },
          render: {
            sprite: {
              texture: '/assets/rightUpperArm.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      }, options);
      
      var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
          label: 'rightLowerArm',
          render: {
            sprite: {
              texture: '/assets/rightLowerArm.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      });
      
      var leftLegOptions = Common.extend({
          label: 'leftUpperLeg',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: 10 * scale
          },
          render: {
            sprite: {
              texture: '/assets/leftUpperLeg.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      }, options);
      
      var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
          label: 'leftLowerLeg',
          render: {
            sprite: {
              texture: '/assets/leftLowerLeg.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      });
      
      var rightLegOptions = Common.extend({
          label: 'rightUpperLeg',
          collisionFilter: {
              group: Body.nextGroup(true)
          },
          chamfer: {
              radius: 10 * scale
          },
          render: {
            sprite: {
              texture: '/assets/rightUpperLeg.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
      }, options);
      
      var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
          label: 'rightLowerLeg',
          render: {
            sprite: {
              texture: '/assets/rightLowerLeg.png', // Path to the image
              xScale: 0.35,  // Scale the image based on the width of the rectangle
              yScale: 0.35   // Scale the image based on the height of the rectangle
            }
          }
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
            render: {
                sprite: {
                  texture: '/assets/bill/head.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            },
            depth: 2 // Custom Z-index (lower is behind)
        }, options);
        
        var chestOptions = Common.extend({
            label: 'chest',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
            },
            render: {
                sprite: {
                  texture: '/assets/bill/body.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            },
            depth: 1 // Custom Z-index (lower is behind)
        }, options);
        
        var leftArmOptions = Common.extend({
            label: 'leftUpperArm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                sprite: {
                  texture: '/assets/bill/leftUpperArm.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            },
            depth: 0 // Custom Z-index (lower is behind)
        }, options);
        
        var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
            label: 'leftLowerArm',
            render: {
                sprite: {
                  texture: '/assets/bill/leftLowerArm.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            },
            depth: 0 // Custom Z-index (lower is behind)
        });
        
        var rightArmOptions = Common.extend({
            label: 'rightUpperArm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                sprite: {
                  texture: '/assets/bill/rightUpperArm.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            }
        }, options);
        
        var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
            label: 'rightLowerArm',
            render: {
                sprite: {
                  texture: '/assets/bill/rightLowerArm.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            }
        });
        
        var leftLegOptions = Common.extend({
            label: 'leftUpperLeg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                sprite: {
                  texture: '/assets/bill/leftUpperLeg.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            }
        }, options);
        
        var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
            label: 'leftLowerLeg',
            render: {
                sprite: {
                  texture: '/assets/bill/leftLowerLeg.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            }
        });
        
        var rightLegOptions = Common.extend({
            label: 'rightUpperLeg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                sprite: {
                  texture: '/assets/bill/rightUpperLeg.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            }
        }, options);
        
        var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
            label: 'rightLowerLeg',
            render: {
                sprite: {
                  texture: '/assets/bill/rightLowerLeg.png', // Path to the image
                  xScale: 0.4,  // Scale the image based on the width of the rectangle
                  yScale: 0.4   // Scale the image based on the height of the rectangle
                }
            }
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
  
    Events.on(engine, 'afterUpdate', () => {
      //updateImageCar(car);
      followCombinedBody(person);
      var distanceToGround = parseInt(calculateDistanceToGround(person, simulation_height)/100);

      const distanceElement = document.getElementById('distance');
      distanceElement.textContent = `Distance to Ground: ${distanceToGround} m`;  // Update the text with the distance value
    });
  

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {

            // Remove the top wall from the world if it's enabled
            const body = Composite.allBodies(engine.world).find(body => body.label === "topWall");
            if (body) {
                body.isSensor = true;  // Set isSensor to true
                body.collisionFilter = {
                    group: 1,  // Put the body in a separate collision group (group 1 or another number)
                    category: 0x0001,  // This can be any category (we're using 0x0001 as an example)
                    mask: 0x0000  // Set mask to 0 to prevent collisions with any body
                };
                body.render.fillStyle = '#00000000';  // Set the fill color to transparent
                
            } else {
                console.log(` not found.`);
            }
    
        }
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