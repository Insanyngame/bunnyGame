// Start server
// python3 -m http.server 8080

kaboom({
    background: [130, 130, 150],
    width: 800,
    height: 600,
    canvas: document.getElementById("cv"),
    letterbox: true,
    debug: true
});

function loadAllSprites() {
    loadSprite("bunnyWhiteIdle", "src/bunnyWhiteIdle.png", {
        sliceX: 3,
        sliceY: 4,
        anims: {
            anim: { from: 0, to: 11, loop: true },
        },
    });
    loadSprite("bunnyWhiteRun", "src/bunnyWhiteRun.png", {
        sliceX: 4,
        sliceY: 2,
        anims: {
            anim: { from: 0, to: 7, loop: true },
        },
    });
    ["bg", "carrot", "bush"].forEach(e => loadSprite(e, "src/"+e+".png"));
    // loadSprite("bg", "src/bg.png");
    loadSprite("tile", "src/tiles.png", {
        sliceX: 5,
        sliceY: 3,
        anims: {
            tl: { from: 0,  to: 0  },
            t:  { from: 1,  to: 1  },
            tr: { from: 2,  to: 2  },
            bl: { from: 3,  to: 3  },
            b:  { from: 4,  to: 4  },
            br: { from: 5,  to: 5  },
            r:  { from: 6,  to: 6  },
            _tr:{ from: 7,  to: 7  },
            _tl:{ from: 8,  to: 8  },
            _:  { from: 9,  to: 9 },
            _br:  { from: 10,  to: 10 },
            _bl:  { from: 11,  to: 11 },
            l:  { from: 12,  to: 12 },
        }
    })
}

loadAllSprites();

scene("win", () => {
    
})

