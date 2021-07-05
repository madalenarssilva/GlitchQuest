import Phaser from 'phaser';

export var Level3 = Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Level3() {
        Phaser.Scene.call(this, { key: 'Level3' });

        //  Scene Variables
        this.map;
        this.tileset;
        this.background;
        this.clouds;
        this.platforms;
        this.player;
        this.camera;
        this.help;
        this.pause;
        this.gameWidth = 1000;
        this.gameHeight = 620;
        this.collisionBody;
        this.currentVolume;
        this.currentBoundBox;
        this.currentTetrisFigure;
        this.tetrisInGame;
        this.tetrisLocked;
        this.tetrsCollidingRight;

        //  AUX VARIABLES
        this.keyBoardSpace;
        this.maxXTreshold;
        this.minXTreshold;
        this.cameraOff;

        //  HACKS
        this.turboOn;
    },

    // ===================  PRELOAD SECTION =================================

    preload: function(){
    },

    // ===================  CREATE SECTION =================================

    create: function() {

        //  INIT VARIABLES
        this.stopTetris = false;
        this.stopPlayer = false;
        this.tetrisColliding = false;
        this.tetrisCollidingRight = false;
        this.tetrisInGame = [];
        this.currentTetrisFigure = [];
        this.turboOn = false;
        this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));

        //  TILEMAP AND TILESET - BACKGROUND
        this.map = this.make.tilemap({key: 'map_level3'});
        this.tileset = this.map.addTilesetImage('tileset3', 'tileset_level3');

        //  TILEMAP LAYERS
        this.background = this.map.createStaticLayer("fundo", this.tileset, 0, 0);
        this.clouds = this.map.createStaticLayer("nuvens", this.tileset, 0, 0);
        this.platforms = this.map.createStaticLayer("plataformas", this.tileset, 0, 0);
        this.platforms.setCollisionByProperty({colliders: true});

        //  PLAYER
        this.player = this.physics.add.sprite(500, 567, 'player');
        this.player.setBounce(0.01);
        this.player.body.setSize(32,83).setOffset(20,0);

        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'turn', frames: [{key: 'player', frame: 4}], frameRate: 20 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('player', {start: 5, end: 8}), frameRate: 10, repeat: -1 });
    
        //  COLLISIONS
        this.physics.add.collider(this.player, this.platforms, this.enableJump, null, this);

        //  CURSORS
        this.cursors = this.input.keyboard.createCursorKeys();

        //  PAUSE
        this.pause = this.add.image( 30, 40, 'pause_white').setInteractive();
        this.pause.setScale(0.5);
        this.pause.setScrollFactor(0);

        //  KEYBOARD
        this.keyBoardSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //  HELP
        this.help = this.add.image(this.gameWidth-100, 70, 'UniVirus').setScale(0.8);

        //  MUSIC
        this.levelMusic = this.sound.add("Level3Audio");
        this.levelMusic.loop=true;
        this.levelMusic.setVolume(this.currentVolume);
        this.jumpSound=this.sound.add("jumpAudio");
        this.jumpSound.setVolume(0.5*this.currentVolume);
        this.levelMusic.play();
        if (localStorage.getItem('audioMuted') === "true")
            this.muteAllAudio(true);
        else
            this.muteAllAudio(false);

        //  CHANGING TO PAUSE MENU
        this.pause.on('pointerup', function () {
            console.log("Click pause");
            this.scene.pause();
            this.scene.launch('PauseMenu', {callerScene: 'Level3'});
        }, this);

        this.input.keyboard.on('keyup-ESC', ()=>{
            console.log("Click pause");
            this.scene.pause();
            this.scene.launch('PauseMenu', {callerScene: 'Level3'});
        }, this);

        // SCENE EVENTS
        this.events.on('shutdown', function(){
            this.levelMusic.stop();
        }, this);

        this.events.on('pause', ()=>{
            this.levelMusic.pause();
        }, this);

        this.events.on('resume', ()=>{
            if (!this.inPopUp){
                if (localStorage.getItem('audioMuted') === 'true')
                    this.muteAllAudio(true);
                else
                    this.muteAllAudio(false);
                this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));
                this.levelMusic.setVolume(this.currentVolume);
                this.levelMusic.play();
            }
            // FROM POPUP MENU
            else{
                this.inPopUp = false;
                this.levelMusic.play();
            }
        });

        // PAUSE BUTTON
        this.events.on('pause_white', function(){
            console.log("Inside pause event");
            this.levelMusic.pause();
        }, this);

        //  HACKS
        this.input.keyboard.on('keyup-T', () => {
            if (this.turboOn) {
                this.turboOn = false;
                console.log("TURBO OFF");
            } else {
                this.turboOn = true;
                console.log("TURBO ON");
            }
        });
            

        this.input.keyboard.on('keyup-ENTER', ()=>{
            this.figureFall();
        });
        
        // POP UP MENU
        this.inPopUp = true;
        this.scene.pause();
        this.scene.launch('PopUp', {callerScene: 'Level3'});

        /* ----------------- TESTS ----------------- */
    },

    // ===================  UPDATE SECTION =================================

    update: function() {       
        //  PLAYER MOVEMENT
        this.playerMovement(this.player);
    },  
    
    //  ONLY JUMP WHEN PLAYER'S BOTTOM IS TOUCHING FIGURE/TILE'S TOP
    enableJump: function(player, tile){
        let top = (tile.pixelY === undefined) ? tile.body.top:tile.pixelY;
       
        if (top === player.body.bottom) {
            if (this.keyBoardSpace.isDown){
                this.input.stopPropagation();
                
                //  HACK
                if (this.turboOn)
                    this.player.setVelocityY(-600);
                else
                    this.player.setVelocityY(-300);

                this.jumpSound.play();
            }
        }
    },

    //  CHECK PLAYER RELATED KEYPRESSES
    playerMovement: function (player){

        this.checkNextLevel(player);

        let pressedKeys = [];

        if (this.cursors.right.isDown)
            pressedKeys.push('right');

        if (this.cursors.left.isDown)
            pressedKeys.push('left');

        if (this.cursors.up.isDown)
            pressedKeys.push('top')

        if (this.currentTetrisFigure.length != 0 && this.currentTetrisFigure[0].body.bottom + 250 >= this.player.body.top)
            this.tetrisLocked = true;
        else
            this.tetrisLocked = false;

         //  PLAYER MOVEMENT
        if (!this.stopPlayer && this.cursors.right.isDown && !this.lockRightMovement && this.checkBounds(player, pressedKeys)) {
             //  HACK
            if (this.turboOn)
                player.setVelocityX(400);
            else
                player.setVelocityX(200);

            player.anims.play('right', true);

            if(!this.tetrisLocked && !this.tetrisCollidingRight)
                this.currentTetrisFigure.forEach(element => {
                    element.body.setVelocityX(200);
                });

        }
        else if (!this.stopPlayer && this.cursors.left.isDown && this.checkBounds(player, pressedKeys) ) {
            player.setVelocityX(-200);
            this.player.anims.play('left', true);
        
            if (!this.tetrisLocked){
                this.currentTetrisFigure.forEach(element => {
                    element.body.setVelocityX(-200);
                });
                this.tetrisCollidingRight = false;
            }
                
        }
        else if (this.cursors.down.isDown){

            if (!this.tetrisLocked)
                this.currentTetrisFigure.forEach(element => {
                    element.body.setVelocityY(50);
                });
        }
        else {
            player.setVelocityX(0);
            player.anims.play('turn');

            if (!this.tetrisLocked)
                this.currentTetrisFigure.forEach(element => {
                    element.body.setVelocityX(0);
                    element.body.setVelocityY(15); 
                });
            else
                this.currentTetrisFigure.forEach(element => {
                    element.body.setVelocityX(0);
                    element.body.setVelocityY(90); 
                });
        }
        this.input.stopPropagation();
        this.stopPlayer = false;
    },

    // CHECK IF THE CURRENT LEVEL IS DONE
    checkNextLevel: function(player){

        // IF PLAYER REACHES THE END OF THE MAP
        if (Math.round(player.body.right) >= this.map.widthInPixels){
            this.levelMusic.stop();
            this.scene.stop();
            this.scene.launch("FinalLevel");
        }
    },

    // CHECK IF PLAYER IS INSIDE OUR CAMERA/WORLD BOUNDS
    checkBounds: function(player, pressedKeys){
        let top = (Math.round(player.body.top) > 0) ? true:false;
        let left = (Math.round(player.body.left) >= 0 && Math.round(player.body.left) >= 0) ? true:false;
        let right = ( Math.round(player.body.right) < this.map.widthInPixels) ? true:false;
        
        let result = true;

        for (let i = 0; i<pressedKeys.length; i++){
            if (pressedKeys[i] === 'top'){
                result = result && top;
            }
                
            else if (pressedKeys[i] === 'right'){
                result = result && right;
            }
            
            else{
                result = result && left;
            }
        }
        return result
    },

    //  MUTE ALL AUDIO FILES
    muteAllAudio: function(value){
        this.levelMusic.setMute(value);
    },

    // CREATE TETRIS FIGURE PART WITH BOUNDING BOX
    createBoundingBox(x, y, width, height, key){        
        this.currentBoundBox = this.add.container(x, y);       
        this.currentBoundBox.setSize(width, height);
        this.physics.world.enable(this.currentBoundBox);
        this.currentBoundBox.body.setCollideWorldBounds(true);
        this.currentBoundBox.body.gravity.y = -300;
        this.currentBoundBox.body.friction.x = 0;

        this.physics.add.collider(this.player, [this.currentBoundBox], this.playerBoundBoxCollision, null, this);
        this.physics.add.collider(this.platforms, [this.currentBoundBox], this.stopTetrisMovement, null, this);
    },

    // CREATE TETRIS FIGURE
    createFigure: function(x, y, key){
        
        let tetrisObjectsArray = [];
        let tempBoundBox;

        this.currentTetrisFigure = [];

        if (key === 'tetris'){
            this.createBoundingBox(x+32, y, 32, 32*3, key);
            tetrisObjectsArray.push(this.currentBoundBox);
            
            this.createBoundingBox(x, y+32, 32, 32, key);
            tetrisObjectsArray.push(this.currentBoundBox);
            
            tempBoundBox = this.physics.add.image(x+16, y, key);
            tempBoundBox.body.gravity.y = -300;
            tetrisObjectsArray.push(tempBoundBox);
            this.physics.add.collider(tetrisObjectsArray[0], tetrisObjectsArray[1], this.boundBoxCollision, null, this);
        }
        else if ( key === 'tetris1'){
            this.createBoundingBox(x, y+32, 32, 32, key);
            tetrisObjectsArray.push(this.currentBoundBox);

            this.createBoundingBox(x, y-0.05, 32*3, 32, key);
            tetrisObjectsArray.push(this.currentBoundBox);

            tempBoundBox = this.physics.add.image(x, y+16, key);
            tempBoundBox.body.gravity.y = -300;
            tetrisObjectsArray.push(tempBoundBox);
            this.physics.add.collider(tetrisObjectsArray[0], tetrisObjectsArray[1], this.boundBoxCollision, null, this);
        }
        else if (key === 'tetris2' || key === 'tetris4'){
            tempBoundBox = this.physics.add.image(x, y, key).setVelocityY(-10);
            this.physics.add.collider(this.player, [tempBoundBox], this.playerBoundBoxCollision, null, this );
            this.physics.add.collider(this.platforms, [tempBoundBox], this.stopTetrisMovement, null, this );
            tetrisObjectsArray.push(tempBoundBox);
        }
        else{ //'tetris3'
            this.createBoundingBox(x, y+32, 32*2, 32, key);
            tetrisObjectsArray.push(this.currentBoundBox);

            this.createBoundingBox(x+32, y-2, 32*2, 32, key);
            tetrisObjectsArray.push(this.currentBoundBox);

            tempBoundBox = this.physics.add.image(x+16, y+16, key);
            tempBoundBox.body.gravity.y = -300;
            tetrisObjectsArray.push(tempBoundBox);
            this.physics.add.collider(tetrisObjectsArray[0], tetrisObjectsArray[1], this.boundBoxCollision, null, this);
        }
        
        //make collisions with every object that is in the game
        if (this.tetrisInGame.length !== 0){
            this.tetrisInGame.forEach(boundBox => {
                tetrisObjectsArray.forEach(newBoundBox => {
                    if(tetrisObjectsArray.length === 1)
                        this.physics.add.collider(newBoundBox, boundBox, this.stopTetrisMovement, null, this);
                    else{
                        if (newBoundBox.type !== "Image")
                            this.physics.add.collider(newBoundBox, boundBox, this.stopTetrisMovement, null, this);
                    }
                });
            });
        }

        this.currentTetrisFigure = tetrisObjectsArray;
    },

    stopTetrisMovement: function(boundBox, tile){

        this.tetrisColliding = true;
        this.currentTetrisFigure.forEach(element => {
            element.body.setVelocityX(0);
        });

        //console.log("Inside StopTetrisMovement :", boundBox.body.right, boundBox.body, tile);

        let exstingTop = (tile.pixelY === undefined) ? tile.body.top:tile.pixelY;
        let leftTile = (tile.pixelX === undefined) ? tile.body.left: tile.pixelX;

        if (boundBox.body.bottom !== exstingTop){
            if (leftTile <= boundBox.body.right){
                this.tetrisCollidingRight = true;
            }
            return;
        }

        // STOP INDIVIDUAL BOXES OF FIGURE
        this.currentTetrisFigure.forEach(element => {
            element.body.setImmovable(true);
            element.body.moves = false;
        });

        // ADD BOUNDING BOXES TO GAME FIGURES
        this.currentTetrisFigure.forEach(boundBox => {
            if (this.currentTetrisFigure.length > 1){
                if (boundBox.type !== "Image" && this.currentTetrisFigure.length > 1){
                    this.tetrisInGame.push(boundBox);
                }
            }
            else if (this.currentTetrisFigure.length === 1){
                this.tetrisInGame.push(boundBox);
            }
        });

        this.currentTetrisFigure = [];
        this.time.delayedCall(1000,this.figureFall, [], this);
    },

    boundBoxCollision: function(block1, block2){
        
        if (this.stopTetris){
            block1.body.stop(true);
            block2.body.setImmovable(true);
        }
        if(this.stopTetris)
            this.stopTetris = false;
    },

    playerBoundBoxCollision: function(player, boundBox){
        if (player.body.top === boundBox.body.bottom){
            this.levelMusic.stop();
            this.scene.start("GameOver", {callerScene: 'Level3'});
            this.scene.stop();
        }
        else if (player.body.bottom === boundBox.body.top){
            this.enableJump(player, boundBox);
        }
        else{
            this.currentTetrisFigure.forEach(boundBox => {
                boundBox.body.setVelocityX(0);    
            });
            player.body.setVelocityX(0);
        }
    },

    figureFall: function(){
        let number = Phaser.Math.Between(0,4);
        let x = this.player.body.left;
        let figure = number === 0 ? 'tetris':'tetris'.concat(number.toString());

        if (this.currentTetrisFigure.length === 0)
            this.createFigure(x, 100, figure);
    }
});