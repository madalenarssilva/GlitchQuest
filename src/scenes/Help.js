import Phaser from 'phaser';

export var Help = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function Help() {
        
        // CONSTRUCTOR
        Phaser.Scene.call(this, { key: 'Help'});
        console.log("Inside Credits");
    },

    init: function(data){
        this.callerScene = data.callerScene;
    },

    preload: function(){
    },

    create: function(){

        this.scene.moveAbove('MenuSettings', 'Help');

        this.help = this.add.image(500, 310, 'help_menu');
        this.arrow = this.add.image(640, 210, 'arrows');
        this.arrow.setScale(0.8);
        this.add.text(180,170, 'PRESS LEFT', {fontSize: '40px', fill: 'black'} );
        this.add.text(180,220, 'OR RIGHT', {fontSize: '40px', fill: 'black'} );
        this.add.text(180,270, 'ARROW KEYS TO CHANGE THE', {fontSize: '40px', fill: 'black'} );
        this.add.text(180,320, 'DIRECTION OF THE PLAYER', {fontSize: '40px', fill: 'black'} );
        this.add.text(180,370, 'AND SPACE TO JUMP', {fontSize: '40px', fill: 'black'} );
        this.text = this.add.text(410,430, 'PRESS TO CONTINUE', {fontSize: '32px', fill: 'black'} ).setInteractive();
        this.text.setTintFill(0xff00ff, 0xff00ff, 0x0000ff, 0x0000ff);
        this.back = this.add.image(765, 445, 'back_1').setDepth(2);
        
        this.tweens.add({
            targets: this.back,
            x: 800,
            ease: 'Power1',
            duration: 1000,
            yoyo: true,
            repeat: - 1,
        });
        
        this.text.on('pointerup', function(event) {            
            console.log("Click back");
            if (this.callerScene === 'MailScene')
                this.scene.start("Level1");
            else
                this.scene.start("MenuSettings")
            this.scene.stop();
        }, this);

        this.input.keyboard.on('keyup-ENTER', function () {
            if (this.callerScene === 'MailScene')
                this.scene.start("Level1");
            else
                this.scene.start("MenuSettings")
        }, this);

        this.input.keyboard.on('keyup-SPACE', function () {
            if (this.callerScene === 'MailScene')
                this.scene.start("Level1");
            else
                this.scene.start("MenuSettings")
        }, this);
  
    },  
});