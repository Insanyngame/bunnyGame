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
    loadFont("pixel", "src/PixelifySans-SemiBold.ttf");
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
    loadSprite("bunnyGrayIdle", "src/bunnyGrayIdle.png", {
        sliceX: 3,
        sliceY: 4,
        anims: {
            anim: { from: 0, to: 11, loop: true },
        },
    });
    loadSprite("bunnyGrayRun", "src/bunnyGrayRun.png", {
        sliceX: 4,
        sliceY: 2,
        anims: {
            anim: { from: 0, to: 7, loop: true },
        },
    });
    loadSprite("bunnyYellowIdle", "src/bunnyYellowIdle.png", {
        sliceX: 3,
        sliceY: 4,
        anims: {
            anim: { from: 0, to: 11, loop: true },
        },
    });
    loadSprite("bunnyYellowRun", "src/bunnyYellowRun.png", {
        sliceX: 4,
        sliceY: 2,
        anims: {
            anim: { from: 0, to: 7, loop: true },
        },
    });
    ["bg", "carrot", "bush", "shield", "gold", "bunnyIcon"].forEach(e => loadSprite(e, "src/"+e+".png"));
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

    loadSound("fall", "src/fall.mp3");
}

loadAllSprites();

scene("win", () => {
    
})

async function enterScene() {
    let r = add([
        pos(0, 0),
        rect(800, 600),
        fixed(),
        color(BLACK),
        opacity(1),
        z(5)
    ])
    for(let i = 0; i < 10; i++) {
        r.opacity -= 0.1;
        await wait(0.05);
    }
    return;
}

async function exitScene() {
    let r = add([
        pos(0, 0),
        rect(800, 600),
        fixed(),
        color(BLACK),
        opacity(0),
        z(5)
    ])
    for(let i = 0; i < 10; i++) {
        r.opacity += 0.1;
        await wait(0.05);
    }
    return;
}

scene("home", async() => {
    add([
        sprite("bg"),
        pos(-100, -100),
        scale(3),
        color(160, 160, 160),
    ]);
    add([
        sprite("bunnyWhiteIdle"),
        pos(50, 50),
        scale(4)
    ])
    add([
        sprite("bunnyGrayIdle"),
        pos(50, 80),
        scale(4)
    ])
    add([
        sprite("bunnyYellowIdle"),
        pos(50, 110),
        scale(4)
    ])
    add([
        text("A small\nbunny game", {size: 96, font:"pixel"}),
        pos(200, 80),
        // anchor("left"),
    ])
    await enterScene();
    let playText = add([
        text("Play", {size: 24, font: "pixel"}),
        pos(850, 400),
        anchor("left")
    ])
    let levelText = add([
        text("Levels", {size: 24, font: "pixel"}),
        pos(850, 450),
        anchor("left")
    ])

    add([
        text("Arrow keys to select, z to confirm.", {size: 24, font:"pixel"}),
        pos(50, 550),
    ])

    async function addThings() {
        for(let i = 0; i < 20; i++) {
            playText.pos.x += (150 - playText.pos.x)*0.2;
            levelText.pos.x += (150 - levelText.pos.x)*0.2;
            await wait(0.05)
        }
    }
    await addThings();

    let gambiarra = true;
    onKeyPress("up", () => {
        gambiarra = !gambiarra;
    })
    onKeyPress("down", () => {
        gambiarra = !gambiarra;
    })
    onKeyPress("w", () => {
        gambiarra = !gambiarra;
    })
    onKeyPress("s", () => {
        gambiarra = !gambiarra;
    })

    onKeyPress("z", () => {
        exitScene().then(() => {
            if(gambiarra) go("game", 0);
            else go("levels");
        })
    })

    let selectIcon = add([
        sprite("bunnyIcon"),
        scale(2),
        pos(100, 390),
        anchor("left")
    ])
    loop(0.01, () => {
        if(gambiarra) selectIcon.pos.y = 390;
        else selectIcon.pos.y = 440;
    })

    // await addThings();
})

