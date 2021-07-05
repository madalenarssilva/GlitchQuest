import Phaser from 'phaser';
import startPage from '../assets/startPage.png';
import playBtn from "../assets/playBtn.png";
import TitleScreen from '../assets/TitleScreen.mp3';
import mail from "../assets/mail.png";
import mailOpen from "../assets/mailOpen.png";
import MailAudio from "../assets/Mail.wav";
import settings from '../assets/settings.png';
import back from '../assets/back.png';
import settings_menu from '../assets/settings_menu.png';
import settings_menu_muted from '../assets/settings_menu_muted.png';
import settings_menu_min_volume from '../assets/settings_menu_min_volume.png';
import settings_menu_max_volume from '../assets/settings_menu_max_volume.png';
import settings_menu_muted_max_volume from '../assets/settings_menu_muted_max_volume.png';
import pause_white from '../assets/pause_white.png';
import pause from '../assets/pause.png';
import menu_pause_mute from "../assets/menu_pause_mute.png";
import menu_pause from "../assets/menu_pause.png";
import help_menu from '../assets/help_menu.png';
import arrows from '../assets/arrows.png';
import back_1 from '../assets/back_1.png';
import map_level1 from '../assets/map_level1.json';
import tileset_level1 from '../assets/tileset_level1.png';
import player_spritesheet from "../assets/player_spritesheet.png";
import ghostImage from "../assets/ghostImage.png";
import ghostSpritesheet from "../assets/ghostSpritesheet.png";
import virusTiles from "../assets/virusTiles.png";
import help from '../assets/help.png';
import bubble from '../assets/bubble.png';
import coins from "../assets/coins.png";
import virusCoin from "../assets/virusCoin.png";
import pacman_spritesheet from "../assets/pacman_spritesheet.png";
import arcade from '../assets/arcade.png';
import arcadeXML from '../assets/arcade.xml';
import Level1Audio from '../assets/Level_1.mp3';
import coinAudio from '../assets/Coin.mp3';
import jumpAudio from '../assets/Jump.mp3';
import map_level2 from '../assets/map_level2.json';
import tileset_level2_3 from '../assets/tileset_level_2_3.png';
import fire from "../assets/fire.png";
import wifi1 from "../assets/wifi_1.png";
import wifi2 from "../assets/wifi_2.png";
import wifi3 from "../assets/wifi_3.png";
import wifi4 from "../assets/wifi_4.png";
import dino from "../assets/dino.png";
import Level2Audio from '../assets/Level_2.mp3';
import jump from '../assets/Jump.mp3';
import map_level3 from '../assets/map_level3.json';
import tileset_level3 from '../assets/tileset_level_2_3.png';
import tetirs from '../assets/tetris.png';
import tetirs1 from '../assets/tetris1.png';
import tetirs2 from '../assets/tetris2.png';
import tetirs3 from '../assets/tetris3.png';
import tetirs4 from '../assets/tetris4.png';
import virus_uni from '../assets/virus_uni.png';
import CorruptedUnicorn from '../assets/help-sheet.png';
import Level3Audio from '../assets/Level_3.mp3';
import final_level from "../assets/final_level.png";
import virus from '../assets/virus.png';
import LevelFinal from '../assets/Level_final.mp3';
import cleanEffect from '../assets/cleanEffect.mp3';
import game_over from "../assets/game_over.png";
import GameOverAudio from "../assets/GameOver.mp3";
import glitchEffect from "../assets/glitchEffect.mp3";
import credits from "../assets/credits.png";

