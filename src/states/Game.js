/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import config from '../config'

export default class extends Phaser.State {
    init () {
        this.world = {
            x: 5000,
            y: 5000
        }

        this.matter = 10000
        this.health = 100
        this.deadzoneBorder = 300
    }

    preload () {}

    create () {
        this.game.world.setBounds(0, 0, this.world.x, this.world.y)
        this.game.physics.startSystem(Phaser.Physics.P2JS)

        this.ship = this.game.add.sprite(
            this.deadzoneBorder + Math.round(Math.random() * (this.world.x - this.deadzoneBorder * 2)),
            this.deadzoneBorder + Math.round(Math.random() * (this.world.y - this.deadzoneBorder * 2)),
            'ship'
        )

        this.ship.animations.add('propel', [1,2])
        this.ship.anchor.setTo(0.4, 0.5)
        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE)

        this.ship.body.maxVelocity.setTo(config.maxSpeed, config.maxSpeed)
        this.ship.body.drag.setTo(config.drag, config.drag)


        this.weapon = game.add.weapon(30, 'bullet')
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this.ship, 48, 0, true);
        this.weapon.onFire.add(function() {
            this.matter -= 10
        }, this)

        this.game.camera.follow(this.ship);
        this.game.camera.deadzone = new Phaser.Rectangle(this.deadzoneBorder, this.deadzoneBorder, config.width - this.deadzoneBorder*2, config.height - this.deadzoneBorder*2);
        this.game.camera.setPosition(this.ship.x - config.width / 2, this.ship.y - config.height / 2)

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);

        this.matterText = this.game.add.text(this.game.width - 10, 10, this.matter, {
            font: '30px arial',
            fill: '#ffffff'
        })
        this.matterText.anchor.set(1, 0)
        this.matterText.fixedToCamera = true

        this.createStars()
    }


    createStars () {

        for (var i = 0; i < 700; i++) {
            let graphics = game.add.graphics(Math.round(Math.random() * this.world.x), Math.round(Math.random() * this.world.y));
            graphics.beginFill(0xffffff, 1);
            let size = Math.round(Math.random() * 10)
            graphics.drawCircle(0, 0, size);
        }
    }

    update () {
        this.propel()
        this.turn()
        this.fire()

        if (this.matter <= 0) {
            this.die();
        }
    }

    propel () {
        if(this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            if(!this.propelOn) {
                this.game.add.tween(game.camera).to({x: game.camera.x - Math.cos(this.ship.rotation) * 20, y: game.camera.y - Math.sin(this.ship.rotation) * 20}, 40, Phaser.Easing.Bounce.InOut, true, 0, 1, true)
                this.propelOn = true
            }

            this.matter -= 1
            this.ship.play('propel', 10, true)
            this.ship.body.acceleration.x = Math.cos(this.ship.rotation) * config.acceleration
            this.ship.body.acceleration.y = Math.sin(this.ship.rotation) * config.acceleration
        } else {
            this.propelOn = false
            this.ship.frame = 0;
            this.ship.body.acceleration.setTo(0, 0);
        }
    }

    turn () {
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.ship.body.angularVelocity = -config.rotation;
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.ship.body.angularVelocity = config.rotation;
        } else {
            this.ship.body.angularVelocity = 0;
        }
    }

    fire () {
        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.weapon.fire();
        }
    }

    die() {

    }

    render () {
        this.matterText.text = this.matter


        if(config.debug) {
            this.game.debug.cameraInfo(this.game.camera, 32, 32);
            this.game.debug.spriteCoords(this.ship, 32, config.height - 54);
            this.game.debug.spriteBounds(this.ship);
            this.game.debug.camera(this.game.camera);
        }
    }
}
