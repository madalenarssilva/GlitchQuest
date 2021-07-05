import Phaser from 'phaser';

export var MenuSettings = Phaser.Class ({

    Extends: Phaser.Scene,

    initialize:

    function MenuSettings() {
        Phaser.Scene.call(this, { key: 'MenuSettings' });

        console.log("Inside Menu Settings");

        this.currentVolume;
        this.isMuted;
        this.currentVolume = parseFloat(localStorage.getItem('currentVolume'));
    },

    init: function(data){
        this.callerScene = data.callerScene;
    },

    preload: function(){

    },

    create: function(){

        this.scene.moveAbove('StartScene', 'MenuSettings');

        // INIT VARIABLES
        this.currentVolume
        this.isMuted = localStorage.getItem('audioMuted') === 'false' ? false : true;

        console.log(this.currentVolume, this.isMuted);

        //BACKGROUND CHOICE
        if(!this.isMuted && this.currentVolume < 1 && this.currentVolume > 0){
            this.settings = this.add.image(500, 310, 'settings_menu');
        }
        else if (this.isMuted && this.currentVolume < 1 && this.currentVolume > 0){
            this.settings = this.add.image(500, 310, 'settings_menu_muted');
        }
        else if( this.isMuted && this.currentVolume === 0 ){
            this.settings = this.add.image(500, 310, 'settings_menu_min_volume');
        }
        else if(this.isMuted && this.currentVolume === 1){
            this.settings = this.add.image(500, 310, 'settings_menu_muted_max_volume');
        }
        else{ // != muted e volume = 1
            this.settings = this.add.image(500, 310, 'settings_menu_max_volume');
        }

        //  BACK
        this.back = this.add.image(865, 540, 'back').setInteractive().setDepth(2);
        this.back.setScale(2);
        this.back.on('pointerup', function(event) {            
            console.log("Click back");
            this.scene.resume("StartScene");
            this.scene.stop();
        }, this);

        // MUTE
        this.mute = this.add.rectangle(197, 205, 170, 165).setDepth(1);
        this.mute.setInteractive();
        this.mute.on('pointerup', function(event) {
            if ( this.currentVolume > 0 && this.currentVolume < 1 && !this.isMuted){
                this.settings.destroy();
                this.settings = this.add.image(500, 310, 'settings_menu_muted');
            }
            else if (!this.isMuted && this.currentVolume === 1){
                this.settings.destroy();
                this.settings = this.add.image(500, 310, 'settings_menu_muted_max_volume');
            }
            this.isMuted = true;
            localStorage.setItem('audioMuted', "true");
            console.log("Click mute", "volume: ", this.currentVolume, "muted: ", this.isMuted);
        }, this);


        //  SOUND
        this.sound = this.add.rectangle(795, 205, 170, 165).setDepth(1);
        this.sound.setInteractive();
        this.sound.on('pointerup', function(event) {
            if (this.isMuted && this.currentVolume < 1 && this.currentVolume > 0){
                this.settings.destroy();
                this.settings = this.add.image(500, 310, 'settings_menu');
                this.isMuted = false;
                localStorage.setItem('audioMuted', "false");
            }
            else if (this.isMuted && this.currentVolume == 1){
                this.settings.destroy();
                this.settings = this.add.image(500, 310, 'settings_menu_max_volume');
                this.isMuted = false;
                localStorage.setItem('audioMuted', "false");
            }
            else if (this.isMuted && this.currentVolume == 0){
                this.settings.destroy();
                this.settings = this.add.image(500, 310, 'settings_menu');
                this.currentVolume = Number((this.currentVolume + 0.2).toFixed(1));
                console.log(this.currentVolume);
                localStorage.setItem('currentVolume', this.currentVolume.toString());
                this.isMuted = false;
                localStorage.setItem('audioMuted', "false");
            }
            console.log("Click sound", "volume: ", this.currentVolume, "muted: ", this.isMuted);
        }, this);


        // AUDIO BUTTONS INCREMENT AUDIO BY 0.2

        // LESS
        this.less = this.add.rectangle(415, 200, 100, 45).setDepth(1);
        this.less.setInteractive();
        this.less.on('pointerup', function(event) {
            if(this.currentVolume > 0){
                this.currentVolume = Number((this.currentVolume - 0.2).toFixed(1));
                localStorage.setItem('currentVolume', this.currentVolume.toString());
                if(this.currentVolume === 0){
                    this.settings.destroy();
                    this.isMuted = true;
                    localStorage.setItem('audioMuted', "true");
                    this.settings = this.add.image(500, 310, 'settings_menu_min_volume');
                }
                else if (!this.isMuted){
                    this.settings.destroy();
                    this.settings = this.add.image(500, 310, 'settings_menu');
                }
                else if(this.isMuted){
                    this.settings.destroy();
                    this.settings = this.add.image(500, 310, 'settings_menu_muted');
                }
            }
            console.log("Click less", "volume: ", this.currentVolume, "muted: ", this.isMuted);
        }, this);
        
        //  MORE
        this.more = this.add.rectangle(575, 200, 100, 10).setDepth(1);
        this.more.setInteractive();
        this.more.on('pointerup', function(event) {
            if( this.currentVolume < 1 && this.currentVolume >0){
                this.currentVolume = Number((this.currentVolume + 0.2).toFixed(1));
                localStorage.setItem('currentVolume', this.currentVolume.toString());
                if(this.currentVolume === 1){
                    this.settings.destroy();
                    this.settings = this.add.image(500, 310, 'settings_menu_max_volume');
                }
            }
            else if (this.currentVolume === 0){
                this.currentVolume = Number((this.currentVolume + 0.2).toFixed(1));
                localStorage.setItem('currentVolume', this.currentVolume.toString());
                this.settings.destroy();
                this.settings = this.add.image(500,310,'settings_menu_muted');
            }
            console.log("Click more", "volume: ", this.currentVolume, "muted: ", this.isMuted);
        }, this);

        // CREDITS
        this.credits = this.add.rectangle(495, 380, 467, 155).setDepth(1);
        this.credits.setInteractive();
        this.credits.on('pointerup', function(event) {
            this.scene.start("Credits", {callerScene: 'MenuSettings'});
            this.scene.stop();
        }, this);

        // HELP
        this.help = this.add.rectangle(490, 540, 302, 140).setDepth(1);
        this.help.setInteractive();
        this.help.on('pointerup', function(event) {
            console.log("here");
            this.scene.launch("Help", {callerScene: 'MenuSettings'});
            this.scene.stop();
        }, this);
    },

    update: function(){

    }
});