export var LoadScene = Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoadScene() {

        //  CONSTRUCTOR
        Phaser.Scene.call(this, {key: 'LoadScene'});
        console.log('Inside LoadScene');
        this.gameWidth = 1000;
        this.gameHeight = 620;
    },

    preload: function () {
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x009933, 0.8);
        this.progressBox.fillRect(340, 270, 320, 50);
        
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.loadingText = this.make.text({
            x: this.width / 2,
            y: this.height / 2 - 60,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);
        
        this.percentText = this.make.text({
            x: this.width / 2,
            y: this.height / 2 - 13,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        this.percentText.setOrigin(0.5, 0.5);
        
        this.assetText = this.make.text({
            x: this.width / 2,
            y: this.height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        this.assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            this.percentText.setText(parseInt(value * 100) + '%');
            this.progressBar.clear();
            this.progressBar.fillStyle(0x1aff66, 1);
            this.progressBar.fillRect(350, 280, 300 * value, 30);
        }, this);
        
        this.load.on('fileprogress', function (file) {
            this.assetText.setText('Loading asset: ' + file.key);
        }, this);

        this.load.on('complete', function () {
            this.progressBar.destroy();
            this.progressBox.destroy();
            this.loadingText.destroy();
            this.percentText.destroy();
            this.assetText.destroy();
            
            // SETUP LOCAL STORAGE
            localStorage.setItem('audioMuted', "false");
            localStorage.setItem('currentVolume', "1");

            this.scene.start('StartScene');
            this.scene.stop();
        }, this);

        // LOAD ASSETS USED IN THE GAME

        // STARTSCENE
        this.load.spritesheet('backgroundPlayer', startPage, {frameWidth: 1000, frameHeight: 620});
        this.load.spritesheet('buttonPlay', playBtn, {frameWidth: 160, frameHeight: 96});
        this.load.audio('StartSceneAudio', TitleScreen);

        // MAILSCENE
        this.load.spritesheet('mail', mail, {frameWidth: 1000, frameHeight: 620});
        this.load.spritesheet('mailOpen', mailOpen, {frameWidth: 1000, frameHeight: 620});
        this.load.audio('MailAudio', MailAudio);

        // SETTINGS
        this.load.image('settings', settings);
        this.load.image('back', back);
        this.load.image('settings_menu', settings_menu);
        this.load.image('settings_menu_muted', settings_menu_muted);
        this.load.image('settings_menu_min_volume', settings_menu_min_volume);
        this.load.image('settings_menu_max_volume', settings_menu_max_volume);
        this.load.image('settings_menu_muted_max_volume', settings_menu_muted_max_volume);

        // PAUSE
        this.load.image('pause_white', pause_white);
        this.load.image('pause', pause);
        this.load.spritesheet('menuPause_mute', menu_pause_mute, {frameWidth: 1000, frameHeight: 620});
        this.load.spritesheet('menuPause', menu_pause, {frameWidth: 1000, frameHeight: 620});

        //HELP
        this.load.image('help_menu', help_menu);
        this.load.image('arrows', arrows);
        this.load.image('back_1', back_1);

        // LEVEL 1
        this.load.tilemapTiledJSON('map_level1', map_level1);
        this.load.image('tileset_level1', tileset_level1);
        this.load.spritesheet('player', player_spritesheet, {frameWidth: 65, frameHeight: 83});
        this.load.image('ghostCostume', ghostImage);
        this.load.spritesheet('ghostPlayer', ghostSpritesheet, {frameWidth: 227, frameHeight: 310});
        this.load.image('virusTile', virusTiles);
        this.load.image('help', help);
        this.load.image('bubble', bubble);
        this.load.spritesheet('coins', coins, {frameWidth: 43, frameHeight: 50});
        this.load.spritesheet('virusCoins', virusCoin, {frameWidth: 300, frameHeight: 300});
        this.load.spritesheet('pacman', pacman_spritesheet, {frameWidth: 288, frameHeight: 96});
        this.load.bitmapFont('arcade', arcade, arcadeXML);
        this.load.audio('Level1Audio', Level1Audio);
        this.load.audio('coinAudio', coinAudio);
        this.load.audio('jumpAudio', jumpAudio);

        //  LEVEL 2
        this.load.tilemapTiledJSON('map_level2', map_level2);
        this.load.image('tileset_level2_3', tileset_level2_3);
        this.load.spritesheet('fire', fire, {frameWidth: 400, frameHeight: 400});
        this.load.spritesheet('wifi1', wifi1, {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('wifi2', wifi2, {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('wifi3', wifi3, {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('wifi4', wifi4, {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('dino', dino, {frameWidth: 400, frameHeight: 400});
        this.load.audio('Level2Audio', Level2Audio);
        this.load.audio('Jump', jump);

        // LEVEL 3
        this.load.tilemapTiledJSON('map_level3', map_level3);
        this.load.image('tileset_level3', tileset_level3);
        this.load.image('tetris', tetirs);
        this.load.image('tetris1', tetirs1);
        this.load.image('tetris2', tetirs2);
        this.load.image('tetris3', tetirs3);
        this.load.image('tetris4', tetirs4);
        this.load.image('UniVirus', virus_uni);
        this.load.spritesheet('CorruptedUnicorn', CorruptedUnicorn, {frameWidth: 180, frameHeight: 145});
        this.load.audio('Level3Audio', Level3Audio);

        // FINAL LEVEL
        this.load.spritesheet('final_level', final_level, {frameWidth: 1000, frameHeight: 620});
        this.load.image('virus', virus);
        this.load.audio('LevelFinal', LevelFinal);
        this.load.audio('cleanSound', cleanEffect);

        // GAMEOVER
        this.load.spritesheet('game_over', game_over, {frameWidth: 1000, frameHeight: 620});
        this.load.audio('GameOverAudio', GameOverAudio);
        this.load.audio('GlitchEffect', glitchEffect);

        // CREDITS
        this.load.spritesheet('credits', credits, {frameWidth: 1000, frameHeight: 620});
    }
});