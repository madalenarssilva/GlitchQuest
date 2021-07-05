import Phaser from 'phaser';

export var MailScene = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function MailScene() {
        
        // CONSTRUCTOR
        Phaser.Scene.call(this, { key: 'MailScene'});
        console.log("Inside mailScene");
        this.mail;
        this.mailAudio;
       /* this.colorArray = ['pink', 'blue', 'purple' ];
        this.CurrentIter = 0;
        this.currentColor;
        this.changeColor = false;*/
    },

    init: function(data){
        this.callerScene = data.callerScene;
    },

    preload: function(){
    },

    create: function(){

        this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));

        //  BACKGROUND MAIL SPRITESHEET
        this.mail = this.add.sprite(505, 310, 'mail').setInteractive();
        this.anims.create({ key: 'mailAnim', frames: this.anims.generateFrameNames('mail'), frameRate: 4, repeat: -1 });
        this.mail.anims.play('mailAnim');

        //  AUDIO OBJECT
        this.mailAudio = this.sound.add('MailAudio');
        this.mailAudio.loop = true;
        this.mailAudio.setVolume(0.5*this.currentVolume);
        this.mailAudio.play();
        if (localStorage.getItem('audioMuted') === "true")
            this.mailAudio.setMute(true);
        else
            this.mailAudio.setMute(false);


        //this.currentColor = this.colorArray[this.CurrentIter % this.colorArray.length];

        //  OPEN MAIL SPRITESHEET
        this.mail.on('pointerup', function (event) {
            this.mail.destroy();
            this.mailOpen2 = this.add.sprite(500, 310, 'mailOpen');
            this.anims.create({ key: 'mailOpenAnim2', frames: this.anims.generateFrameNames('mailOpen'), frameRate: 6});
            this.mailOpen2.anims.play("mailOpenAnim2");
            
            //this.changeColor = true;

            this.timedEvent = this.time.delayedCall(2000, ()=>{


                //  LINK
                this.linkText = this.add.text(16,26, 'www.gamesOnlineCrazyandFree.com', {fontSize: '32px', fill:'blue'} ).setInteractive();
                this.linkText.x = 200;
                this.linkText.y = 300;
                this.underline = this.add.graphics();
                this.underline.fillRect(200, 330, this.linkText.width, 1);
                this.underline.fillStyle(0x0000ff, 1);

                this.timedEvent = this.time.addEvent({ delay: 500, callback: this.changeVisible, callbackScope: this, loop: true });

                //  LINK CLICK EVENT
                this.linkText.on('pointerup', function (event) {
                    this.mailAudio.stop();
                    this.scene.launch("Help", {callerScene: 'MailScene'});
                    this.scene.stop();
                }, this);

            }, this);
        }, this);  
    },

    changeVisible: function(){
        if (this.linkText.visible){
            this.linkText.setVisible(false);
            this.underline.setVisible(false);
        }
        else{
            this.linkText.setVisible(true);
            this.underline.setVisible(true);
        }
    }

    
});


