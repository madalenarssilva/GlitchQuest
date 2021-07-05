import Phaser from 'phaser';

export var FinalLevel = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function FinalLevel() {
        
        // CONSTRUCTOR
        Phaser.Scene.call(this, { key: 'FinalLevel'});
        console.log("Inside FinalLevel");
        
        //  Scene Variables
        this.map;
        this.tileset;
        this.background;
        this.clouds;
        this.platforms;
        this.player;
        this.levelMusic;
        this.camera;
        this.help;
        this.pause;
        this.gameWidth = 1000;
        this.gameHeight = 620;
        this.currentVolume;

        this.countClean;

        //  HACKS
        this.turboOn;
    },

    preload: function(){
    },

    create: function(){
        this.input.setDefaultCursor('url(../assets/arma_final.cur), pointer');
        
        //  INIT VARIABLES
        this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));

        //PLAY MUSIC
        this.levelMusic = this.sound.add("LevelFinal");
        this.levelMusic.setVolume(0.1*this.currentVolume);
        this.levelMusic.play();
        this.cleanSound = this.sound.add('cleanSound');
        this.cleanSound.setVolume(1*this.currentVolume);
        if (localStorage.getItem('audioMuted') === "true")
            this.muteAllAudio(true);
        else
            this.muteAllAudio(false);

        // CREDITS SPRITESHEET
        this.final_level = this.add.sprite(500, 310, 'final_level');
        this.anims.create({ key: 'finalLevelAnim', frames: this.anims.generateFrameNames('final_level'), frameRate: 2, repeat: -1});
        this.final_level.anims.play('finalLevelAnim');
        this.virusGroup = this.add.group();

        for(var i=0; i<500; i++){
            var xx = Phaser.Math.Between(0, this.gameWidth);
            var yy = Phaser.Math.Between(0, this.gameHeight);
            this.virus = this.add.image(xx, yy, 'virus');
            this.virus.setScale(2);
            this.virusGroup.add(this.virus);
        }

        this.countClean = 0;
        this.input.setHitArea(this.virusGroup.getChildren()).on('pointerover', function(event, virusTile){
            if (virusTile[0].type === "Image"){
                if (this.countClean % 20 === 0)
                    if (!this.cleanSound.isPlaying)
                        this.cleanSound.play();
                this.virusGroup.remove(virusTile[0]);
                virusTile[0].destroy();
                if(this.virusGroup.getLength() === 0){
                    document.getElementById("game-area").style.cursor = "default";
                    this.input.setDefaultCursor();
                    this.scene.start("Credits");
                    this.scene.stop();
                }
                this.countClean++;
            }
        },this);
   },
   
    //  MUTE ALL AUDIO FILES
    muteAllAudio: function(value){
        this.levelMusic.setMute(value);
    },

});