import Phaser from 'phaser';

export var PauseMenu = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function PauseMenu() {
        Phaser.Scene.call(this, { key: 'PauseMenu' });

        console.log("Inside Pause Menu");

        this.graphics;
        this.callerScene;
    },

    init: function(data){
        this.callerScene = data.callerScene;
    },

    preload: function(){

    },

    create: function(){
        
        this.scene.moveAbove(this.callerScene, 'PauseMenu');

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xA8A8A8,  0.5);
        this.graphics.fillRect(110, 60, 790, 500);
        
        if(localStorage.getItem('audioMuted') === "false"){
            this.menuPause = this.add.sprite(505, 310, 'menuPause');
        }
        else{
            this.menuPause = this.add.sprite(505, 310, 'menuPause_mute');
        }

        //QUIT
        this.quit = this.add.circle(500, 220, 73);
        this.quit.setInteractive(new Phaser.Geom.Circle(0, 0, 73), Phaser.Geom.Circle.Contains);
        this.quit.on('pointerup', function(event) {
            this.scene.start("StartScene");
            this.scene.stop(this.callerScene);
            this.scene.stop();
        }, this);

        //RESTART
        this.restart = this.add.circle(370, 342, 73);
        this.restart.setInteractive(new Phaser.Geom.Circle(0, 0, 73), Phaser.Geom.Circle.Contains);        
        this.restart.on('pointerup', function(event) {
            this.scene.start(this.callerScene);
            this.scene.stop();
        }, this);

        //RESUME
        this.resume = this.add.circle(630, 339, 73);
        this.resume.setInteractive(new Phaser.Geom.Circle(0, 0, 73), Phaser.Geom.Circle.Contains);
        this.resume.on('pointerup', function(event) {
            this.scene.resume(this.callerScene);
            this.scene.stop();
        }, this);

        //AUDIO
        this.audio = this.add.circle(500, 460, 73);
        this.audio.setInteractive(new Phaser.Geom.Circle(0, 0, 73), Phaser.Geom.Circle.Contains);
        
        this.audio.on('pointerup', function(event) {
            if(localStorage.getItem('audioMuted') === "false"){
                this.menuPause = this.add.sprite(505, 310, 'menuPause_mute');
                localStorage.setItem('audioMuted', "true");
            }
            else{
                this.menuPause = this.add.sprite(505, 310, 'menuPause');
                localStorage.setItem('audioMuted', "false");
            }
        }, this);
    },

    update: function(){

    }
});