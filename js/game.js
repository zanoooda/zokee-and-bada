// Game instance
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-container', {
    preload: preload,
    create: create,
    update: update
});

// Game objects
var cursors;

// Groups
var platforms;
var clouds;
var honey;
var zokee;
var enemies;

// Player
var bada;

// Preload media
function preload() {
    game.load.spritesheet('bada', 'assets/images/bada.png', 48, 48);
    game.load.spritesheet('bee', 'assets/images/bee.png', 32, 32);
    game.load.spritesheet('zok', 'assets/images/zok.png', 32, 32);
    game.load.image('ground', 'assets/images/ground.png');
    game.load.image('cloud', 'assets/images/cloud.png');
    game.load.image('honey', 'assets/images/honey.png');
}

// Create game
function create() {
    // TODO: add hedgehog 

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1900, 600);

    // Background color
    game.stage.backgroundColor = "#CCFFFF";

    // Inputs from keyboard
    cursors = game.input.keyboard.createCursorKeys();

    // Clouds
    clouds = createGroup();

    createCloud(400, 100, 'cloud');
    createCloud(800, 100, 'cloud');
    createCloud(1200, 100, 'cloud');
    createCloud(1500, 100, 'cloud');
    createCloud(1900, 100, 'cloud');

    // Platforms
    platforms = createGroup();

    createPlatform(0, (game.world.height / 4) * 3, 'ground');
    createPlatform(500, (game.world.height / 4) * 3, 'ground');
    createPlatform(1000, (game.world.height / 4) * 3, 'ground');
    createPlatform(1500, (game.world.height / 4) * 3, 'ground');

    // Honey
    honey = createGroup();

    createHoney(300, 200, 'honey');
    createHoney(550, 200, 'honey');
    createHoney(700, 200, 'honey');
    createHoney(1100, 200, 'honey');
    createHoney(1300, 200, 'honey');
    createHoney(1600, 200, 'honey');
    createHoney(1800, 200, 'honey');

    // Zokee
    zokee = createGroup();
    
    createZok(700, 200, 'zok');

    // Enemies
    enemies = createGroup();

    createEnemy(250, 440, 'bee');
    createEnemy(600, 440, 'bee');

    //Bada
    bada = createPlayer(50, 150, 'bada');
}

// Update game
function update() {
    game.physics.arcade.collide(honey, platforms);
    game.physics.arcade.collide(honey, honey);

    game.physics.arcade.collide(zokee, platforms);
    // ISSUE: Not every time zik collide with bada
    game.physics.arcade.collide(zokee, enemies, recoil);
    game.physics.arcade.collide(zokee, honey, enter);

    game.physics.arcade.collide(zokee, zokee, whatZokeeDo);
    //

    game.physics.arcade.collide(bada, platforms);
    bada.sit = game.physics.arcade.collide(bada, clouds, sit);
    game.physics.arcade.collide(bada, honey, collect);
    // TODO: Bada loose health on touch but he feel better when find honey (with no zok)
    game.physics.arcade.collide(bada, enemies, recoil);
    // TODO: zok have no to take bada up to space, but it nice to contact with bada
    game.physics.arcade.collide(bada, zokee);

    // TODO: Add logic to each zok and option to stop following
    // May be follow for a minute and after make something with animation and after next collide return to follow
    if(!zokee.children[0].recoil){
        game.physics.arcade.moveToObject(zokee.children[0], bada, 60);
    }

    if(bada.recoil) {
        bada.animations.play('recoil');
    } else {
        if (cursors.left.isDown) {
            bada.animations.play('left');
            bada.body.velocity.x = -150;
        } else if (cursors.right.isDown) {
            bada.animations.play('right');
            bada.body.velocity.x = 150;
        } else {
            bada.body.velocity.x = 0;
            if(!bada.sit) {
                bada.animations.play('stand');
            }
        }
        // TODO: Make condition to fly, animation to fly and condition to animation to fly
        if ((cursors.up.isDown && bada.body.wasTouching.down) || (cursors.up.isDown && bada.canFly)) {
            bada.body.velocity.y = -200;
        } else if (cursors.down.isDown) {
            bada.animations.play('down');
            bada.body.velocity.y = 150;
        }
    }
}

