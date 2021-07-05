import Phaser from 'phaser';
import {Level1} from "./scenes/Level1";
import {PauseMenu} from "./scenes/PauseMenu";
import {Level2} from "./scenes/Level2";
import {Level3} from "./scenes/Level3";
import {StartScene} from "./scenes/startScene";
import {MailScene} from "./scenes/mailScene";
import {LoadScene} from "./scenes/LoadScene";
import {GameOver} from "./scenes/GameOver";
import {Credits} from "./scenes/Credits";
import {MenuSettings} from "./scenes/MenuSettings";
import { FinalLevel } from "./scenes/FinalLevel";
import { Help } from "./scenes/Help";
import { PopUp } from "./scenes/PopUp";

const seed = Phaser.Math.Between(0,10000);
console.log("SEED: ", seed);

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 620,
    parent: 'game-area',
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: {y: 300}
        }
    },

    seed: [ seed ],
    
    scene: [LoadScene,
            MenuSettings,
            Help,
            PopUp,
            StartScene,
            MailScene,
            PauseMenu,
            Level1,
            Level2, 
            Level3,
            GameOver,
            FinalLevel,
            Credits]
};

const game = new Phaser.Game(config);