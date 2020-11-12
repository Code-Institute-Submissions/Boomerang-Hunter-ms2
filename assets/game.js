var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade', 
        arcade: {
            gravity: { y: 300},
            debug: false
        } 
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var game = new Phaser.Game(config);

    var score = 0;
    var scoreText;
    var cameraMove = false;
    var cameraWidth;
    var cameraHeight;
    var gameOverMessage;
    var gameOverMessage2;

function preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bg', 'assets/background.png');
    this.load.image('cloud', 'assets/cloud.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('boomerang', 'assets/boomerang.png');
    this.load.image('dynamite', 'assets/dynamite.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.spritesheet('kangaroo', 'assets/kangaroo.png', {frameWidth: 55, frameHeight: 55}
    );
}

var player;
var platforms;
var cursors;

function create () {

    this.add.image(0, 0, 'sky').setOrigin(0);
    this.add.image(0, 370, 'bg').setOrigin(0);
    this.add.image(550, 50, 'cloud').setScale(3).setOrigin(0);
    this.add.image(0, 100, 'cloud').setScale(4).setOrigin(0);
    this.add.image(430, 230, 'cloud').setScale(4).setOrigin(0);

    walls = this.physics.add.staticGroup();

    walls.create(-10, 250, 'wall');
    walls.create(810, 250, 'wall');

    platforms = this.physics.add.staticGroup();
    
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    movingPlatform1 = this.physics.add.image(400, 400, 'ground');

    movingPlatform1.setImmovable(true);
    movingPlatform1.body.allowGravity = false;
    movingPlatform1.setVelocityX(200);

    movingPlatform2 = this.physics.add.image(270, 270, 'ground');

    movingPlatform2.setImmovable(true);
    movingPlatform2.body.allowGravity = false;
    movingPlatform2.setVelocityX(125);

    movingPlatform3 = this.physics.add.image(220, 150, 'ground');

    movingPlatform3.setImmovable(true);
    movingPlatform3.body.allowGravity = false;
    movingPlatform3.setVelocityX(50);

    player = this.physics.add.sprite(100, 450, 'kangaroo');

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);


    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('kangaroo', {start: 0, end: 4}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('kangaroo', {start: 5, end: 9}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'kangaroo', frame: 10}],
        frameRate: 10
    })

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, movingPlatform1);
    this.physics.add.collider(player, movingPlatform2);
    this.physics.add.collider(player, movingPlatform3);
    this.physics.add.collider(player, walls);

    boomerang = this.physics.add.group({
        key: 'boomerang',
        repeat: 6,
        setXY: { x:25, y:0, stepX: 120},
        setCollideWorldBounds: (true)
    });
    

    boomerang.children.iterate(function(child) {
        child.setBounceY(0.3);
    });

    this.physics.add.collider(boomerang, platforms);
    this.physics.add.collider(boomerang, movingPlatform1);
    this.physics.add.collider(boomerang, movingPlatform2);
    this.physics.add.collider(boomerang, movingPlatform3);
    this.physics.add.collider(boomerang, walls);
    this.physics.add.overlap(player, boomerang, collectBoomerangs, null, this);
    

    function collectBoomerangs (player, boomerangs)
{
    boomerangs.disableBody(true, true);

    score += 100;
    scoreText.setText('Points: ' + score);
    
    if (boomerang.countActive(true) === 0){
            boomerang.children.iterate(function (child){
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800):
            Phaser.Math.Between(0, 400);

            var dynamite = dynamites.create(x, 16, 'dynamite');
            dynamite.setBounce(1);
            dynamite.setCollideWorldBounds(true);
            dynamite.setVelocity(Phaser.Math.Between(-250, 250), 20);
    }
}
    scoreText = this.add.text(16, 16, 'Points: 0', {fontSize: '32px', fill: '#000000'});
    gameOverMessage = this.add.text(200, 200, '', { fontSize: 'bold 50px', fill: '#FF0000'});
    gameOverMessage2 = this.add.text(240, 300, '', { fontSize: 'bold 50px', fill: '#FF0000'});

    dynamites = this.physics.add.group();
    
    this.physics.add.collider(dynamites, platforms);
    this.physics.add.collider(dynamites, movingPlatform1);
    this.physics.add.collider(dynamites, movingPlatform2);
    this.physics.add.collider(dynamites, movingPlatform3);
    this.physics.add.collider(dynamites, walls);
    this.physics.add.overlap(player, dynamites, hitDynamite, null, this);


    function hitDynamite (player, dynamite){
        this.physics.pause();
        player.disableBody(true, true);
        dynamite.disableBody(true, true);
        gameOver = true;
        gameOverMessage.setText('YOU GOT HIT!');
        gameOverMessage2.setText('GAME OVER');
    }

}
function update () 
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-320);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(320);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-450);
    }

    if (movingPlatform1.x >= 560)
    {
        movingPlatform1.setVelocityX(-200);
    }
    else if (movingPlatform1.x <= 250)
    {
        movingPlatform1.setVelocityX(200);
    }

    if (movingPlatform2.x >= 500)
    {
        movingPlatform2.setVelocityX(-125);
    }
    else if (movingPlatform2.x <= 250)
    {
        movingPlatform2.setVelocityX(125);
    }

    if (movingPlatform3.x >= 550)
    {
        movingPlatform3.setVelocityX(-50);
    }
    else if (movingPlatform3.x <= 250)
    {
        movingPlatform3.setVelocityX(50);
    }
}
