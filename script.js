// Start server
// python -m http.server 8080

kaboom({
    background: [130, 130, 150],
    width: 800,
    height: 600,
    canvas: document.getElementById("cv"),
    letterbox: true,
    debug: true,
    // scale: 2
});

function loadAllSprites() {
    loadSprite("bunnyIdle", "src/bunnyIdle.png", {
        sliceX: 3,
        sliceY: 4,
        anims: {
            anim: { from: 0, to: 11, loop: true },
        },
    });
    loadSprite("bunnyRun", "src/bunnyRun.png", {
        sliceX: 4,
        sliceY: 2,
        anims: {
            anim: { from: 0, to: 7, loop: true },
        },
    });
    loadSprite("bg", "src/bg.png");
}

loadAllSprites();


let player = add([
    rect(35, 20),
    pos(15, 43),
    {
        w: 35,
        h: 20,
        velX: 0,
        velY: 0,
        moveVelX: 0,
        dashCd: 0
    }
])

let playerSpr = add([
    pos(0, 0),
    sprite("bunnyIdle"),
    scale(2),
    {
        sprite: "bunnyIdle",
        face: 0, // (0 é direita, 1 é esquerda, msm q o flipX)
        ofs: {
            x: -15, y: -43
        }
    } 
])

playerSpr.play("anim", {speed: 4});

const CollisionTileSize = 40;
const TotalDashCooldown = 8;

function areRectanglesColliding(rect1, rect2) {
    let noHorizontalOverlap = rect1.pos.x + rect1.w <= rect2.pos.x || rect2.pos.x + rect2.w <= rect1.pos.x;
    let noVerticalOverlap = rect1.pos.y + rect1.h <= rect2.pos.y || rect2.pos.y + rect2.h <= rect1.pos.y;
    return !(noHorizontalOverlap || noVerticalOverlap);
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

function addSolid(obj) {
    let o = add([
        rect(obj.width, obj.height),
        pos(obj.x, obj.y),
        area(),
        {
            w: obj.width,
            h: obj.height,
        },
        "solid"
    ])

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

addSolid({
    x: 400, y: 400,
    width: 300, height: 50
})

addSolid({
    x: 0, y: 400,
    width: 300, height: 50
})

function flipPlayerSpr(flip) {
    playerSpr.stop();
    let spr = playerSpr.sprite;
    debug.log(playerSpr.sprite);
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

// playerSpr.use(sprite("bunnyRun"));
// playerSpr.play("anim");
function updateSprite() {
    console.log(playerSpr.face);
    // console.log(playerSpr.sprite, player.velX, player.velY);
    if((player.velX != 0) && playerSpr.sprite == "bunnyIdle") {
        // console.log(playerSpr.sprite);
        playerSpr.stop();
        playerSpr.use(sprite("bunnyRun", {flipX: playerSpr.face}));
        playerSpr.play("anim", {speed: 12});
        playerSpr.sprite = "bunnyRun";
    }
    if((player.velX == 0) && playerSpr.sprite == "bunnyRun") {
        // console.log(playerSpr.sprite);
        playerSpr.stop();
        playerSpr.use(sprite("bunnyIdle", {flipX: playerSpr.face}));
        playerSpr.play("anim", {speed: 3});
        playerSpr.sprite = "bunnyIdle";
    }
    

    if(player.velX != 0 && ((player.velX < 0) != playerSpr.face)) flipPlayerSpr(player.velX < 0);
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
    camPos(oldCam.x + (newPos.x - oldCam.x)*0.1, oldCam.y + (newPos.y - oldCam.y)*0.1);
    // bg.pos.x = (oldCam.x + camPos().x)/2;
    // bg.pos.y = (oldCam.y + camPos().y)/2;
}

let lastTime = performance.now();
let tick = 0;
loop(0.001, () => {
    // fps controlling (max 45 fps)
    let deltaTime = performance.now() - lastTime;
    if(deltaTime < 1000/60) return;
    lastTime = performance.now();
    tick++;
    tick %= 2;

    // player.pos.x += 6;
    if(tick %2 == 0) {
        getVelocities();
        movePlayer();
        updateSprite();
        updateCamera();
    }


    playerSpr.pos.x = player.pos.x + playerSpr.ofs.x;
    playerSpr.pos.y = player.pos.y + playerSpr.ofs.y;
})