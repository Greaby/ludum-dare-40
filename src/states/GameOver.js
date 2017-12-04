import Phaser from 'phaser'
import {formatNumber} from '../utils'

export default class extends Phaser.State {

    init () {}

    create () {

        this.setStars()

        if (this.game.score > this.game.best) {
            this.game.best = this.game.score
        }

        if (this.game.localStorageAvailable) {
            localStorage.setItem('best', this.game.best)
        }

        let scoreText = game.add.text(game.width / 2, 200, 'Score : ' + formatNumber(this.game.score, 2), {
            font: '100px Arial',
            fill: '#ffffff'
        })
        scoreText.padding.set(10, 10)
        scoreText.anchor.set(0.5, 0.5)

        let bestText = game.add.text(game.width / 2, 300, 'Best : ' + formatNumber(this.game.best, 2), {
            font: '50px Arial',
            fill: '#ffffff'
        })
        bestText.padding.set(100, 100)
        bestText.anchor.set(0.5, 0.5)


        this.ship = this.game.add.sprite(500, 600, 'ship')
        this.ship.smoothed = false
        this.ship.scale.set(5)
        this.ship.angle = 185

        this.tooltip = this.game.make.bitmapData(48, 32)
        //this.tooltip.fill(0, 0, 0)
        this.tooltip.rect(20, 10, 22, 12, this.game.color)
        this.tooltip.rect(23, 25, 11, 5, this.game.color)
        this.tooltip.rect(23, 2, 11, 5, this.game.color)


        this.ship.addChild(game.make.sprite(0, 0, this.tooltip));
        this.ship.addChild(game.make.sprite(0, 0, 'ship'));

        this.ship.animations.add('propel', [1,2])
        this.ship.play('propel', 10, true)


        this.createWeapon()

        let animation = game.add.tween(this.ship).to({x: 1000}, 6000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1)
        animation.yoyo(true)

        animation = game.add.tween(this.ship).to({angle: '-10'}, 13000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1)
        animation.yoyo(true)

        this.button = game.add.button(game.width / 2, game.height / 2 + 350, 'replay-button', function () {
            game.sound.play('menu-select', 0.2)
            this.state.start('Game')
        }, this)
        this.button.anchor.set(0.5, 0.5)
    }

    createWeapon () {
        this.bullet = this.game.make.bitmapData(20, 20)

        this.weapon = game.add.weapon(3, this.bullet)
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 1200;
        this.weapon.fireRate = 600;
        this.weapon.trackSprite(this.ship, 260, 80, true);

    }


    setStars() {
        this.emitter = game.add.emitter(0, game.world.centerY, 200);
        this.emitter.height = game.world.height;
        this.emitter.makeParticles('star');
        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 1.5;
        this.emitter.setYSpeed(0, 0);
        this.emitter.setXSpeed(1000, 2000);
        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;
        this.emitter.gravity = 0;
        this.emitter.start(false, 2600, 5, 0);
    }


    render () {
    }

    update () {


        this.emitter.angle = this.ship.angle - 180

        this.weapon.fire()
    }
}
