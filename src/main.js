import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import GameState from './states/Game'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    super(config.width, config.height, Phaser.AUTO, '', null, false, false)

    this.state.add('Boot', BootState, true)
    this.state.add('Game', GameState, false)
  }
}

window.game = new Game()
