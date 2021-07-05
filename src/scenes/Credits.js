import Phaser from 'phaser';

export var Credits = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function Credits() {
        
        // CONSTRUCTOR
        Phaser.Scene.call(this, { key: 'Credits'});
        //console.log("Inside Credits");
    },

    init: function(data){
      this.callerScene = data.callerScene;
    },

    preload: function(){
    },

    create: function(){

      this.input.setDefaultCursor();
      this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));

      // CREDITS SPRITESHEET
      this.credits = this.add.sprite(500, 310, 'credits');
      this.anims.create({ key: 'creditsAnim', frames: this.anims.generateFrameNames('credits'), frameRate: 3, repeat: -1 });
      this.credits.anims.play('creditsAnim');
      this.add.text(180,250, 'Gonçalo Pereira', {fontSize: '75px', fill: 'white'} );
      this.add.text(210,350, 'José Domingos', {fontSize: '75px', fill: 'white'} );
      this.add.text(190,450, 'Madalena Silva', {fontSize: '75px', fill: 'white'} );

      this.input.keyboard.on('keydown', function () { this.exit(); }, this);

      this.input.on('pointerup', function(){ this.exit(); }, this);
        
      //PLAY MUSIC IF CREDITS IS NOT COMING 
      if (this.callerScene === 'MenuSettings'){ // || this.callerScene === 'FinalLevel' )
        // TODO: REPLACE FOR FINAL LEVEL SONG
        this.music = this.sound.add("Level3Audio");
        this.music.setVolume(this.currentVolume);
        
        if(localStorage.getItem('audioMuted')==='true')
          this.music.setMute(true);
        else
          this.music.setMute(false);

        this.music.play();
      } 

    },  

    exit: function(){
      location.reload();
      this.input.stopPropagation();
      this.scene.stop(this.callerScene);
      this.scene.start('LoadScene');
    }
});
