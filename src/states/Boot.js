import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000'
    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.startFullScreen(false)
  }

  preload () {
    let text = this.add.text(this.world.centerX, this.world.centerY, 'Loading', { font: '16px Arial', fill: '#ffffff', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.game.load.spritesheet('ship', '/assets/ship.png', 48, 32);
    this.game.load.spritesheet('bullet', '/assets/bullet.png', 5, 5);
    this.load.onLoadComplete.add(this.loadComplete, this)
  }

  loadComplete () {
    this.state.start('Game')
  }


}