// scene GAME
scene("game", (level) => {

const CollisionTileSize = 40;
const TotalDashCooldown = 8;
const TileSize = 32;
const RequiredCarrots = [1, 2, 1, 3, -1];
let gamePaused = false;

let startingPos = {x: 3, y: -2};

if(RequiredCarrots[level] == -1) go("win");
console.log(RequiredCarrots[level]);

let levelsTile = [
    [
        "   p                       ",
        "                           ",
        "                           ",
        "                           ",
        "                           ",
        "                           ",
        "                           ",
        "   ..                 c    ",
        "  .....  ...  ..     ...   ",
        "  ..........  ...    ...   ",
        "   ..............    ..    ",
        "   ....................    ",
        "   ....................    ",
        "                           "
    ], // 0
    [
        "        p                  ",
        "                           ",
        "                           ",
        "                           ",
        " c                      c  ",
        "   ....................    ",
        "   ....................    ",
        "                           ",
    ], // 1
    [
        "                           ",
        "    p                      ",
        "                           ",
        "                           ",
        "        *     **     c     ",
        "   ....................    ",
        "   ....................    ",
        "                           "
    ], // 2
    [
        "                                          ",
        "                                          ",
        "                                          ",
        "                                          ",
        "                                          ",
        "                                          ",
        "    p                                     ",
        "                                          ",
        "                                          ",
        "   ...                                    ",
        "   ...    ..                              ",
        "      *** ..                              ",
        "      ...     **** ..                     ",
        "              .... ..                     ",
        "                             ..           ",
        "                             ..           ",
        "                                          ",
        "                              c           ",
        "                             ..           ",
        "                             ..           ",
        "                                          ",
        "      ..                ..                ",
        "      .....             ..                ",
        "      ..... ..                            ",
        "  c         ....     c                    ",
        "  ..        ....     ..                   ",
        "  ..                 ..                   ",
        "                                          ",
        "                                          ",
        "                                          "
    ], // 3
    [
        "                                          ",
        "               c                          ",
        "              .....                       ",
        "              .....   ..                  ",
        "                      ..                  ",
        "                                          ",
        "    p                          c          ",
        "                         b                ",
        "                 ...    .....             ",
        "   ...........   ...    .....             ",
        "   ...........                            ",
        "                                          ",
        "                                          ",
        "                                          "
    ],
    []
]

function loadLevel() {
    for (let row = 0; row < levelsTile[level].length; row++) {
        for (let c = 0; c < levelsTile[level][row].length; c++) {
            // solid block
            if(levelsTile[level][row][c] == '.') {
                let tb = "", lr = "";
                if(levelsTile[level][row-1][c] != '.') tb = "t";
                if(levelsTile[level][row+1][c] != '.') tb = "b";
                if(levelsTile[level][row][c-1] != '.') lr = "l";
                if(levelsTile[level][row][c+1] != '.') lr = "r";
                if(tb + lr == "") {
                    tb = "_";
                    if(levelsTile[level][row-1][c-1] != '.') lr = "tl";
                    if(levelsTile[level][row-1][c+1] != '.') lr = "tr";
                }
                addColliding({
                    x: c*TileSize, y: row*TileSize,
                    width: TileSize, height: TileSize,
                    tg: "solid"
                })
                add([
                    pos(c*TileSize, row*TileSize),
                    sprite("tile"),
                    scale(2),
                ]).play(tb+lr);
                
            }
            // carrot
            if(levelsTile[level][row][c] == 'c') {
                addColliding({
                    x: c*TileSize, y: row*TileSize,
                    width: TileSize, height: TileSize,
                    tg: "carrot",
                    sprObj: add([
                        pos(c*TileSize, row*TileSize),
                        sprite("carrot"),
                        scale(2),
                        z(2)
                    ])
                })
            }
            // bush
            if(levelsTile[level][row][c] == '*') {
                addColliding({
                    x: c*TileSize, y: row*TileSize,
                    width: TileSize, height: TileSize,
                    tg: "kill"
                })
                add([
                    pos(c*TileSize, row*TileSize),
                    sprite("bush"),
                    scale(2),
                    z(2)
                ])
            }

            // player
            if(levelsTile[level][row][c] == 'p') {
                startingPos.x = c, startingPos.y = row;
            }
        }
    }

    if(level == 0) {
        add([
            pos(32, 50),
            text("WASD or arrows to move.\nYou are a bunny, so you will only move by jumping.\nCollect one carrot to win.", {size: 12}),
            color(BLACK)
        ])
        add([
            pos(600, 82),
            text("Hold Z to jump farther.", {size: 12}),
            color(BLACK)
        ])
    }
    if(level == 1) {
        add([
            pos(32, 50),
            text("Collect two carrots to win.", {size: 12}),
            color(BLACK)
        ])
    }
    if(level == 2) {
        add([
            pos(32, 50),
            text("Avoid deadly, dangerous, unsafe, hazardous, lethal, toxic, poisonous and venomous wild bushes.\nCollect one carrot to win.", {size: 12}),
            color(BLACK)
        ])
    }
}

loadLevel(0);

let player = add([
    rect(40, 24),
    pos(startingPos.x*TileSize, startingPos.y*TileSize),
    opacity(0),
    {
        w: 40,
        h: 24,
        velX: 0,
        velY: 0,
        moveVelX: 0,
        dashCd: 0,
        collectedCarrots: 0,
        bunnyColor: "White"
    }
])

let playerSpr = add([
    pos(0, 0),
    sprite("bunnyWhiteIdle"),
    scale(2),
    {
        sprite: "bunnyWhiteIdle",
        face: 0, // (0 é direita, 1 é esquerda, msm q o flipX)
        ofs: {
            x: -10, y: -40
        }
    } 
])

playerSpr.play("anim", {speed: 4});

function areRectanglesColliding(rect1, rect2) {
    let noHorizontalOverlap = rect1.pos.x + rect1.w <= rect2.pos.x || rect2.pos.x + rect2.w <= rect1.pos.x;
    let noVerticalOverlap = rect1.pos.y + rect1.h <= rect2.pos.y || rect2.pos.y + rect2.h <= rect1.pos.y;
    return !(noHorizontalOverlap || noVerticalOverlap);
}

function collidingCarrot(obj1) {
    let objToCheck = [];
    objToCheck = get("carrot");

    let returnVal = false;

    objToCheck.forEach((obj2) => {
        if(areRectanglesColliding(obj1, obj2)) returnVal = obj2;
    })

    return returnVal;
}

function isCollidingKillBlock(obj1) {
    let objToCheck = [];

    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            objToCheck = objToCheck.concat(get(`inPos${parseInt(obj1.pos.x/CollisionTileSize)+i}/${parseInt(obj1.pos.y/CollisionTileSize)+j}`));
        }
    }

    let returnVal = false;

    objToCheck.forEach((obj2) => {
        if(obj2.is("kill") && areRectanglesColliding(obj1, obj2)) returnVal = true;
    })

    return returnVal;

}

function isCollidingSolid(obj1) {
    let objToCheck = [];

    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            objToCheck = objToCheck.concat(get(`inPos${parseInt(obj1.pos.x/CollisionTileSize)+i}/${parseInt(obj1.pos.y/CollisionTileSize)+j}`));
        }
    }

    let returnVal = false;

    objToCheck.forEach((obj2) => {
        if(obj2.is("solid") && areRectanglesColliding(obj1, obj2)) returnVal = true;
    })

    return returnVal;

}

