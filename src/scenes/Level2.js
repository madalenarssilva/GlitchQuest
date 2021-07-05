import Phaser from 'phaser';

export var Level2 = Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Level2() {
        Phaser.Scene.call(this, {key: 'Level2'});

        //  SCENE VARIABLES
        this.map;
        this.tileset;
        this.background;
        this.clouds;
        this.platforms;
        this.ground;
        this.player;
        this.camera;
        this.help;
        this.bubble;
        this.pause;
        this.dino;
        this.playerBoost; 
        this.i;
        this.gameOverMusic;
        this.levelMusic;
        this.jumpSound;
        this.currentVolume;
        this.arrayLight;
        this.gameWidth = 1000;
        this.gameHeight = 620;
        this.wifiCount;

        //  AUX VARIABLES
        this.keyBoardSpace;
        this.maxXThreshold;
        this.minXThreshold;
        this.currentLight
        this.cameraOff;
        this.inPopUp;

        //  HACKS
        this.turboOn;
    },

    preload: function () {

    },

//------------------------------------CREATE-------------------------------------------

    create: function () {        

        this.bubbleSentences = [
            {x: 0, sentence: "Oh boy, something is coming😱"},
            {x: 900, sentence: "RUUUUUUUUN🙈"},
            {x: 1500, sentence: "You have to pick up ALL of the signal bars!"},
            {x: 2200, sentence: "There's one on the upper path here"},
            {x: 3300, sentence: "Keep going! Don't look back! 😰"},
            {x: 4700, sentence: "There's one coming up ahead"},
            {x: 6000, sentence: "Oh... there's fire🔥.... of course, that's all we needed 🙄"},
            {x: 8000, sentence: "There's one more coming up ahead"},
            {x: 9000, sentence: "Go up and get the last one so I can reset the connection!"},
        ];

        //  INIT VARIABLES
        this.playerBoost = 0;
        
        this.turboOn = false;
        this.currentLight = 0x222222;
        this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));
        this.arrayLight = [0x111111, 0x111111, 0x111111, 0x999999];
        this.wifiCount=0;

        //  TILEMAP E TILESET - BACKGROUND
        this.map = this.make.tilemap({key: 'map_level2'});
        this.tileset = this.map.addTilesetImage('tileset1', 'tileset_level2_3');

        //  TILEMAP LAYERS
        this.background = this.map.createStaticLayer("fundo", this.tileset, 0, 0);
        this.clouds = this.map.createStaticLayer("nuvens", this.tileset, 0, 0);
        this.platforms = this.map.createStaticLayer("plataforma", this.tileset, 0, 0);
        this.ground = this.map.createStaticLayer("chao", this.tileset, 0, 0);

        this.platforms.setCollisionByProperty({colliders: true});
        this.ground.setCollisionByProperty({colliders: true});

        this.wifi_1 = this.add.image(500, 90, 'wifi1').setScale(0.4).setAlpha(0.3).setScrollFactor(0);
        this.wifi_2 = this.add.image(500, 55, 'wifi2').setAlpha(0.7).setAlpha(0.3).setScrollFactor(0);
        this.wifi_3 = this.add.image(500, 30, 'wifi3').setScale(1.4).setAlpha(0.3).setScrollFactor(0);
        this.wifi_4 = this.add.image(500, 5, 'wifi4').setScale(1.8).setAlpha(0.3).setScrollFactor(0);    

        //  WIFI ANIM
        this.wifi1 = this.physics.add.sprite(3212, 200, 'wifi1');
        this.anims.create({key: 'wifi1Anim', frames: this.anims.generateFrameNames('wifi1'), frameRate:8, repeat: -1});
        this.wifi1.anims.play("wifi1Anim");
        this.wifi2 = this.physics.add.sprite(5620, 200, 'wifi2');
        this.anims.create({key: 'wifi2Anim', frames: this.anims.generateFrameNames('wifi2'), frameRate:8, repeat: -1});
        this.wifi2.anims.play("wifi2Anim");
        this.wifi3 = this.physics.add.sprite(8680, 200, 'wifi3');
        this.anims.create({key: 'wifi3Anim', frames: this.anims.generateFrameNames('wifi3'), frameRate:8, repeat: -1});
        this.wifi3.anims.play("wifi3Anim");
        this.wifi4 = this.physics.add.sprite(10080, 200, 'wifi4');
        this.anims.create({key: 'wifi4Anim', frames: this.anims.generateFrameNames('wifi4'), frameRate:8, repeat: -1});
        this.wifi4.anims.play("wifi4Anim");

        //  PLAYER
        this.player = this.physics.add.sprite(500, 567, 'player');
        this.player.setBounce(0.01);
        this.player.body.gravity.y = 500;
        this.player.body.setSize(32,83).setOffset(20,0);

        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'turn', frames: [{key: 'player', frame: 4}], frameRate: 20 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('player', {start: 5, end: 8}), frameRate: 10, repeat: -1 });

        this.player.anims.play('turn');

        //  CAMERA
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameraOff = true;
        
        //  RESTRICT CAMERA AND PLAYER MOVEMENT SO THAT IT CAN ONLY MOVE IN FRONT
        this.maxXTreshold = this.player.body.right;
        this.minXTreshold = 0;
        
        //  DINO
        this.dino = this.physics.add.sprite(-180, 0, 'dino').setDepth(1);
        this.anims.create({key: 'dinoAnim', frames: this.anims.generateFrameNames('dino'), repeat: -1});
        this.dino.setScale(0.949);
        this.dino.anims.play("dinoAnim");
        this.tween = this.tweens.add({
            targets: this.dino,
            x: 16000,
            duration: 73000,
            ease: 'Liner',
            delay: 4000,
            onStart: this.shakeDino,
            onStartParams: this.tween
        });

        // FIREBALLS EVENT
        this.fireballsTimed = this.time.addEvent({ delay: 5000, callback: this.fireballs, callbackScope: this});

        //MUSIC
        this.levelMusic = this.sound.add("Level2Audio");
        this.levelMusic.loop=true;
        this.levelMusic.setVolume(this.currentVolume);
        this.jumpSound=this.sound.add("Jump");
        this.jumpSound.setVolume(0.5*this.currentVolume);
        this.levelMusic.play();
        if (localStorage.getItem('audioMuted') === "true")
            this.muteAllAudio(true);
        else
            this.muteAllAudio(false);

        //  COLLISIONS
        this.physics.add.collider(this.player, this.platforms, this.enableJump, null, this).name = 'platformPlayerCollision';
        this.physics.add.collider(this.player, this.ground, this.enableJump, null, this);
        this.physics.add.collider(this.wifi1, this.ground);
        this.physics.add.collider(this.wifi1, this.platforms);
        this.physics.add.collider(this.wifi2, this.ground);
        this.physics.add.collider(this.wifi2, this.platforms);
        this.physics.add.collider(this.wifi3, this.ground);
        this.physics.add.collider(this.wifi3, this.platforms);
        this.physics.add.collider(this.wifi4, this.ground);
        this.physics.add.collider(this.wifi4, this.platforms);
        this.physics.add.collider(this.dino, this.ground);
        this.physics.add.overlap(this.player, this.dino, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.wifi1, this.wifiSignal, null, this);
        this.physics.add.overlap(this.player, this.wifi2, this.wifiSignal, null, this);
        this.physics.add.overlap(this.player, this.wifi3, this.wifiSignal, null, this);
        this.physics.add.overlap(this.player, this.wifi4, this.wifiSignal, null, this);

        //  PAUSE
        this.pause = this.add.image( 30, 40, 'pause').setInteractive();
        this.pause.setScale(0.5);
        this.pause.setScrollFactor(0);

        //  CURSORS
        this.cursors = this.input.keyboard.createCursorKeys();

        //  KEYBOARD
        this.keyBoardSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //  HELP
        this.help = this.add.image(this.gameWidth-100, 70, 'help').setScale(0.9);
        
        this.bubble = this.createBubble(this.gameWidth-315,10,180,50)
        this.help.setScrollFactor(0);
        this.bubble.setScrollFactor(0);

        // LIGHT
        this.background.setPipeline('Light2D');
        this.clouds.setPipeline('Light2D');
        this.platforms.setPipeline('Light2D');
        this.ground.setPipeline('Light2D');
        this.player.setAlpha(0.06);
        this.bubble.setAlpha(0.01);
        this.help.setAlpha(0.04);
        this.wifi_1.setAlpha(0.05);
        this.wifi_2.setAlpha(0.05);
        this.wifi_3.setAlpha(0.05);
        this.wifi_4.setAlpha(0.05);
        this.lights.addLight(400, 400, 200).setScrollFactor(0.0).setIntensity(2);
        this.lights.setAmbientColor(this.currentLight);
        this.lights.enable();

        //  CHANGING TO PAUSE MENU
        this.pause.on('pointerup', function () {
            this.scene.pause();
            this.scene.launch('PauseMenu', {callerScene: 'Level2'});
        }, this);

        this.input.keyboard.on('keyup-ESC', function () {
            this.input.stopPropagation();
            this.scene.pause();
            this.scene.launch('PauseMenu', {callerScene: 'Level2'});
        }, this);

        // SCENE EVENTS
        this.events.on('shutdown', function(){
            this.levelMusic.stop();
        }, this);

        this.events.on('pause', function(){
            this.levelMusic.pause();
        }, this);

        this.events.on('resume', function(){
            // FROM PAUSE
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
                this.speak(0);
                this.player.setAlpha(1);
                this.bubble.setAlpha(1);
                this.help.setAlpha(1);
                this.levelMusic.play();
                this.wifi_1.setAlpha(0.3);
                this.wifi_2.setAlpha(0.3);
                this.wifi_3.setAlpha(0.3);
                this.wifi_4.setAlpha(0.3);
            }

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

        // POP UP MENU
        this.inPopUp = true;
        this.scene.pause();
        this.scene.launch('PopUp', {callerScene: 'Level2'});

    },

    update: function() {
        //  PLAYER MOVEMENT
        this.playerMovement(this.player);
    },  
        
    //  ONLY JUMP WHEN PLAYER'S BOTTOM IS TOUCHING TILE'S TOP
    enableJump: function(player, tile){
        if (tile.pixelY === player.body.bottom) {
                if (this.keyBoardSpace.isDown){
                    this.input.stopPropagation();
                    this.player.setVelocityY( -400 - (this.playerBoost*0.5) );
                    this.jumpSound.play();
                }
            }
    },

    //  CHECK PLAYER RELATED KEYPRESSES
    playerMovement: function (player){

        let pressedKeys = [];
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
                player.setVelocityX(400);
            else
                player.setVelocityX(200 + this.playerBoost);

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
            this.speak(player.body.right);
        }
        else if (this.cursors.left.isDown && this.checkBounds(player, pressedKeys) ) {
            
            //  IF PLAYER IS MOVING TO THE LEFT STOP MOVING THE CAMERA
            //  THIS WAY AND ALSO BY LIMITING HOW FURTHER BACK THE PLAYER CAN GO
            //  WE CAN SIMULATE A ONE WAY PATH
            if (this.cameraOff !== true)
                this.cameraOff = true;
            this.camera.stopFollow();
            player.setVelocityX(-200 - this.playerBoost);
            this.player.anims.play('left', true);
        }
        else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
        this.input.stopPropagation();
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
    },

    gameOver: function () {
        this.levelMusic.stop();
        this.scene.start("GameOver", {callerScene: 'Level2'});
        this.scene.stop();
    }, 

    wifiSignal: function(_,wifi) {
        if(wifi === this.wifi1){
            this.wifi_1.setAlpha(1);
        }
        else if(wifi === this.wifi2){
            this.wifi_2.setAlpha(1);  
        }
        else if(wifi === this.wifi3){
            this.wifi_3.setAlpha(1);
        }
        else{
            this.wifi_4.setAlpha(1);
        }
        wifi.destroy();
        this.camera.shake(300);
        // CHANGE LIGHT
        this.currentLight = this.currentLight + this.arrayLight[this.wifiCount];
        this.lights.setAmbientColor(this.currentLight);
        this.wifiCount++;

        if (this.wifiCount < 4){
            this.playerBoost = 150;
            this.time.delayedCall(2000, ()=>{
                this.playerBoost = 0;
            }, [], this);
        }

        if(this.player.body.right >= this.map.widthInPixels - 350 && this.wifiCount < 4){
           //  GET THE CORRECT COLLISION OBJECT FROM SCENE
           let collisionObject = this.physics.world.colliders.getActive().find((i)=>{
                return i.name === 'platformPlayerCollision';
            });

            // DESTROY COLLISION OBJECT SO THAT PLAYER FALLS
            collisionObject.destroy();
            
            this.timedEvent = this.time.delayedCall(1050, ()=>{
                this.gameOver();
            }, [], this);
        }
        else if(this.player.body.right >= 10048 && this.wifiCount === 4){
            this.timedEvent = this.time.delayedCall(1000, ()=>{
                this.scene.start("Level3");
                this.scene.stop();
            }, [], this);
        }
    }, 

    enableFire: function(fire, _) {
        fire.destroy();
    },
    
    fireRotate: function(fireball){
        this.time.addEvent({
            delay: 100,
            callback: ()=>{
                fireball.angle = fireball.angle + 8;
            },
            callbackScope: this,
            loop: true
        });
    },
    
    fireballs: function(){
        let fire = this.physics.add.sprite(this.dino.body.right-10, 350, 'fire').setScale(0.3).setDepth(0);
        fire.angle = -90;
        fire.setVelocityX(450);
        fire.setGravity(0,200);
        this.anims.create({
            key: 'fireAnim',
            frames: this.anims.generateFrameNames('fire'),
            repeat: -1
        });
        fire.anims.play("fireAnim");
        fire.setSize(120,220).setOffset(138,110);
        this.physics.add.collider(this.ground, fire, this.enableFire, null, this);
        this.physics.add.overlap(this.player, fire, this.gameOver, null, this);
    
        this.fireRotate(fire);

        this.fireballsTimed.reset({ delay: Phaser.Math.Between(1000, 3000), callback: this.fireballs, callbackScope: this, repeat: 1});
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
                
        this.sentence = this.add.text(0, 0, helpSentence.sentence, { fontFamily: 'Futura', fontSize: 14, color: '#000000', align: 'center', wordWrap: { width: this.bubbleWidth - (this.bubblePadding * 2) } });
        this.sentence.setScrollFactor(0);
        let bounds = this.sentence.getBounds();
        this.sentence.setPosition(this.bubble.x + (this.bubbleWidth / 2) - (bounds.width / 2), this.bubble.y + (this.bubbleHeight / 2) - (bounds.height / 2));
    },
    
    shakeDino: function(tween){
        tween.parent.scene.time.delayedCall(2000, ()=> {tween.parent.scene.camera.shake(300);}, [], this);
    }
});




