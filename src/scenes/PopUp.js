import Phaser from 'phaser';

export var PopUp = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function PopUp() {
        Phaser.Scene.call(this, { key: 'PopUp' });

        console.log("Inside PopUp");

        this.graphics;
        this.callerScene;
        this.timedEvent;
        this.i;
        this.aux;
        this.unicorn;
    },

    init: function(data){
        this.callerScene = data.callerScene;
    },

    preload: function(){

    },

    create: function(){


        this.scene.moveAbove(this.callerScene,'PopUp');
        this.sentence = null;

        // PRESS ESC TO SKIP
        this.add.text(10,10, 'PRESS ESC TO SKIP', {fontSize: '18px', fill: 'white' } ).setDepth(2);

        if(this.callerScene=="Level2"){

            // PRESS TO CONTINUE
            this.text = this.add.text(340,530, 'PRESS TO CONTINUE', {fontSize: '32px', fill: 'white'} ).setInteractive().setDepth(2).setVisible(false);

            this.bubbleSentences = [
                "Hmmmm... 🤔 guess not",
                "💡 Who turned the lights out? 💡",
                "The internet connection is also down",
                "I'll try to bring it back up. And see if I can get to the bottom of this problem 🔎",
            ];
        }

        else if(this.callerScene=="Level3"){

            // PRESS TO CONTINUE
            this.text = this.add.text(300,430, 'PRESS TO CONTINUE', {fontSize: '32px', fill: 'white'} ).setInteractive().setDepth(2).setVisible(false);

            this.bubbleSentences = [
                "Alrigh, I found the problem!🧐 There's a virus in this sector!",
                "That´s what happens when you click links you don't know 😒",
                "But that's alright, I've launched the antivirus program 🤓",
                "All you have to do is stack the tetris blocks I've created and climb out of here",
                "Then we'll use the virus's own weapons against it!😁",
                "Just get past the tetris section and... 👾kzzzz👾 HELP 🤬🤤💩sajcksanc💩😵🤣",
                "😈Muahahaha😈 You'll never get out of here!",
            ];

            this.graphics = this.add.graphics();
            this.graphics.fillStyle(0x000000,  1);
            this.graphics.fillRect(0, 0, 1000, 620);

            this.unicorn=this.add.sprite(850, 450, 'CorruptedUnicorn').setScale(2).setVisible(false);
            this.anims.create({ key: 'CorruptedUnicornAnim', frames: this.anims.generateFrameNames('CorruptedUnicorn'), frameRate: 4, repeat: -1 });
            this.unicorn.anims.play('CorruptedUnicornAnim');

        }
        
        this.timedEvent = this.time.addEvent({ delay: 5000, callback: this.speak, callbackScope: this, repeat: this.bubbleSentences.length - 2 });

        this.speak();

        this.text.on('pointerup', ()=>{
            // PREVENT SKIPING ON INVISIBLE PRESS TO CONTINUE
            if (this.bubbleSentences.length === 0){
                this.scene.resume(this.callerScene);
                this.scene.stop();
            }
        }, this);

        this.input.keyboard.on('keyup-ESC', ()=>{
            this.input.stopPropagation();
            this.scene.resume(this.callerScene);
            this.scene.stop();
        }, this);

        this.input.keyboard.on('keyup-ENTER', ()=>{
            if (this.bubbleSentences.length === 0){
                this.scene.resume(this.callerScene);
                this.scene.stop();
            }
        }, this);

        this.input.keyboard.on('keyup-SPACE', ()=>{
            if (this.bubbleSentences.length === 0){
                this.scene.resume(this.callerScene);
                this.scene.stop();
            }
        },this);
    },

    speak: function(){

        this.helpSentence = this.bubbleSentences.shift();

        if( this.sentence )
            this.sentence.destroy();

        this.sentence = this.add.text(330, 200, this.helpSentence, { fontFamily: 'Futura', fontSize: 50, color: '#ffffff', align: 'center', wordWrap: { width: 400 - 10* 2}});

        if(this.bubbleSentences.length === 0 && this.callerScene === 'Level3')
            this.unicorn.setVisible(true);

        if(this.bubbleSentences.length === 0){
            this.timedEvent = this.time.addEvent({ delay: 500, callback: this.changeVisible, callbackScope: this, loop: true });
        }
    },

    changeVisible: function(){
        if (this.text.visible)
            this.text.setVisible(false);
        else
            this.text.setVisible(true);
    }
    
});