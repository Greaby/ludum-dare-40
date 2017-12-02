import Phaser from 'phaser'

export default class extends Phaser.State {

    init () {
        this.game.color = {
            r: 55,
            g: 55,
            b: 55
        };
    }

    create () {
        this.setStars()


        this.colorPicker = game.make.bitmapData(256, 256)
        this.colorPicker.draw('color-picker')
        this.colorPicker.update()
        this.colorPicker.addToWorld()


        this.ship = this.game.add.group()
        this.ship.smoothed = false
        this.ship.scale.set(5)
        this.ship.angle = 185
        this.ship.x = 400
        this.ship.y = 500

        this.tooltip = this.game.make.bitmapData(10, 10)
        this.ship.cockpit = this.ship.create(0, 0, this.tooltip)
        this.ship.cockpit.x = 10
        this.ship.cockpit.y = -5



        this.ship.sprite = this.ship.create(-24, -16, 'ship')
        this.ship.sprite.animations.add('propel', [1,2])
        this.ship.sprite.play('propel', 10, true)

        let animation = game.add.tween(this.ship).to({x: 800}, 6000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1)
        animation.yoyo(true)

        animation = game.add.tween(this.ship).to({angle: '-10'}, 13000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1)
        animation.yoyo(true)

        this.game.input.addMoveCallback(this.getColor, this)
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

    getColor (pointer, x, y) {

        if (game.input.activePointer.isDown && x >= 0 && x <= this.colorPicker.width && y >= 0 && y <= this.colorPicker.height) {
            this.game.color = this.colorPicker.getPixelRGB(Math.floor(x), Math.floor(y))

            this.tooltip.fill(0, 0, 0)
            this.tooltip.rect(0, 0, 64, 64, this.game.color.rgba)
        }
    }

    render () {
        this.cockpit
    }

    update () {
        this.emitter.angle = this.ship.angle - 180
    }
}
