import Phaser from 'phaser';

export var GameOver = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function GameOver() {
        
        // CONSTRUCTOR
        Phaser.Scene.call(this, { key: 'GameOver'});
        console.log("Inside GameOver");
        this.callerScene;
    },

    init: function(data){
        this.callerScene = data.callerScene;
    },

    preload: function(){
    },

    create: function(){

        // AUDIO
        this.gameOverAudio = this.sound.add('GameOverAudio');
        this.glitchEffect = this.sound.add('GlitchEffect');
        this.glitchEffect.loop = true;
        this.gameOverAudio.loop = true;
        this.gameOverAudio.play();
        this.glitchEffect.play();

        // GAMEOVER SPRITESHEET
        this.game_over = this.add.sprite(505, 310, 'game_over');
        this.anims.create({ key: 'game_overAnim', frames: this.anims.generateFrameNames('game_over'), frameRate: 8, repeat: -1 });
        this.game_over.anims.play('game_overAnim');
        this.add.text(250,480, 'PLAY AGAIN?', {fontSize: '75px', fill: 'yellow'} );
        this.text2 = this.add.text(340,550, 'YES', {fontSize: '64px', fill: 'yellow'} ).setInteractive();
        this.text3 = this.add.text(540,550, 'NO', {fontSize: '64px', fill: 'yellow'} ).setInteractive();

        this.text2.on('pointerup', function (event) {
            this.gameOverAudio.stop();
            this.glitchEffect.stop();
            this.scene.start(this.callerScene);
            this.scene.stop();
        }, this);

        this.text3.on('pointerup', function (event) {
            this.scene.launch("Credits", {callerScene: 'GameOver'});
        }, this);

        this.events.on('shutdown', ()=>{
            this.gameOverAudio.stop();
            this.glitchEffect.stop();
        }, this);

    }
});

