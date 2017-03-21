// Game instance
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update
});

// Game objects
var cursors;

//var obstacles;
var platforms;
var clouds;
var zokee;
var honey;

var bada;

// Preload media
function preload() {
    game.load.spritesheet('bada', 'assets/images/bada.png', 48, 48);
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

    // Platforms
    platforms = game.add.group();
    platforms.enableBody = true;

    createPlatform(0, (game.world.height / 4) * 3, 'ground');
    createPlatform(500, (game.world.height / 4) * 3, 'ground');
    createPlatform(1000, (game.world.height / 4) * 3, 'ground');
    createPlatform(1500, (game.world.height / 4) * 3, 'ground');

    // Clouds
    clouds = game.add.group();
    clouds.enableBody = true;

    createCloud(400, 100, 'cloud');
    createCloud(800, 100, 'cloud');
    createCloud(1200, 100, 'cloud');
    createCloud(1500, 100, 'cloud');
    createCloud(1900, 100, 'cloud');

    // Zokee
    zokee = game.add.group();
    zokee.enableBody = true;
    
    createZok(350, 200, 'zok');

    // Honey
    honey = game.add.group();
    honey.enableBody = true;

    createHoney(300, 200, 'honey');
    createHoney(550, 200, 'honey');
    createHoney(700, 200, 'honey');
    createHoney(850, 200, 'honey');
    createHoney(1100, 200, 'honey');
    createHoney(1300, 200, 'honey');
    createHoney(1600, 200, 'honey');
    createHoney(1800, 200, 'honey');

    //Bada
    bada = game.add.sprite(50, 150, 'bada');
    game.physics.arcade.enable(bada);
    bada.anchor.setTo(0.5, 1);
    bada.body.gravity.y = 300;
    bada.animations.add('stand', [4], 20, true);
    bada.animations.add('right', [0, 1, 2, 3], 10, true);
    bada.animations.add('left', [5, 6, 7, 8], 10, true);
    bada.animations.add('down', [9], 20, true);
    bada.animations.add('sit', [10], 20, true);

    // Camera
    game.camera.follow(bada);
}

// Update game
function update() {
    manageClouds();
    bada.sit = false;

    game.physics.arcade.collide(honey, platforms);
    game.physics.arcade.collide(zokee, platforms);
    game.physics.arcade.collide(zokee, zokee);
    game.physics.arcade.collide(bada, platforms);
    game.physics.arcade.collide(bada, clouds, sit);
    game.physics.arcade.collide(bada, zokee);
    game.physics.arcade.collide(bada, honey, collect);

    if (cursors.left.isDown) {
        bada.animations.play('left');
        bada.body.velocity.x = -150;
    }
    else if (cursors.right.isDown) {
        bada.animations.play('right');
        bada.body.velocity.x = 150;
    }
    else {
        bada.body.velocity.x = 0;
        if(!bada.sit) {
            bada.animations.play('stand');
        }
    }

    if (cursors.up.isDown)
    {
        bada.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        bada.animations.play('down');
        bada.body.velocity.y = 150;
    }
}

function collect(bada, item) {
    item.kill();
}

function sit() {
    if(!cursors.right.isDown && !cursors.left.isDown){
        bada.sit = true;
        bada.animations.play('sit');
    }
}

function createHoney(width, height, key) {
    var h = honey.create(width, height, key);
    h.body.gravity.y = 300;
    h.anchor.setTo(0.5, 1);
}

function createZok(width, height, key) {
    var zok = zokee.create(width, height, key);
    zok.body.gravity.y = 300;
    zok.anchor.setTo(0.5, 1);
}

function createPlatform(width, height, key) {
    var ground = platforms.create(width, height, key);
    ground.body.immovable = true;
}

function createCloud(width, height, key) {
    var cloud = clouds.create(width, height, key);
    cloud.body.velocity.x = -20;
    cloud.body.immovable = true;
    cloud.body.checkCollision.down = false;
    cloud.body.checkCollision.left = false;
    cloud.body.checkCollision.right = false;
}

function manageClouds() {
    clouds.forEach(function(cloud) {
        if(cloud.x < 0 - cloud.width){
            cloud.x = game.world.width;
        }
    }, this);
}