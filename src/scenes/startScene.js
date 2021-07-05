import Phaser from 'phaser';

export var StartScene = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function StartScene() {
        
        // CONSTRUCTOR
        Phaser.Scene.call(this, { key: 'StartScene'});
        console.log("Inside startScene");
        this.backgroudPlayer;
        this.music;
        this.currentVolume;
    },


    preload: function(){
    },

    create: function(){

        //  INIT
        this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));
        
        // BACKGROUND_PLAY_SPRITESHEET
        this.backgroudPlayer = this.add.sprite(500, 310, 'backgroundPlayer');
        this.anims.create({ key: 'playAnim', frames: this.anims.generateFrameNames('backgroundPlayer'), frameRate: 7, repeat: -1 });
        this.backgroudPlayer.anims.play("playAnim");

        // SETTINGS
        this.settings = this.add.image(920, 540, "settings").setInteractive();
        this.settings.setScale(0.3);
        this.settings.on('pointerup', function (event) {
            this.music.pause();
            this.scene.launch("MenuSettings");
            this.scene.pause();
        }, this);

        // PLAY BUTTON
        this.playBtn = this.add.sprite(370, 450, 'buttonPlay').setInteractive();
        this.playBtn.setScale(2.2);
        
        this.anims.create({
            key: "idle",
            frames: [{key: "buttonPlay", frame: 0}],
            frameRate: 20
        });
        
        this.anims.create({
            key: "hovered",
            frames: [{key: "buttonPlay", frame: 1}],
            frameRate: 20
        });

        this.anims.create({
            key: "clicked",
            frames: [{key: "buttonPlay", frame: 2}],
            frameRate: 20
        });

        //  IDLE BUTTON
        this.playBtn.anims.play("idle", true);

        //  MOUSE EVENT LISTENERS FOR THE BUTTON EFFECTS
        this.playBtn.on('pointerover', function (event) {
            this.playBtn.anims.play("hovered", true);
        }, this);
        this.playBtn.on('pointerout', function (event) {
            this.playBtn.anims.play("idle", true);
        }, this);
        this.playBtn.on('pointerdown', function (event) {
            this.playBtn.anims.play("clicked", true);
        }, this);
        this.playBtn.on('pointerup', function (event) {
            this.scene.start("MailScene");
            this.scene.stop();
        }, this);

        //PLAY MUSIC
        this.music = this.sound.add("StartSceneAudio");
        this.music.loop=true;
        this.music.setVolume(this.currentVolume);
        this.music.play();
        if (localStorage.getItem('audioMuted') === "true")
            this.music.setMute(true);
        else
            this.music.setMute(false);

        // ON RESUME
        this.events.on('resume', ()=>{
            if (localStorage.getItem('audioMuted') === "true")
                this.music.setMute(true);
            else
                this.music.setMute(false);
            
            this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));
            this.music.setVolume(this.currentVolume);
            this.music.resume();
        }, this);

        //  HACK
        //  KEYBOARD INPUT FOR LEVEL SELECTION
        this.input.keyboard.on('keyup-ONE', function () {
            this.scene.start("Level1");
            this.scene.stop();
            console.log("Selected Level 1");
        }, this);

        this.input.keyboard.on('keyup-TWO', function () {
            this.scene.start("Level2");
            this.scene.stop();
            console.log("Selected Level 2");
        }, this);

        this.input.keyboard.on('keyup-THREE', function () {
            this.scene.start("Level3");
            this.scene.stop();
            console.log("Selected Level 3");
        }, this);

        this.input.keyboard.on('keyup-FOUR', function () {
            this.scene.start("FinalLevel");
            this.scene.stop();
            console.log("Selected Level Final");
        }, this);

        this.events.on('shutdown', ()=>{this.music.stop();},this);
    }
});