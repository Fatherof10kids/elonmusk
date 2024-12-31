var Example = Example || {};

let canvasWidth = 1080
let canvasHeight = 1920

const stdDeviation = [8, 10]
const colorMatrix = ['15 -3', '30 -5']

Example.ragdoll = function() {
    var Engine = Matter.Engine,
        Events = Matter.Events,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Common = Matter.Common,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create({
        constraintIterations: 10,
        positionIterations: 10
      }),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 1080,  // Set the width to the window's inner width
            height: 1920,  // Set the height to the window's inner height
            showAngleIndicator: true,
            wireframes: false,
            background: '#00FF00'
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // Create ground (static body)
    var ground = Bodies.rectangle(
    1080 / 2,  // Position X (center of the screen)
    1920 - 400,  // Position Y (just above the bottom of the screen)
    1080,  // Width of the ground (full width of the screen)
    200,  // Height of the ground
    { isStatic: true, render: { fillStyle: '#3E823D' } }  // Make it static
    );

    let circles = []


    // create obstacles
    var obstacles = Composites.stack(300, 0, 15, 3, 10, 10, function(x, y, column) {
        var sides = Math.round(Common.random(1, 8)),
            options = {
                render: {
                    fillStyle: Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1'])
                }
            };

        switch (Math.round(Common.random(0, 1))) {
        case 0:
            if (Common.random() < 0.8) {
                return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), options);
            } else {
                return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), options);
            }
        case 1:
            return Bodies.polygon(x, y, sides, Common.random(25, 50), options);
        }
    });

    var ragdolls = Composite.create();

    for (var i = 0; i < 1; i += 1) {
        var ragdoll = Example.ragdoll.ragdoll(200, -1000 * i, 1.3);

        Composite.add(ragdolls, ragdoll);
    }

    Composite.add(world, [ground, obstacles, ragdolls]);

    function createLiquid() {
        const x = 105
        const y = 105
        const radius = randomNumBetween(6, 7)
        const body = Bodies.circle(x, y, radius, {
          friction: 0,
          density: 1,
          frictionAir: 0,
          restitution: 0.7,
          render: { fillStyle: '#fff' }
        })
        Body.applyForce(body, body.position, { x: 1, y: 0 })
        Composite.add(engine.world, body)
        circles.push(body)
      }

    function resizeFilter() {
        const feGaussianBlur = document.querySelector('#gooey feGaussianBlur')
        const feColorMatrix = document.querySelector('#gooey feColorMatrix')
        let index
        if (canvasWidth < 600) index = 0
        else index = 1
        feGaussianBlur.setAttribute('stdDeviation', stdDeviation[index])
        feColorMatrix.setAttribute('values', `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${colorMatrix[index]}`)
    }

    function randomNumBetween(min, max) {
    return Math.random() * (max - min) + min
    }

    document.addEventListener('DOMContentLoaded', function() {
    resizeFilter()
    });

    Events.on(runner, 'tick', e => {
        createLiquid()
        for (let i = circles.length - 1; i >= 0; i--) {
          if (circles[i].position.y - circles[i].circleRadius > canvasHeight) {
            Composite.remove(engine.world, circles[i])
            circles.splice(i, 1)
          }
        }
    })


    Events.on(engine, 'afterUpdate', function(event) {
        // var timeScale = (event.delta || (1000 / 60)) / 1000;
        engine.timing.timeScale = 1;

        // // tween the timescale for slow-mo
        // if (mouse.button === -1) {
        //     engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 3 * timeScale;
        // } else {
        //     engine.timing.timeScale = 1;
        // }

        // // every 2 sec (real time)
        // if (Common.now() - lastTime >= 2000) {
        //     // flip the timescale
        //     if (timeScaleTarget < 1) {
        //         timeScaleTarget = 1;
        //     } else {
        //         timeScaleTarget = 0.05;
        //     }

        //     // update last time
        //     lastTime = Common.now();
        // }

        for (i = 0; i < ragdolls.composites.length; i += 1) {
            var ragdoll = ragdolls.composites[i],
                bounds = Composite.bounds(ragdoll);

            // move ragdolls back to the top of the screen
            if (bounds.min.y > render.bounds.max.y + 100 || bounds.min.x > render.bounds.max.x) {
                Composite.translate(ragdoll, {
                    x: -bounds.min.x * 0.2,
                    y: -render.bounds.max.y - 200
                });
            }
        }

        // for (i = 0; i < obstacles.bodies.length; i += 1) {
        //     var body = obstacles.bodies[i],
        //         bounds = body.bounds;

        //     // move obstacles back to the top of the screen
        //     if (bounds.min.y > render.bounds.max.y + 100) {
        //         Body.translate(body, {
        //             x: -bounds.min.x,
        //             y: -render.bounds.max.y - 300
        //         });
        //     }
        // }
    });

    // add mouse control and make the mouse revolute
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.6,
                length: 0,
                angularStiffness: 0,
                render: {
                    visible: true
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 1080, y: 1290 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

Example.ragdoll.ragdoll = function(x, y, scale, options) {
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
                texture: '/assets/head.png',  // Use the image as the texture
                xScale: 0.3, // Scale the image
                yScale: 0.3,   // Scale the image
                yOffset: 0.12
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
                texture: '/assets/body.png',  // Use the image as the texture
                xScale: 0.35, // Scale the image
                yScale: 0.35,   // Scale the image
                yOffset: 0
            }
        }
    }, options);

    var leftArmOptions = Common.extend({
        label: 'left-arm',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var rightArmOptions = Common.extend({
        label: 'right-arm',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var leftLegOptions = Common.extend({
        label: 'left-leg',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var rightLegOptions = Common.extend({
        label: 'right-leg',
        collisionFilter: {
            group: Body.nextGroup(true)
        },
        chamfer: {
            radius: 10 * scale
        },
        render: {
            fillStyle: '#FFBC42'
        }
    }, options);

    var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
        render: {
            fillStyle: '#E59B12'
        }
    });

    var head = Bodies.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions);
    var chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
    var rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions);
    var rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions);
    var leftUpperArm = Bodies.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions);
    var leftLowerArm = Bodies.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions);
    var leftUpperLeg = Bodies.rectangle(x - 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, leftLegOptions);
    var leftLowerLeg = Bodies.rectangle(x - 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions);
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
};

Example.ragdoll.title = 'Ragdoll';
Example.ragdoll.for = '>=0.14.2';

if (typeof module !== 'undefined') {
    module.exports = Example.ragdoll;
}
