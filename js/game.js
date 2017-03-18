// Game instance
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update
});

// Game objects
var bada;

// Preload media
function preload() {
    game.load.spritesheet('bada', 'assets/images/bada.png', 48, 48);
}

// Create game
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Take width and height out to some config
    game.world.setBounds(0, 0, 800, 600);

    // Background color
    game.stage.backgroundColor = "#4488AA"

    //Bada
    bada = game.add.sprite(200, 200, 'bada');
    game.physics.arcade.enable(bada);
    bada.body.collideWorldBounds=true;
    bada.anchor.setTo(0.5, 1);
    bada.body.gravity.y = 300;
    bada.animations.add('stand', [0], 10, true);
}

// Update game
function update() {
    // Camera
    game.camera.focusOnXY(bada.x, bada.y)
}