import Phaser from 'phaser';

export var Level1 = Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Level1() {
        Phaser.Scene.call(this, { key: 'Level1'});

        //  SCENE VARIABLES
        this.map;
        this.tileset;
        this.background;
        this.clouds;
        this.platforms;
        this.player;
        this.coins;
        this.camera;
        this.help;
        this.score;
        this.scoreText = [];
        this.currentVolume;
        this.levelMusic;
        this.timedEvent;
        this.jumpSound;
        this.coinSound;
        this.bubble;
        this.pacmanStill;
        this.gameWidth = 1000;
        this.gameHeight = 620;
        this.pacmanTween;
        this.pacmanMoveDuration; //TEST
        this.pacmanWakeUp = [];
        this.bubbleSentences = [];

        //  AUX VARIABLES
        this.keyBoardSpace;
        this.defaultPLayer;
        this.pacmanOriention;
        this.PacmanXArray = [];
        this.scoreFlag;
        this.maxXTreshold;
        this.minXTreshold;
        this.cameraOff;
        this.timedEvent;
        this.lockRightMovement;

        //  WORK IN PROGRESS
        this.letter;

        //  HACKS
        this.turboOn;
    },

    // ===================  PRELOAD SECTION =================================

    preload: function(){
    },

    // ===================  CREATE SECTION =================================

    create: function(){

        // SET ARRAYS OF X VALUES
        this.pacmanWakeUp = [
            5700,
            6262,
            6800,
            7516,
            8429,
            9109
        ];

        this.bubbleSentences = [
            {x: 0, sentence: "💰Collect coins to beat the game!💰"},
            {x: 1100, sentence: "Stay atop the platforms and try not to fall"},
            {x: 3000, sentence: "Hmmm 🤔 something's wrong with the coins..."},
            {x: 3450, sentence: "Well not many more to go!"},
            {x: 3975, sentence: "Uh oh 😬 this doesn´t look good"},
            {x: 4300, sentence: "Wait a minute... Something is wrong!"},
            {x: 5700, sentence: "I think these bugs are harmless"},
            {x: 6100, sentence: "Wow did you see that?! 😱😱😱"},
            {x: 6600, sentence: "Watch out! PACMAN's on a rampage!"},
            {x: 7200, sentence: "Those bugs dont seem harmless anymore! 😣 Stay away from them!"},
            {x: 8200, sentence: "Here! Take this suit, it might help!"},
            {x: 8900, sentence: "GO! Catch PACMAN now!!!"}
        ];

        //  INIT VARIABLES
        this.turboOn = false;
        this.pacmanStill = false;
        this.pacmanMoveDuration = 2100;
        this.lockRightMovement = false;
        this.defaultPLayer = true;
        this.sentence = null;
        this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));

        //  TILEMAP AND TILESET - BACKGROUND
        this.map = this.make.tilemap({key: 'map_level1'});
        this.tileset = this.map.addTilesetImage('tile_map', 'tileset_level1');

        //  TILEMAP LAYERS
        this.background = this.map.createStaticLayer("fundo", this.tileset, 0, 0);
        this.clouds = this.map.createStaticLayer("nuvens", this.tileset, 0, 0);
        this.platforms = this.map.createStaticLayer("plataformas", this.tileset, 0, 0);
        this.platforms.setCollisionByProperty({colliders: true});

        // GHOST
        this.ghost = this.physics.add.image(9380, 10, 'ghostCostume');
        this.ghost.setScale(0.3);

        //  PLAYER
        this.player = this.physics.add.sprite(35, 567, 'player').setDepth(1);
        this.player.setBounce(0.01);
        this.player.body.gravity.y = 500;
        this.player.body.setSize(32,83).setOffset(20,0);

        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'turn', frames: [{key: 'player', frame: 4}], frameRate: 15 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('player', {start: 5, end: 8}), frameRate: 10, repeat: -1 });

        //  COINS
        this.coins = this.physics.add.group({ key: 'coins', repeat: 27, setXY: {x: 5, y: 0, stepX: 114.5} });
        this.anims.create({key: 'coinsAnim', frames: this.anims.generateFrameNames('coins'), repeat: -1});
        this.coins.children.iterate(function (child) {
            child.setScale(0.6);
            child.anims.play("coinsAnim");
        });

        this.Viruscoins = this.physics.add.group({ key: 'virusCoins', repeat: 5, setXY: {x: 3190, y: 0, stepX: 120} });
        this.anims.create({key: 'virusCoinsAnim', frames: this.anims.generateFrameNames('virusCoins'), repeat: -1});
        this.Viruscoins.children.iterate(function (child) {
            child.setScale(0.13);
            child.anims.play("virusCoinsAnim");
        });

        //  PACMAN
        this.pacman = this.physics.add.sprite(20, 200, 'pacman').setScale(0.75).setVisible(false);
        this.pacman.setGravity(0,-300);
        this.pacman.setVisible(false);
        this.anims.create({ key: 'pacmanMove', frames: this.anims.generateFrameNumbers('pacman', {start: 0, end: 2}), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'pacmanEat', frames: this.anims.generateFrameNumbers('pacman', {start: 2, end: 10}), frameRate: 8, repeat: 0 });
        this.anims.create({ key: 'pacmanIdle', frames: [{key: 'pacman', frame: 2}], frameRate: 4, repeat: -1 });

        //  AFTER EATING ANIMATION => CREATE VIRUS TILE, MOVE PACMAN TO THE RIGHT AND LOCK IDLE PACMAN
        this.pacman.on("animationcomplete", this.pacmanEat, this);
        this.pacman.setVisible(true);

        //  COLLISIONS
        this.physics.add.collider(this.player, this.platforms, this.enableJump, null, this).name = 'platformPlayerCollision';
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.Viruscoins, this.platforms);
        this.physics.add.collider(this.ghost, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.Viruscoins, this.collectCoin, null, this);
        this.physics.add.overlap(this.ghost, this.player, this.ghostPlayer, null, this);
        this.physics.add.overlap(this.pacman, this.player, this.gameOver, null, this);
        this.physics.add.overlap(this.pacman, this.ghostPlayer, this.nextLevel, null, this);

        //  CAMERA
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);
        this.camera.setBounds(0, 20, this.map.widthInPixels, this.gameHeight);
        this.cameraOff = true;

        //  RESTRICT CAMERA AND PLAYER MOVEMENT SO THAT IT CAN ONLY MOVE IN FRONT
        this.maxXTreshold = this.player.body.right;
        this.minXTreshold = 0;

        //  PAUSE
        this.pause = this.add.image( 30, 40, 'pause').setInteractive();
        this.pause.setScale(0.5);
        this.pause.setScrollFactor(0);

        //  CURSORS
        this.cursors = this.input.keyboard.createCursorKeys();

        //  KEYBOARD
        this.keyBoardSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyBoardD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyBoardA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyBoardW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyBoardS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyBoardE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //  HELP
        this.help = this.add.image(this.gameWidth-100, 70, 'help').setScale(0.9);
        this.bubble = this.createBubble(this.gameWidth-315,10,180,50);
        this.bubble.setVisible(true);
        this.help.setScrollFactor(0);
        this.bubble.setScrollFactor(0);

        //  SCORE
        this.score = 0;
        this.scoreText.push(this.add.bitmapText(390, 20, 'arcade', 'S').setLetterSpacing(0).setTint(0x000000).setFontSize(20));
        this.scoreText.push(this.add.bitmapText(420, 20, 'arcade', 'C').setLetterSpacing(0).setTint(0x000000).setFontSize(20));
        this.scoreText.push(this.add.bitmapText(450, 20, 'arcade', 'O').setLetterSpacing(0).setTint(0x000000).setFontSize(20));
        this.scoreText.push(this.add.bitmapText(480, 20, 'arcade', 'R').setLetterSpacing(0).setTint(0x000000).setFontSize(20));
        this.scoreText.push(this.add.bitmapText(510, 20, 'arcade', 'E').setLetterSpacing(0).setTint(0x000000).setFontSize(20));
        this.scoreText.push(this.add.bitmapText(530, 20, 'arcade', `:${this.score}`).setLetterSpacing(0).setTint(0x000000).setFontSize(20));
        //this.scoreText = this.add.bitmapText(390, 20, 'arcade', `Score:${this.score}`).setLetterSpacing(5).setTint(0x000000).setFontSize(20);
        //this.scoreText.setScrollFactor(0);
        this.scoreText.forEach(element => {
            element.setScrollFactor(0);
        });
        this.scoreFlag = true;

        //  MUSIC
        this.levelMusic = this.sound.add("Level1Audio");
        this.levelMusic.loop=true;
        this.levelMusic.setVolume(this.currentVolume);
        this.jumpSound=this.sound.add("jumpAudio");
        this.jumpSound.setVolume(0.5*this.currentVolume);
        this.coinSound=this.sound.add("coinAudio");
        this.coinSound.setVolume(0.25*this.currentVolume);
        this.levelMusic.play();
        if (localStorage.getItem('audioMuted') === "true")
            this.muteAllAudio(true);
        else
            this.muteAllAudio(false);

        //  CHANGING TO PAUSE MENU
        this.pause.on('pointerup', ()=>{
            this.scene.pause();
            this.scene.launch('PauseMenu', {callerScene: 'Level1'});
        }, this);

        this.input.keyboard.on('keyup-ESC', ()=>{
            this.input.stopPropagation();
            this.scene.pause();
            this.scene.launch('PauseMenu', {callerScene: 'Level1'});
        }, this);

        // SCENE EVENTS
        this.events.on('shutdown', ()=>{
            this.levelMusic.stop();
        }, this);

        this.events.on('pause', ()=>{
            this.levelMusic.pause();
        }, this);

        this.events.on('resume', ()=>{
            if (localStorage.getItem('audioMuted') === 'true')
                this.muteAllAudio(true);
            else
                this.muteAllAudio(false);
            this.levelMusic.play();
        },this);


        //  HACKS
        this.input.keyboard.on('keyup-T', ()=>{
            if (this.turboOn){
                this.turboOn = false;
                console.log("TURBO OFF");
            }
            else{
                this.turboOn = true;
                console.log("TURBO ON");
            }
        });

        /*------------- TESTS  -----------------*/
        this.input.keyboard.on('keyup-P', ()=>{
            //console.log(this.player.body.right);
            this.PacmanXArray.push(this.player.body.right);
        },this);
        //this.input.keyboard.on('keyup-F', ()=>{console.log("FINAL ARRAY", this.PacmanXArray);}, this);
        //this.input.keyboard.on('keyup-L', ()=>{console.log("LEFT ", this.player.body.left);}, this);

        this.speak(0);
    },

    // ===================  UPDATE SECTION =================================

    update: function() {
        
        //  SELECT THE PLAYER OBJECT TO USE
        let player = this.defaultPLayer ? this.player : this.playerGhost;

        //  PLAYER MOVEMENT
        this.playerMovement(player);
        this.checkFellStatus(player);
       
    },  
        
    //  ONLY JUMP WHEN PLAYER'S BOTTOM IS TOUCHING TILE'S TOP
    enableJump: function(player, tile){
        if (tile.pixelY === player.body.bottom) {
            if (this.keyBoardSpace.isDown){
                this.input.stopPropagation();
                
                //  HACK
                if (this.turboOn)
                    this.player.setVelocityY(-600);
                else
                    this.player.setVelocityY(-400);

                this.jumpSound.play();
            }
        }    
    },

    //  ACTION TRIGGERED BY PLAYER-COIN OVERLAP
    collectCoin: function(_, coin) {
        coin.destroy();
        this.score += 1;
        if(this.player.body.right >= 100){
            //letters fall
            this.scoreText.forEach(letter => {
                if (letter._text === 'S' || letter._text === 'O'){
                    this.physics.world.enable(letter);
                    letter.setScrollFactor(1);
                    letter.body.setCollideWorldBounds(true);
                    letter.body.setBounceY(0.2);
                    letter.body.setOffset(0,0);
                    this.physics.add.collider(letter, this.platforms, this.letterFall, null, this);
                }    
            });
        }
        this.scoreText[this.scoreText.length-1].setText(`:${this.score}`);
        this.coinSound.play();
    },
    
    //  GHOST IMAGE AND DEFAULT PLAYER OVERLAP FUNCTION
    ghostPlayer: function(ghost, player) {
        ghost.destroy();
        player.destroy();
        this.playerGhost = this.physics.add.sprite(9380, 150, 'ghostPlayer');
        this.physics.add.collider(this.playerGhost, this.platforms, null, null, this);
        this.playerGhost.setGravity(0,-300);
        this.playerGhost.setScale(0.3);
        this.anims.create({key: 'ghostAnim', frames: this.anims.generateFrameNames('ghostPlayer'), frameRate: 6, repeat: -1});
        this.playerGhost.anims.play("ghostAnim");
        this.defaultPLayer = false;
    },

    //  CHECK PLAYER RELATED KEYPRESSES
    playerMovement: function (player){

        let pressedKeys = [];

        if (player.body.right >= 9600 && !this.pacmanStill){
            this.pacmanWakeUp = [];
            this.pacmanTween.stop();
            this.pacmanStill = true;
            this.pacman.destroy();
            this.pacman = this.physics.add.sprite(9600, 500, 'pacman').setScale(0.75).setVisible(true);
            this.pacman.setGravity(0,-300);
            this.physics.add.collider(this.pacman, this.ghostPlayer, this.nextLevel, null, this);
        }
        
        if (!this.defaultPLayer && player.body.top >= this.pacman.body.top && player.body.left >= this.pacman.body.left || !this.defaultPLayer && player.body.top >= this.pacman.body.top && player.body.right <= this.pacman.body.right)
            this.nextLevel();


        if (this.cursors.right.isDown)
            pressedKeys.push('right');

        if (this.cursors.left.isDown)
            pressedKeys.push('left');

        if (this.cursors.up.isDown)
            pressedKeys.push('top')

         //  PLAYER MOVEMENT
        if (this.cursors.right.isDown && !this.lockRightMovement && this.checkBounds(player, pressedKeys)) {
             //  HACK
            if (this.turboOn)
                player.setVelocityX(800);
            else
                player.setVelocityX(200);
            
            if(!this.defaultPLayer)
                player.setVelocityY(0);
            
            //  SPECIFIC ANIMATIONS FOR THIS.PLAYER
            if (this.defaultPLayer)
                player.anims.play('right', true);

            //  IF THE PLAYER MOVED PAST THE ITS MAX RECORDED X VALUE
            //  UPDATE THAT MAX VALUE AND MAKE SURE THE CAMERA FOLLOWS THE PLAYER
            //  MOVING THE ACTION FORWARD
            if (player.body.right > this.maxXTreshold) {
                this.maxXTreshold = player.body.right;
                this.minXTreshold = Math.round(this.camera.worldView.left);
                this.cameraOff = false;
            }
            if (this.cameraOff === false)
                this.camera.startFollow(player);
            
            // CHECK FOR PACMAN TO APPEAR
            this.checkPacmanAppear(player.body.right);
            
            //  CHECK FOR NEW BUBBLE IN THE SENTENCE
            this.speak(player.body.right);

            if(Math.round(player.body.right)<4300 && Math.round(player.body.right)>4290)
                this.timedEvent = this.time.addEvent({ delay: 2000, callback: this.stopMusic, callbackScope: this, repeat: 11 });
            
        }
        else if (this.cursors.left.isDown && this.checkBounds(player, pressedKeys) ) {

            //  IF PLAYER IS MOVING TO THE LEFT STOP MOVING THE CAMERA
            //  THIS WAY AND ALSO BY LIMITING HOW FURTHER BACK THE PLAYER CAN GO
            //  WE CAN SIMULATE A ONE WAY PATH
            if (this.cameraOff !== true)
                this.cameraOff = true;
            this.camera.stopFollow();
            if(!this.defaultPLayer){
                player.setVelocityY(0);
                player.setVelocityX(0);
            }
            player.setVelocityX(-200);
            if(this.defaultPLayer)
                this.player.anims.play('left', true);
        }

        else if (!this.defaultPLayer && this.cursors.up.isDown && this.checkBounds(player, pressedKeys)){
            if (this.turboOn)
                player.setVelocityY(-400);
            else
                player.setVelocityY(-200);
            player.setVelocityX(0);
        }

        else if (!this.defaultPLayer && this.cursors.down.isDown){
            if (this.turboOn)
                player.setVelocityY(400);
            else
                player.setVelocityY(200);

            player.setVelocityX(0);
        }
        else {
            if(this.defaultPLayer){
                player.setVelocityX(0);
                player.anims.play('turn');
            }
            else{
                player.setVelocityX(0);
                player.setVelocityY(0);
            }
        }
        this.input.stopPropagation();
    },

    //  CHECK IF PAYER FELL / IS BELOW GROUND
    checkFellStatus: function(player) {
        //  FELL FROM THE MAP
        if (player.body.top > this.map.heightInPixels)
            this.gameOver();
    },

    // CHECK IF PLAYER IS INSIDE OUR CAMERA/WORLD BOUNDS
    checkBounds: function(player, pressedKeys){
        let top = (Math.round(player.body.top) > 0) ? true:false;
        let left = (Math.round(player.body.left) >= 0 && Math.round(player.body.left) >= this.minXTreshold) ? true:false;
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
        this.jumpSound.setMute(value);
        this.coinSound.setMute(value);
    },

    // EAT ANIMATION EVENT + VIRUS TRAIL + POSITION ADJUST
    pacmanEat: function(event){
        if (this.pacman.anims.currentAnim.key === "pacmanEat"){
            
            let virusTile = this.physics.add.image(this.pacman.body.left + 90, this.pacman.body.top + 35, 'virusTile').setScale(0.75).setDepth(0);
            virusTile.body.gravity.y = -300;
            this.physics.add.collider(virusTile, this.player, this.gameOver, null, this);

            if (this.pacman.angle === 90){
                virusTile.x = this.pacman.x + 0.5;
                virusTile.y = this.pacman.y - 18;
            }

            else if (this.pacman.angle === -180){
				virusTile.x = this.pacman.x + 18;
                virusTile.y = this.pacman.y + 0.5;
            }

            else if (this.pacman.angle === -90) {
				virusTile.x = this.pacman.x - 0.5;
                virusTile.y = this.pacman.y + 18;
            }

            virusTile.angle = this.pacman.angle;
            
            this.pacman.setDepth(1);
            if (this.pacman.angle === 0)
                this.pacman.x = this.pacman.body.right + 10;
            else if(this.pacman.angle === 90)
				this.pacman.y = this.pacman.body.bottom + 100;
			else if(this.pacman.angle === -90) 
				this.pacman.y = this.pacman.body.top - 85;
			else
				this.pacman.x = this.pacman.body.left - 15;
        
            this.pacman.anims.play('pacmanIdle');

            this.createAndPlayPacmanTween(false);
        }
    },

    tweenPacmanStart: function(tween, targets, pacman){
        pacman.setVisible(true);
        pacman.anims.play('pacmanMove', true);
    },
    tweenPacmanComplete: function(tween, targets, pacman){
        pacman.anims.play('pacmanEat', true);
    },
    hidePacman: function(tween, targets, pacman){
        pacman.setVisible(false);
    },
    
    //  CREATE THE TWEENS
    createAndPlayPacmanTween: function(first){
        /*
                    Config Values
          enterScreen: true || false,
          horizontal: true || false,
          orientation: 0 || 90 || -90 || -180,
          stopX: (any value) || null,
          stopY: (any value) || null,
          xInit: (any value) || null,
          yInit: (any value) || null
        */
        
        let config = first ? this.currentPacmanConfigs[0]:this.currentPacmanConfigs[1];
        // ADJUST POSITION IF PACMAN IS ENTERING THE AREA
        // OTHERWHISE KEEP THE CURRENT X AND Y VALUES
        this.pacman.angle = config.orientation
        if (this.pacman.angle == 90 || this.pacman.angle == -90)
            this.pacman.body.setSize(80,80).setOffset(90,0);
        else
            this.pacman.body.setSize();

        if (config.enterScreen){
            this.pacman.x = config.xInit;
            this.pacman.y = config.yInit;
        }


        // Entering Screen
        if (config.enterScreen){
            //  Horizontal
            if (config.horizontal){
                this.pacmanTween =  this.tweens.add({
                    targets: this.pacman,
                    x: config.stopX,
                    duration: this.pacmanMoveDuration,
                    ease: 'Linear',
                    delay: 80,
                    onStart: this.tweenPacmanStart,
                    onStartParams: this.pacman,
                    onComplete: this.tweenPacmanComplete,
                    onCompleteParams: this.pacman
                });
            }
            // Vertical
            else{
                this.pacmanTween =  this.tweens.add({
                    targets: this.pacman,
                    y: config.stopY,
                    duration: this.pacmanMoveDuration,
                    ease: 'Linear',
                    delay: 80,
                    onStart: this.tweenPacmanStart,
                    onStartParams: this.pacman,
                    onComplete: this.tweenPacmanComplete,
                    onCompleteParams: this.pacman
                });
            }
        }
        // Leaving Screen
        else{
            //  Horizontal
            if (config.horizontal){

                this.pacmanTween =  this.tweens.add({
                    targets: this.pacman,
                    x: config.orientation == 0 ? this.minXTreshold + 1500 : this.minXTreshold - 200,
                    duration: this.pacmanMoveDuration,
                    ease: 'Linear',
                    delay: 80,
                    onStart: this.tweenPacmanStart,
                    onStartParams: this.pacman,
                    onComplete: this.hidePacman,
                    onCompleteParams: this.pacman
                });
            }
            // Vertical
            else{
                this.pacmanTween =  this.tweens.add({
                    targets: this.pacman,
                    y: config.orientation === 90 ? 800:-200,
                    duration: this.pacmanMoveDuration,
                    ease: 'Linear',
                    delay: 80,
                    onStart: this.tweenPacmanStart,
                    onStartParams: this.pacman,
                    onComplete: this.hidePacman,
                    onCompleteParams: this.pacman
                });
            }
        }
    },

    //  GET CONFIGS FOR TWEENS
    getPacmanTweens: function(x){
        let horizontalCheck = Phaser.Math.Between(1,2)  === 1 ? true:false;
        let orientationValue,
            leftRight = null,
            upDown = null,
            stopXValue = null,
            stopYValue = null,
            yInitValue = null,
            xInitValue = null;

        // RANDOM ORIENTATION
        if (horizontalCheck)
            orientationValue = Phaser.Math.Between(1,2) === 1 ? 0:-180;
        else
            orientationValue = Phaser.Math.Between(1,2) === 1 ? 90:-90;
        
        //  ENTERING HORIZONTALLY
        if (horizontalCheck){
            if (orientationValue === 0)
                xInitValue = this.minXTreshold - 200;
            
            else // orientation === -180
                xInitValue = this.minXTreshold + 1200;

            stopXValue = Phaser.Math.Between(x-80, x + 150);
            yInitValue = Phaser.Math.Between(100, 350);
            stopYValue = null;
        }
        //  ENTERING VERTICALLY
        else if(!horizontalCheck){
            if (orientationValue === 90)
                yInitValue = -200;
            else    // orientaion === -90
                yInitValue = 800;

            stopXValue = null;
            leftRight = Phaser.Math.Between(0,1);
            xInitValue = leftRight === 1 ? Phaser.Math.Between(x+120, this.minXTreshold-890):Phaser.Math.Between(this.minXTreshold+90, x-90);
            stopYValue = Phaser.Math.Between(150,350);
        }

        return [
            {enterScreen: true, horizontal: horizontalCheck, orientation: orientationValue, stopX: stopXValue, stopY: stopYValue, xInit: xInitValue, yInit: yInitValue},
            {enterScreen: false, horizontal: horizontalCheck, orientation: orientationValue, stopX: stopXValue, stopY: stopYValue, xInit: xInitValue, yInit: yInitValue}
        ]
        // return config array for both entrance and exit
    },

    checkPacmanAppear: function(playerLeftX){
        //  CHECK IF ITS TIME FOR PACMAN TO APPEAR
        if (playerLeftX >= this.pacmanWakeUp[0]){
            // POP THE CURRENT VALUE SETTINGS
            let referenceX = this.pacmanWakeUp.shift();
            //console.log("referenceX: ", referenceX);
            this.currentPacmanConfigs = this.getPacmanTweens(referenceX);
            this.createAndPlayPacmanTween(true);
        }
    },

    //HELP BUBBLE
    createBubble: function(x,y,width,height){
        this.bubbleWidth = width;
        this.bubbleHeight = height;
        this.bubblePadding = 10;
        let arrowHeight = this.bubbleHeight / 3;
    
        this.bubble = this.add.graphics({ x: x, y: y });
    
        //  Bubble color
        this.bubble.fillStyle(0xffffff, 1);
    
        //  Bubble outline line style
        this.bubble.lineStyle(4, 0x565656, 1);
    
        //  Bubble shape and outline
        this.bubble.strokeRoundedRect(0, 0, this.bubbleWidth, this.bubbleHeight, 16);
        this.bubble.fillRoundedRect(0, 0, this.bubbleWidth, this.bubbleHeight, 16);
    
        //  Calculate arrow coordinates
        var point1X = Math.floor(this.bubbleWidth*3 / 4);
        var point1Y = this.bubbleHeight;
        var point2X = Math.floor((this.bubbleWidth*2.5 / 4) * 1.4);
        var point2Y = this.bubbleHeight;
        var point3X = Math.floor((this.bubbleWidth*2.5 / 4) * 1.4);
        var point3Y = Math.floor(this.bubbleHeight + arrowHeight);
    
        //  Bubble arrow fill
        this.bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        this.bubble.lineStyle(2, 0x565656, 1);
        this.bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        this.bubble.lineBetween(point1X, point1Y, point3X, point3Y);
    
        // ACABA AQUI
        return this.bubble;
    },
    
    speak : function(pos){
        
        let helpSentence;

        try {
            if(pos < this.bubbleSentences[0].x)
                return;
        } catch (error) {
            return;    
        }

        helpSentence = this.bubbleSentences.shift();

        if( this.sentence )
            this.sentence.destroy();
                
        this.sentence = this.add.text(0, 0, helpSentence.sentence, { fontFamily: 'ComicSans', fontSize: 14, color: '#000000', align: 'center', wordWrap: { width: this.bubbleWidth - (this.bubblePadding * 2) } });
        this.sentence.setScrollFactor(0);
        let bounds = this.sentence.getBounds();
        this.sentence.setPosition(this.bubble.x + (this.bubbleWidth / 2) - (bounds.width / 2), this.bubble.y + (this.bubbleHeight / 2) - (bounds.height / 2));
        //let container = this.add.container();
        //container.add([ this.bubble, this.sentence ]);
        //return container;
    },

    nextLevel: function(){
        this.levelMusic.stop();
        this.scene.launch("Level2");
        this.scene.stop();
    },

    gameOver: function(){
        this.levelMusic.stop();
        this.scene.start("GameOver", {callerScene: 'Level1'});
        this.scene.stop();
    },

    stopMusic: function(){

        if(this.levelMusic.isPaused==false)
                this.levelMusic.pause();
        else
            this.levelMusic.resume();
    },

    letterFall: function(letter, tile){
        letter.body.setImmovable(true);
    }
});