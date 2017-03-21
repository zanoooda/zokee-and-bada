// Game instance
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update
});

// Game objects
var cursors;

var obstacles;
var platforms;
var zokee;

var bada;

var zok1;
var zok2;
var zok3;
var zok4;

// Preload media
function preload() {
    game.load.spritesheet('bada', 'assets/images/bada.png', 48, 48);
    game.load.image('ground', 'assets/images/ground.png');
    game.load.image('zok', 'assets/images/zok.png');
}

// Create game
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.physics.arcade.gravity.y = 300;
    // Take width and height out to some config
    game.world.setBounds(0, 0, 1900, 600);

    // Background color
    game.stage.backgroundColor = "#CCFFFF";

    // Inputs from keyboard
    cursors = game.input.keyboard.createCursorKeys();

    // Platforms
    platforms = game.add.group();
    platforms.enableBody = true;

    // Grounds
    var ground1 = platforms.create(0, (game.world.height / 4) * 3, 'ground');
    ground1.body.immovable = true;

    var ground2 = platforms.create(500, (game.world.height / 4) * 3, 'ground');
    ground2.body.immovable = true;

    var ground3 = platforms.create(1000, (game.world.height / 4) * 3, 'ground');
    ground3.body.immovable = true;

    var ground4 = platforms.create(1500, (game.world.height / 4) * 3, 'ground');
    ground4.body.immovable = true;

    //Bada
    bada = game.add.sprite(50, 150, 'bada');
    game.physics.arcade.enable(bada);
    bada.anchor.setTo(0.5, 1);
    bada.body.gravity.y = 300;
    bada.animations.add('stand', [4], 20, true);
    bada.animations.add('right', [0, 1, 2, 3], 10, true);
    bada.animations.add('left', [5, 6, 7, 8], 10, true);
    bada.animations.add('down', [9], 20, true);

    // Zokee
    zokee = game.add.group();
    zokee.enableBody = true;
    
    createZok(300, 200, 'zok');
    createZok(550, 200, 'zok');
    createZok(700, 200, 'zok');
    createZok(850, 200, 'zok');
    createZok(1100, 200, 'zok');
    createZok(1300, 200, 'zok');
    createZok(1600, 200, 'zok');
    createZok(1800, 200, 'zok');

    // Camera
    game.camera.follow(bada);
}

// Update game
function update() {
    game.physics.arcade.collide(zokee, platforms);
    game.physics.arcade.collide(zokee, zokee);
    game.physics.arcade.collide(bada, platforms);
    game.physics.arcade.collide(bada, zokee, collect);

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
        bada.animations.play('stand');
    }

    if (cursors.up.isDown)
    {
        bada.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        bada.animations.play('down');
        bada.body.velocity.y = 150;
    }
}

function collect(bada, zok) {
    zok.kill();
}

function createZok(width, height, key) {
    var zok = zokee.create(width, height, key);
    zok.body.gravity.y = 300;
    zok.anchor.setTo(0.5, 1);

    game.physics.arcade.enable(zok);
}