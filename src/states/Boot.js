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

    this.game.load.spritesheet('ship', './assets/ship.png', 48, 32);
    this.game.load.spritesheet('matter', './assets/matter.png', 10, 10);
    this.game.load.image('star', './assets/star.png');
    this.game.load.image('color-picker', './assets/color-picker.png');
    this.game.load.image('logo', './assets/logo.png');
    this.game.load.image('asteroid', './assets/asteroid.png')
    this.game.load.image('money', './assets/money.png');
    this.game.load.image('play-button', './assets/play-button.png');
    this.game.load.image('replay-button', './assets/replay-button.png');

    this.load.audio('background-music', ['./assets/dystopia-continues.mp3'])
    this.load.audio('menu-select', ['./assets/menu-select.mp3'])
    this.load.audio('drive', ['./assets/drive.mp3'])
    this.load.audio('fire', ['./assets/fire.mp3'])
    this.load.audio('cash', ['./assets/cash.mp3'])
    this.load.audio('blop', ['./assets/blop.mp3'])
    this.load.onLoadComplete.add(this.loadComplete, this)
  }

  loadComplete () {
    this.state.start('Menu')
  }


}
