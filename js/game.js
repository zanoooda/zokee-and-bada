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
    // Take width and height out to some config
    game.world.setBounds(0, 0, 1900, 600);

    // Background color
    game.stage.backgroundColor = "#CCFFFF"

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
    
    zok1 = makeZok(300, 200);
    zok2 = makeZok(550, 200);
    zok3 = makeZok(700, 200);
    zok4 = makeZok(850, 200);
    zok5 = makeZok(1100, 200);
    zok6 = makeZok(1300, 200);
    zok7 = makeZok(1600, 200);
    zok8 = makeZok(1800, 200);
}

// Update game
function update() {
    // Camera
    game.camera.focusOnXY(bada.x, bada.y);

    game.physics.arcade.collide(zokee, platforms);
    game.physics.arcade.collide(bada, platforms);

    checkIntersectionWithBada(zok1);
    checkIntersectionWithBada(zok2);
    checkIntersectionWithBada(zok3);
    checkIntersectionWithBada(zok4);
    checkIntersectionWithBada(zok5);
    checkIntersectionWithBada(zok6);
    checkIntersectionWithBada(zok7);
    checkIntersectionWithBada(zok8);

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

function makeZok(width, height) {
    var zok = zokee.create(width, height, 'zok');
    game.physics.arcade.enable(zok);
    zok.anchor.setTo(0.5, 1);
    zok.body.gravity.y = 300;

    return zok;
}

function checkIntersectionWithBada(zok) {
    if(Phaser.Rectangle.intersects(zok.getBounds(), bada.getBounds())) {
        zok.kill();
    }
}