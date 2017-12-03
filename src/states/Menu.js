import Phaser from 'phaser'

export default class extends Phaser.State {

    init () {
        this.game.color = { rgba: "rgba(78,163,42,1)"};
    }

    create () {
        this.setStars()

        let logo = game.add.sprite(game.width / 2, 250, 'logo')
        logo.anchor.set(0.5)
        logo.scale.set(0.8)

        this.colorPicker = game.make.bitmapData(200, 120)
        this.colorPicker.draw('color-picker')
        this.colorPicker.update()
        this.colorPicker.addToWorld()

        this.ship = this.game.add.sprite(400, 600, 'ship')
        this.ship.smoothed = false
        this.ship.scale.set(5)
        this.ship.angle = 185

        this.tooltip = this.game.make.bitmapData(48, 32)
        //this.tooltip.fill(0, 0, 0)
        this.tooltip.rect(20, 10, 22, 12, this.game.color.rgba)
        this.tooltip.rect(23, 25, 11, 5, this.game.color.rgba)
        this.tooltip.rect(23, 2, 11, 5, this.game.color.rgba)


        this.ship.addChild(game.make.sprite(0, 0, this.tooltip));
        this.ship.addChild(game.make.sprite(0, 0, 'ship'));

        this.ship.animations.add('propel', [1,2])
        this.ship.play('propel', 10, true)



        this.createWeapon()

        let animation = game.add.tween(this.ship).to({x: 800}, 6000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1)
        animation.yoyo(true)

        animation = game.add.tween(this.ship).to({angle: '-10'}, 13000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1)
        animation.yoyo(true)

        this.game.input.addMoveCallback(this.getColor, this)
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

    getColor (pointer, x, y) {

        if (game.input.activePointer.isDown && x >= 0 && x <= this.colorPicker.width && y >= 0 && y <= this.colorPicker.height) {
            this.game.color = this.colorPicker.getPixelRGB(Math.floor(x), Math.floor(y))
        }
    }

    render () {
    }

    update () {

        this.tooltip.clear()
        this.tooltip.rect(20, 10, 22, 12, this.game.color.rgba)
        this.tooltip.rect(23, 25, 11, 5, this.game.color.rgba)
        this.tooltip.rect(23, 2, 11, 5, this.game.color.rgba)

        this.bullet.clear()
        this.bullet.rect(0, 0, 15, 15, this.game.color.rgba)
        this.bullet.rect(1, 1, 13, 13, "rgba(255,255,255,0.8)")

        this.emitter.angle = this.ship.angle - 180

        this.weapon.fire()
    }
}