// Creation functions
function createGroup() {
    // TODO: learn what does it mean 'game.physics.arcade.enable(sprite)'
    // Is 'group.physicsBodyType = Phaser.Physics.ARCADE' equal to 'game.physics.arcade.enable(sprite)' for each sprite?

    var group = game.add.group();
    group.enableBody = true;

    return group;
}

function createHoney(width, height, key) {
    // TODO: In the honey can be zok
    var h = honey.create(width, height, key);
    h.body.gravity.y = 300;
    h.anchor.setTo(0.5, 1);

    return h;
}

function createZok(width, height, key) {
    var zok = zokee.create(width, height, key);

    zok.animations.add('stand', [0], 0, true);
    zok.animations.add('run', [0, 1], 10, true);
    // TODO: Add logic to animations
    zok.animations.play('stand');
    // Nice idea to change gravity for zok
    zok.body.gravity.y = 1000;

    // Check what this line do and may be re-remove it 
    game.physics.arcade.enable(zok);

    zok.anchor.setTo(0.5, 1);

    return zok;
}

function createPlatform(width, height, key) {
    var platform = platforms.create(width, height, key);
    platform.body.immovable = true;

    return platform;
}

function createCloud(width, height, key) {
    var cloud = clouds.create(width, height, key);

    cloud.body.velocity.x = -20;
    cloud.body.immovable = true;
    
    cloud.body.checkCollision.down = false;
    cloud.body.checkCollision.left = false;
    cloud.body.checkCollision.right = false;

    cloud.checkWorldBounds = true;
    cloud.events.onOutOfBounds.add(resetCloud);

    return cloud;
}

function createEnemy(width, height, key) {
    var enemy = enemies.create(width, height, key);
    enemy.anchor.setTo(0.5, 1);
    enemy.body.immovable = true;

    enemy.animations.add('zzz', [0, 1], 30, true);
    enemy.animations.play('zzz');

    enemy.tween = game.add.tween(enemy).to({x: width, y: height - 100}, 2000, null, true, Math.random() * 1000, -1, true);   
    enemy.tween.onComplete.add(function(){
        enemy.tween.to({x: width, y: height}, 2000, null, true, 0, -1, true);   
    });    

    return enemy;
}

function createPlayer(width, height, key) {
    player = game.add.sprite(width, height, key);

    game.physics.arcade.enable(player);
    game.camera.follow(player);
    
    player.anchor.setTo(0.5, 1);
    player.body.gravity.y = 300;

    player.animations.add('stand', [4], 0, true);
    player.animations.add('right', [0, 1, 2, 3], 10, true);
    player.animations.add('left', [5, 6, 7, 8], 10, true);
    player.animations.add('down', [9], 0, true);
    player.animations.add('sit', [10], 0, true);
    player.animations.add('recoil', [9], 0, true);

    return player;
}

// Updation functions
function resetCloud(cloud) {
    cloud.x = game.world.width;
}

function collect(sprite, item) {
    item.kill();
}
// This function can be the bada.sit(), will be better
function sit() {
    if(!cursors.right.isDown && !cursors.left.isDown){
        bada.animations.play('sit');
    }
}

function recoil(sprite, enemy) {
    // ISSUE: When player touch enemy fron up twise. First setTimeout make 'sprite.recoil = false' when second recoil still is...
    if(sprite.body.wasTouching.up) {
        enemy.tween.pause();
    }

    // TODO: if from right side of enemy it must recoil to another side
    sprite.body.velocity.y = -200;
    sprite.body.velocity.x = -50;

    sprite.recoil = true;

    // TODO: Change it to sprite.recoil = false; when bada 'touch' something
    setTimeout(function() {
        sprite.recoil = false;
        // Better to resume tween directly whan player stop to touching enemy from up
        enemy.tween.resume();
    }, 1500);
}

function enter(zok, h) {
    // TODO: implement, make animation
}

function whatZokeeDo(zok1, zok2) {
    // TODO: implement
}