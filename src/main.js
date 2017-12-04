import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import GameState from './states/Game'
import MenuState from './states/Menu'
import GameOverState from './states/GameOver'
import {testLocalStorage} from './utils'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    super(config.width, config.height, Phaser.AUTO, '', null, false, false)

    this.score = 0
    this.best = 0
    this.color = "rgba(0,200,133,1)"

    this.localStorageAvailable = testLocalStorage()

    if (this.localStorageAvailable) {
        this.best = localStorage.getItem('best') || 0

        if(localStorage.getItem('color')) {
            this.color = localStorage.getItem('color')
        }
    }

    this.state.add('Boot', BootState, true)
    this.state.add('Game', GameState, false)
    this.state.add('GameOver', GameOverState, false)
    this.state.add('Menu', MenuState, false)
  }
}

window.game = new Game()