scene("levels", async() => {
    add([
        sprite("bg"),
        pos(-100, -100),
        scale(3),
        color(160, 160, 160),
    ]);
    add([
        text("Level Select", {size: 96, font:"pixel"}),
        pos(400, 80),
        anchor("top"),
    ])
    await enterScene();

    const amountOfLevels = 9;
    let levelBox = [];
    let levelNumber = [];

    for(let i = 0; i < amountOfLevels; i++) {
        levelBox.push(add([
            rect(48, 48),
            // border(10),
            outline(5, {color: rgb (250, 250, 250)}),
            // text(i+1, {size: 24}),
            pos(200+400/5*(i%5) + 600/20, 800 + parseInt(i/5)*100),
            anchor("center"),
            color(50, 50, 150)
        ]))
        levelNumber.push(add([
            text(i+1, {size: 24}),
            pos(200+400/5*(i%5) + 600/20, 800 + parseInt(i/5)*100),
            anchor("center"),
            z(2)
        ]))
    }

    async function addThings() {
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < amountOfLevels; j++) {
                levelBox[j].pos.y -= (levelBox[j].pos.y - (300 + parseInt(j/5)*100))*0.2;
                levelNumber[j].pos.y = levelBox[j].pos.y +2;
            }
            await wait(0.05)
        }
    }
    await addThings();

    add([
        text("Arrow keys to select, z to confirm.", {size: 24, font:"pixel"}),
        pos(50, 550),
    ])

    let selectedLevel = 0;
    levelBox[selectedLevel].use(color(100, 100, 250));

    let alreadySelected = false;

    onKeyPress("down", () => {
        if(alreadySelected) return;
        levelBox[selectedLevel].use(color(50, 50, 150));
        selectedLevel += 5;
        if(selectedLevel >= amountOfLevels) selectedLevel %=5;
        levelBox[selectedLevel].use(color(100, 100, 250));
    })
    onKeyPress("up", () => {
        if(alreadySelected) return;
        levelBox[selectedLevel].use(color(50, 50, 150));
        selectedLevel -= 5;
        if(selectedLevel < 0) selectedLevel += 5*(parseInt(amountOfLevels/5)+1);
        if(selectedLevel >= amountOfLevels) selectedLevel -= 5;
        levelBox[selectedLevel].use(color(100, 100, 250));
    })
    onKeyPress("right", () => {
        if(alreadySelected) return;
        levelBox[selectedLevel].use(color(50, 50, 150));
        selectedLevel++;
        if(selectedLevel >= amountOfLevels) selectedLevel = 0;
        levelBox[selectedLevel].use(color(100, 100, 250));
    })
    onKeyPress("left", () => {
        if(alreadySelected) return;
        levelBox[selectedLevel].use(color(50, 50, 150));
        selectedLevel--;
        if(selectedLevel < 0) selectedLevel = amountOfLevels-1;
        levelBox[selectedLevel].use(color(100, 100, 250));
    })

    onKeyPress("z", () => {
        alreadySelected = true;
        levelBox[selectedLevel].use(color(0, 0, 50));
        exitScene().then(() => go("game", selectedLevel));
    })
})