function collidingList(obj1, rotated = false) {
    let returnVal = [];
    let objToCheck = [];

    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            objToCheck = objToCheck.concat(get(`inPos${parseInt(obj1.pos.x/CollisionTileSize)+i}/${parseInt(obj1.pos.y/CollisionTileSize)+j}`));
        }
    }

    objToCheck.forEach((obj2) => {
        if(!rotated) if(obj2.is("solid") && areRectanglesColliding(obj1, obj2)) returnVal.push(obj2);

        if(rotated) if(obj2.is("solid") && areRectanglesCollidingRotate(obj1, obj2)) returnVal.push(obj2);
    })
    return returnVal;
}

function collidingListId(obj1) {
    let returnVal = [];
    let objToCheck = [];

    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            objToCheck = objToCheck.concat(get(`inPos${parseInt(obj1.pos.x/CollisionTileSize)+i}/${parseInt(obj1.pos.y/CollisionTileSize)+j}`));
        }
    }
    objToCheck.forEach((obj2) => {
        if(obj2.is("solid") && areRectanglesColliding(obj1, obj2)) returnVal.push(obj2.id);
    })
    return returnVal;
}

function addColliding(obj) {
    let o = add([
        rect(obj.width, obj.height),
        pos(obj.x, obj.y),
        area(),
        opacity(0),
        {
            w: obj.width,
            h: obj.height,
        },
        obj.tg
    ])
    if(obj.sprObj) o.sprObj = obj.sprObj;
    for(let posX = parseInt(obj.x/CollisionTileSize); posX <= parseInt((obj.x+obj.width)/CollisionTileSize); posX++) {
        for(let posY = parseInt(obj.y/CollisionTileSize); posY <= parseInt((obj.y+obj.height)/CollisionTileSize); posY++) {
            o.use(`inPos${posX}/${posY}`);
        }
    }
    return o;
}

function isGrounded(obj) {
    let beforeCollideId = collidingListId(obj);
    player.pos.y += 1;
    let afterCollideId = collidingListId(obj);
    let newCollisions = false;

    afterCollideId.forEach(o => {
        if(!beforeCollideId.includes(o)) {
            newCollisions = true;
        }
    })
    player.pos.y -= 1;
    return newCollisions;
}

addColliding({
    x: -1000, y: TileSize*(levelsTile[level].length+2),
    width: TileSize*(levelsTile[level][0].length+2)+2000, height: 100,
    tg: "kill"
})

function flipPlayerSpr(flip) {
    playerSpr.stop();
    let spr = playerSpr.sprite;
    console.log(playerSpr.sprite);
    playerSpr.use(sprite(spr, {flipX: flip}));
    playerSpr.play("anim");
    playerSpr.face = flip;
}
// flipPlayerSpr(true);

function getVelocities() {
    // gravity
    if(isKeyDown("up") || isKeyDown("w")) player.velY = Math.min(player.velY + 1.5, 36);
    else player.velY = Math.min(player.velY + 3, 36);

    player.dashCd = Math.max(player.dashCd-1, 0);

    // inercia
    if(isGrounded(player)) {
        if(Math.abs(player.velX) < 2) player.velX = 0;
        else player.velX = (player.velX * 0.75);
    } else {
        if(Math.abs(player.velX) < 2) player.velX = 0;
        else player.velX = (player.velX * 0.95);
    }

    if(isGrounded(player) && (isKeyDown('w') || isKeyDown('up'))) {
        player.velY -= 15;
    }

    let moveVelX = 0;
    if(!isGrounded(player)) {
        if(isKeyDown("left") || isKeyDown("a")) moveVelX -= 6;
        if(isKeyDown("right") || isKeyDown("d")) moveVelX += 6;
    
        if(player.velX > -6 && moveVelX == -6) player.velX = Math.max(player.velX + moveVelX, -6);
        if(player.velX < 6 && moveVelX == 6) player.velX = Math.min(player.velX + moveVelX, 6);
    } else if(isKeyDown("z") && player.dashCd == 0 && (isKeyDown("up") || isKeyDown("w"))) {
        if(isKeyDown("left") || isKeyDown("e")) moveVelX -= 18;
        if(isKeyDown("right") || isKeyDown("d")) moveVelX += 18;
        player.dashCd = TotalDashCooldown;
    
        if(player.velX > -18 && moveVelX == -18) player.velX = Math.max(player.velX + moveVelX, -18);
        if(player.velX < 18 && moveVelX == 18) player.velX = Math.min(player.velX + moveVelX, 18);
    }
}

