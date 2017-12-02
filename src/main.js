import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import GameState from './states/Game'
import MenuState from './states/Menu'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    super(config.width, config.height, Phaser.AUTO, '', null, false, false)

    this.state.add('Boot', BootState, true)
    this.state.add('Game', GameState, false)
    this.state.add('Menu', MenuState, false)
  }
}

window.game = new Game()
