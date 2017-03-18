// Game instance
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update
});

// Game objects
var zok;
var bada;

// Load all the game media before starting
function preload() {
    game.load.spritesheet('zok', 'assets/images/zok.png', 100, 100);
    game.load.spritesheet('bada', 'assets/images/bada.png', 100, 100);

    game.load.image('background', 'assets/images/background.png');
    game.load.image('ground', 'assets/images/ground.png');
}

// Create 
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Take width and height out to some config
    game.world.setBounds(0, 0, 800, 600);

    // Background
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');

    //Bada
    bada = game.add.sprite(200, 200, 'bada');

    // Zokee
    zok = game.add.sprite(400, 400, 'zok');
}

// Update
function update() {
    
}