function movePlayer() {
    let beforeCollideId = collidingListId(player);

    if(player.velY >= 0) {
        player.pos.y += player.velY;
        let afterCollideId = collidingListId(player);
        let afterCollide = collidingList(player);
        let newCollisions = [];

        afterCollideId.forEach(obj => {
            if(!beforeCollideId.includes(obj)) {
                newCollisions.push(obj);
            }
        })

        if(newCollisions.length > 0) player.velY = 0;

        afterCollide.forEach(obj => {
            if(newCollisions.includes(obj.id)) {
                player.pos.y = Math.min(player.pos.y, obj.pos.y - player.h);
            }
        })
    } else {
        player.pos.y += player.velY;
        let afterCollideId = collidingListId(player);
        let afterCollide = collidingList(player);
        let newCollisions = [];

        afterCollideId.forEach(obj => {
            if(!beforeCollideId.includes(obj)) {
                newCollisions.push(obj);
            }
        })

        if(newCollisions.length > 0) player.velY = 0;

        afterCollide.forEach(obj => {
            if(newCollisions.includes(obj.id)) {
                player.pos.y = Math.max(player.pos.y, obj.pos.y + obj.h);
            }
        })
    }

    if(player.velX >= 0) {
        player.pos.x += player.velX;
        let afterCollideId = collidingListId(player);
        let afterCollide = collidingList(player);
        let newCollisions = [];

        afterCollideId.forEach(obj => {
            if(!beforeCollideId.includes(obj)) {
                newCollisions.push(obj);
            }
        })

        if(newCollisions.length > 0) {
            player.velX = 0;
            movementVel = 0;
        }

        afterCollide.forEach(obj => {
            if(newCollisions.includes(obj.id)) {
                player.pos.x = Math.min(player.pos.x, obj.pos.x - player.w);
            }
        })
    } else {
        player.pos.x += player.velX;
        let afterCollideId = collidingListId(player);
        let afterCollide = collidingList(player);
        let newCollisions = [];

        afterCollideId.forEach(obj => {
            if(!beforeCollideId.includes(obj)) {
                newCollisions.push(obj);
            }
        })

        if(newCollisions.length > 0) {
            player.velX = 0;
            movementVel = 0;
        }

        afterCollide.forEach(obj => {
            if(newCollisions.includes(obj.id)) {
                player.pos.x = Math.max(player.pos.x, obj.pos.x + obj.w);
            }
        })
    }
}

function updateSprite() {
    if((player.velX != 0) && playerSpr.sprite == `bunny${player.bunnyColor}Idle`) {
        playerSpr.stop();

        playerSpr.use(sprite(`bunny${player.bunnyColor}Run`, {flipX: playerSpr.face}));
        playerSpr.play("anim", {speed: 12});

        playerSpr.sprite = `bunny${player.bunnyColor}Run`;
    }

    if((player.velX == 0) && playerSpr.sprite == `bunny${player.bunnyColor}Run`) {
        playerSpr.stop();

        playerSpr.use(sprite(`bunny${player.bunnyColor}Idle`, {flipX: playerSpr.face}));
        playerSpr.play("anim", {speed: 3});

        playerSpr.sprite = `bunny${player.bunnyColor}Idle`;
    }

    if(player.velX != 0 && ((player.velX < 0) != playerSpr.face)) flipPlayerSpr(player.velX < 0);
}

function updateCarrots() {
    let carrot = collidingCarrot(player)
    if(carrot) {
        carrot.sprObj.destroy();
        carrot.destroy();
        player.collectedCarrots++;
        if(RequiredCarrots[level] == player.collectedCarrots) {
            go("game", level+1);
        }
        // gamePaused = true;
    }
}

let bg = add([
    sprite("bg"),
    pos(-800, -400),
    scale(8),
    z(-1)
])

function updateCamera() {
    let oldCam = camPos();
    let newPos = {x: player.pos.x + (playerSpr.face?-80:80), y: player.pos.y-80};
    camPos(oldCam.x + (newPos.x - oldCam.x)*0.2, oldCam.y + (newPos.y - oldCam.y)*0.2);
}

let pWasPressed = false;
function pauseControl() {
    if(isKeyDown("p") && !pWasPressed) {
        gamePaused = !gamePaused;
    }

    pWasPressed = isKeyDown("p");
}

let lastTime = performance.now();
let tick = 0;
loop(0.001, () => {
    // fps controlling (max 60 fps)
    let deltaTime = performance.now() - lastTime;
    if(deltaTime < 1000/60) return;
    lastTime = performance.now();
    tick++;
    tick %= 2;

    pauseControl();

    if(!gamePaused) {
        // player.pos.x += 6;
        if(tick %2 == 0) {
            getVelocities();
            movePlayer();
            updateCarrots();
            updateSprite();
            updateCamera();
        }

        if(isCollidingKillBlock(player)) go("game", level);

        playerSpr.pos.x = player.pos.x + playerSpr.ofs.x;
        playerSpr.pos.y = player.pos.y + playerSpr.ofs.y;
    }
})
})

go("game", 0);