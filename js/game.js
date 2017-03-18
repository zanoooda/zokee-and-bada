// Game instance
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update
});

// Game groups
var platforms;

// Game objects
var ground;

var zok;
var bada;

// Load all the game media before starting
function preload() {
    game.load.spritesheet('zok', 'assets/images/zok.png', 100, 100);
    game.load.spritesheet('bada', 'assets/images/bada.png', 100, 100);

    game.load.image('background', 'assets/images/background.png');
    game.load.image('ground', 'assets/images/ground.png');
}

// Create game
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Take width and height out to some config
    game.world.setBounds(0, 0, 800, 600);

    // Background
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');

    // Platforms group
    platforms = game.add.group();
    platforms.enableBody = true;

    // Ground
    ground = platforms.create(0, game.world.height / 2, 'ground');
    //ground.scale.setTo(200, 150);
    ground.body.immovable = true;

    //Bada
    bada = game.add.sprite(200, 200, 'bada');
    game.physics.arcade.enable(bada);
    bada.body.collideWorldBounds=true;
    bada.anchor.setTo(0.5, 1);
    bada.body.gravity.y = 300;
    bada.animations.add('stand', [0], 10, true);

    // Zokee
    zok = game.add.sprite(400, 200, 'zok');
}

// Update game
function update() {
    // Camera
    game.camera.focusOnXY(bada.x, bada.y)

    // Physics
    game.physics.arcade.collide(bada, platforms);
}