// scene GAME
scene("game", async(level) => {
// await enterScene();

const CollisionTileSize = 40;
const TotalDashCooldown = 8;
const TileSize = 32;
const RequiredCarrots = [1, 2, 1, 3, 1, 1, 1, 1, 4, -1];
const TextSize = 18;
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
        "   p                       ",
        "   s                       ",
        "                           ",
        "                           ",
        "                           ",
        "                           ",
        "                           ",
        "   ..                 c    ",
        "  ....               ...   ",
        "  ....               ...   ",
        "   ...   **          ..    ",
        "   ....................    ",
        "   ....................    ",
        "                           "
    ], // 4
    [
        "                                          ",
        "               c                          ",
        "              .....                       ",
        "              .....   ..                  ",
        "                      ..        *         ",
        "                               ..         ",
        "    p                          ..         ",
        "                         s                ",
        "         *       ...    .....             ",
        "   ...........   ...    .....             ",
        "   ...........                            ",
        "                                          ",
        "                                          ",
        "                                          "
    ], // 5
    [
        "                                         ",
        "                                         ",
        "                                         ",
        "                                         ",
        "                                         ",
        "                                         ",
        "     p                                   ",
        "     g                                   ",
        "                                         ",
        "   .............          .....          ",
        "   .............          .....          ",
        "                                         ",
        "                             c           ",
        "                                         "
    ], // 6
    [
        "                                         ",
        "                                         ",
        "                                         ",
        "                                         ",
        "                                         ",
        "                                         ",
        "     p                                   ",
        "                                         ",
        "          *   g              c           ",
        "   .............          .....          ",
        "   .............          .....          ",
        "                                         ",
        "                                         ",
        "                                         "
    ], // 7
    [
        "                                                      ",
        "                                                      ",
        "                                                      ",
        "                                          ***         ",
        "                                   c                  ",
        "                                  .....       c       ",
        "     p                            .....    ....       ",
        "                                           ....       ",
        "         g  c               s c                       ",
        "   .............          .....                       ",
        "   .............          .....                       ",
        "                                                      ",
        "                                                      ",
        "                                                      "
    ], // 8
    [[]]
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
                    z(2)
                ])
            }

            // shield
            if(levelsTile[level][row][c] == 's') {
                let a = addColliding({
                    x: c*TileSize, y: row*TileSize,
                    width: TileSize, height: TileSize,
                    tg: "shield",
                    sprObj: add([
                        pos(c*TileSize, row*TileSize),
                        sprite("shield"),
                        z(2)
                    ])
                })
                if(level == 4) a.sprObj.use(opacity(0));
            }
            // gold
            if(levelsTile[level][row][c] == 'g') {
                let a = addColliding({
                    x: c*TileSize, y: row*TileSize,
                    width: TileSize, height: TileSize,
                    tg: "gold",
                    sprObj: add([
                        pos(c*TileSize, row*TileSize),
                        sprite("gold"),
                        z(2)
                    ])
                })
                if(level == 6) a.sprObj.use(opacity(0));
            }

            // player
            if(levelsTile[level][row][c] == 'p') {
                startingPos.x = c, startingPos.y = row;
            }
        }
    }
    let textColor = WHITE;
    if(level == 0) {
        add([
            pos(32, 50),
            text("WASD or arrows to move.\nYou are a bunny, so you will only move by jumping.\nCollect one carrot to win.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
        add([
            pos(450, 100),
            text("Hold z(or the left button of your mouse) to jump farther.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
    if(level == 1) {
        add([
            pos(32, 50),
            text("If you ever get tired of playing, you can press ESC to go back to starting screen.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
    if(level == 2) {
        add([
            pos(32, 50),
            text("Avoid deadly, dangerous, unsafe, hazardous, lethal, toxic, poisonous and venomous wild bushes.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
    if(level == 3) {
        add([
            pos(32, 150),
            text("If you want, go see the source code on github!\nhttps://insanyngame.github.io/bunnyGame", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
    if(level == 4) {
        add([
            pos(32, 150),
            text("Scared!\nGetting scared will make you jump higher.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
    if(level == 5) {
        add([
            pos(500, 150),
            text("Is that a shield?\nBunnies are afraid of weapons!\nCollecting the shield will make the bunny scared.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
        add([
            pos(650, 320),
            text("Tip: If you hold up key, you can jump higher.\nThe opposite is also true.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
    if(level == 6) {
        add([
            pos(32, 150),
            text("Greedy, always trying to find new things!\nGetting greedy will make you move faster.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
    if(level == 7) {
        add([
            pos(32, 150),
            text("Gold coins make you greedy.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
    if(level == 8) {
        add([
            pos(32, 150),
            text("Be careful!\nCollecting carrots give you a snap back to reality\nmaking you stop being scared or greedy.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
        add([
            pos(1000, 50),
            text("Try going to the very edge without falling\nand then jumping forward, you will not receive any boost upward.", {size: TextSize, font: "pixel"}),
            color(textColor)
        ])
    }
}

loadLevel();

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
        bunnyColor: "White",
        playingFallSound: false
    }
])

let playerSpr = add([
    pos(player.pos.x + -10, player.pos.y + -40),
    sprite(`bunny${player.bunnyColor}Idle`),
    scale(2),
    {
        sprite: `bunny${player.bunnyColor}Idle`,
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

function collidingShield(obj1) {
    let objToCheck = [];
    objToCheck = get("shield");

    let returnVal = false;

    objToCheck.forEach((obj2) => {
        if(areRectanglesColliding(obj1, obj2)) returnVal = obj2;
    })

    return returnVal;
}

function collidingGold(obj1) {
    let objToCheck = [];
    objToCheck = get("gold");

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
const CorneringAmount = 10;

function isCorneringRight(obj) {
    if(!isGrounded(obj)) return false;
    let res = false;
    player.pos.x += CorneringAmount;
    if(!isGrounded(obj)) res = true;
    player.pos.x -= CorneringAmount;
    return res;
}

function isCorneringLeft(obj) {
    if(!isGrounded(obj)) return false;
    let res = false;
    player.pos.x -= CorneringAmount;
    if(!isGrounded(obj)) res = true;
    player.pos.x += CorneringAmount;
    return res;
}

function getVelocities() {
    // if (isCornering(player))debug.log(isCornering(player));
    // gravity
    if(isKeyDown("up") || isKeyDown("w")) player.velY = Math.min(player.velY + 2, 36);
    else player.velY = Math.min(player.velY + 4, 36);

    player.dashCd = Math.max(player.dashCd-1, 0);

    // inercia
    if(isGrounded(player)) {
        if(Math.abs(player.velX) < 2) player.velX = 0;
        else player.velX = (player.velX * 0.75);
    } else {
        if(Math.abs(player.velX) < 2) player.velX = 0;
        else player.velX = (player.velX * 0.95);
    }

    let velXBoost = 6;
    if(player.bunnyColor == "Yellow") velXBoost = 12;

    let velYBoost = 20;
    if(player.bunnyColor == "Gray") velYBoost = 25;
    if(isGrounded(player) && (isKeyDown("w") || isKeyDown("up"))) {
        // debug.log(isCorneringLeft + " " + isCorneringRight)
        if(!((isCorneringLeft(player) && (isKeyDown("a") || isKeyDown("left"))) || (isCorneringRight(player) && (isKeyDown("d") || isKeyDown("right"))))) player.velY -= velYBoost;
        else velXBoost += 6;
    }

    let moveVelX = 0;
    if(!isGrounded(player)) {
        if(isKeyDown("left") || isKeyDown("a")) moveVelX -= velXBoost;
        if(isKeyDown("right") || isKeyDown("d")) moveVelX += velXBoost;
    
        if(player.velX > -velXBoost && moveVelX == -velXBoost) player.velX = Math.max(player.velX + moveVelX, -velXBoost);
        if(player.velX < velXBoost && moveVelX == velXBoost) player.velX = Math.min(player.velX + moveVelX, velXBoost);
    } else if((isKeyDown("z") || isMouseDown()) && player.dashCd == 0 && (isKeyDown("up") || isKeyDown("w"))) {
        if(isKeyDown("left") || isKeyDown("a")) moveVelX -= 3*velXBoost;
        if(isKeyDown("right") || isKeyDown("d")) moveVelX += 3*velXBoost;
        player.dashCd = TotalDashCooldown;
    
        if(player.velX > -3*velXBoost && moveVelX == -3*velXBoost) player.velX = Math.max(player.velX + moveVelX, -3*velXBoost);
        if(player.velX < 3*velXBoost && moveVelX == 3*velXBoost) player.velX = Math.min(player.velX + moveVelX, 3*velXBoost);
    }
}

function movePlayer() {
    let beforeCollideId = collidingListId(player);

    if(player.velY >= 0) {
        let wasGrounded = isGrounded(player);
        player.pos.y += player.velY;
        let afterCollideId = collidingListId(player);
        let afterCollide = collidingList(player);
        let newCollisions = [];

        afterCollideId.forEach(obj => {
            if(!beforeCollideId.includes(obj)) {
                newCollisions.push(obj);
            }
        })

        if(newCollisions.length > 0) {
            player.velY = 0;
        }

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

        if(newCollisions.length > 0) {
            player.velY = 0;
        }

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

function updatePowerUp() {
    let carrot = collidingCarrot(player);
    let shield = collidingShield(player);
    let gold = collidingGold(player);

    if(carrot) {
        player.bunnyColor = "White";
        
        if(playerSpr.sprite.includes("Run")) {
            playerSpr.sprite = `bunny${player.bunnyColor}Run`;
            playerSpr.use(sprite(`bunny${player.bunnyColor}Run`, {flipX: playerSpr.face}));
            playerSpr.play("anim", {speed: 12});
            // debug.log(playerSpr.face);
        } else {
            playerSpr.sprite = `bunny${player.bunnyColor}Idle`;
            playerSpr.use(sprite(`bunny${player.bunnyColor}Idle`, {flipX: playerSpr.face}));
            playerSpr.play("anim", {speed: 3});
        }
        carrotCounter[player.collectedCarrots].unuse("color");
        let sprPos = carrot.sprObj.pos;
        carrot.sprObj.destroy();
        carrot.destroy();
        player.collectedCarrots++;
        if(RequiredCarrots[level] == player.collectedCarrots) {
            gamePaused = true;
            add([
                pos(sprPos.x, sprPos.y),
                sprite("carrot"),
                scale(2),
                z(6)
            ])
            exitScene().then(() => {
                go("game", level+1);
            })
        }
    } else if(shield) {
        player.bunnyColor = "Gray";
        
        if(playerSpr.sprite.includes("Run")) {
            playerSpr.sprite = `bunny${player.bunnyColor}Run`;
            playerSpr.use(sprite(`bunny${player.bunnyColor}Run`, {flipX: playerSpr.face}));
            playerSpr.play("anim", {speed: 12});
        } else {
            playerSpr.sprite = `bunny${player.bunnyColor}Idle`;
            playerSpr.use(sprite(`bunny${player.bunnyColor}Idle`, {flipX: playerSpr.face}));
            playerSpr.play("anim", {speed: 3});
        }
        shield.sprObj.destroy();
        shield.destroy();
    } else if(gold) {
        player.bunnyColor = "Yellow";
        
        if(playerSpr.sprite.includes("Run")) {
            playerSpr.sprite = `bunny${player.bunnyColor}Run`;
            playerSpr.use(sprite(`bunny${player.bunnyColor}Run`, {flipX: playerSpr.face}));
            playerSpr.play("anim", {speed: 12});
        } else {
            playerSpr.sprite = `bunny${player.bunnyColor}Idle`;
            playerSpr.use(sprite(`bunny${player.bunnyColor}Idle`, {flipX: playerSpr.face}));
            playerSpr.play("anim", {speed: 3});
        }
        gold.sprObj.destroy();
        gold.destroy();
    }
    bg.use(color(bg[player.bunnyColor][0], bg[player.bunnyColor][1], bg[player.bunnyColor][2]))
}

let bg = add([
    sprite("bg"),
    pos(-800, -600),
    scale(8),
    color(160, 160, 160),
    z(-1),
    {
        White: [160, 160, 160],
        Gray: [100, 100, 100],
        Yellow: [160, 160, 100]
    }
])

if(level == 4) bg.use(color(bg.Gray[0], bg.Gray[1], bg.Gray[2]));
if(level == 6) bg.use(color(bg.Yellow[0], bg.Yellow[1], bg.Yellow[2]));

playerSpr.opacity = 0;
camPos(player.pos.x + (playerSpr.face?-80:80), player.pos.y+100)
await enterScene();
playerSpr.opacity = 1;

function fallingEffect() {
    if(!player.playingFallSound) {
        play("fall");
        player.playingFallSound = true;
        wait(0.02).then(() => {
            player.playingFallSound = false;
        })
    }
}

function updateCamera() {
    let oldCam = camPos();
    let newPos = {x: player.pos.x + (playerSpr.face?-80:80), y: player.pos.y-80};
    camPos(oldCam.x + (newPos.x - oldCam.x)*0.2, oldCam.y + (newPos.y - oldCam.y)*0.2);
}

let carrotCounter = []
function addCarrotCounter () {
    for(let i = 0; i < RequiredCarrots[level]; i++) {
        carrotCounter.push(
            add([
                pos(16+i*TileSize, 16),
                scale(2),
                sprite("carrot"),
                color(150, 150, 150),
                fixed()
            ])
        )
    }
}

addCarrotCounter();

let pWasPressed = false;
function pauseControl() {
    if(isKeyDown("p") && !pWasPressed) {
        gamePaused = !gamePaused;
    }

    pWasPressed = isKeyDown("p");
}

function exitControl() {
    if(isKeyDown("escape")) {
        gamePaused = true;
        exitScene().then(() => go("home"))
    }
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

    // pauseControl();
    exitControl();
    if(!gamePaused) {
        // player.pos.x += 6;
        if(tick %2 == 0) {
            let lastVelY = player.velY;
            getVelocities();
            movePlayer();
            if(lastVelY > 0 && player.velY <= 0) fallingEffect();
            updatePowerUp();
            updateSprite();
            updateCamera();
        }

        if(isCollidingKillBlock(player)) {
            gamePaused = true;
            exitScene().then(() => go("game", level))
        }

        playerSpr.pos.x = player.pos.x + playerSpr.ofs.x;
        playerSpr.pos.y = player.pos.y + playerSpr.ofs.y;
    }
})
})

go("home");