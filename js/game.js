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
    game.load.image('ground', 'assets/images/ground.png');
    game.load.image('zok', 'assets/images/zok.png');
    game.load.image('cloud', 'assets/images/cloud.png');
    game.load.image('honey', 'assets/images/honey.png');
}

// Create game
function create() {
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

    game.physics.arcade.collide(zokee, platforms);

    game.physics.arcade.collide(bada, platforms);
    bada.sit = game.physics.arcade.collide(bada, clouds, sit);
    game.physics.arcade.collide(bada, zokee);
    game.physics.arcade.collide(bada, honey, collect);
    game.physics.arcade.collide(bada, enemies, recoil);

    if(bada.recoil) {
        bada.body.velocity.x = -50;
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
    // zokee follow test
    game.physics.arcade.moveToObject(zokee.children[0], bada, 60);
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
    var h = honey.create(width, height, key);
    h.body.gravity.y = 300;
    h.anchor.setTo(0.5, 1);

    return h;
}

function createZok(width, height, key) {
    var zok = zokee.create(width, height, key);
    //zok.body.gravity.y = 300;
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
    // TODO: Make the enemies move asyncroniusly

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

    player.animations.add('stand', [4], 20, true);
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

function collect(bada, item) {
    item.kill();
}

function sit() {
    if(!cursors.right.isDown && !cursors.left.isDown){
        bada.animations.play('sit');
    }
}

function recoil(bada, enemy) {
    // ISSUE: When player touch enemy fron up twise. First setTimeout make 'bada.recoil = false' when second recoil still is...
    if(bada.body.wasTouching.up) {
        enemy.tween.pause();
    }

    // TODO: if recoil from down side of enemy it must stop (enemy.tween.pause(), enemy.tween.resume())
    //       create logic to resume tween
    //
    // TODO: if from right side of enemy it must recoil to another side

    bada.body.velocity.y = -200;

    bada.recoil = true;

    // TODO: Change it to bada.recoil = false; when bada 'touch' something
    setTimeout(function() {
        //bada.body.velocity.x = 0;
        bada.recoil = false;
        // Better to resume tween directly whan player stop to touching enemy from up
        enemy.tween.resume();
    }, 1500);
}