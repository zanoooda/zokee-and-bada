// Game instance
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
    preload: preload,
    create: create,
    update: update
});

// Game objects
var cursors;
var platforms;

var bada;

// Preload media
function preload() {
    game.load.spritesheet('bada', 'assets/images/bada.png', 48, 48);
    game.load.image('ground', 'assets/images/ground.png');
}

// Create game
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Take width and height out to some config
    game.world.setBounds(0, 0, 1600, 600);

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

    //Bada
    bada = game.add.sprite(200, 200, 'bada');
    game.physics.arcade.enable(bada);
    bada.anchor.setTo(0.5, 1);
    bada.body.gravity.y = 300;
    bada.animations.add('stand', [4], 10, true);
    bada.animations.add('right', [0, 1, 2, 3], 10, true);
    bada.animations.add('left', [5, 6, 7, 8], 10, true);
}

// Update game
function update() {
    // Camera
    game.camera.focusOnXY(bada.x, bada.y);

    game.physics.arcade.collide(bada, platforms);

    if (cursors.up.isDown)
    {
        bada.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        bada.body.velocity.y = 150;
    }

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
}