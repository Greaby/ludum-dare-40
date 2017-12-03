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

        this.game.color = {
            a: 255,
            b: 33,
            color: 4280364209,
            color32: -16777216,
            g: 44,
            h: 0,
            l: 0,
            r: 177,
            rgba: "rgba(0,200,133,1)",
            s: 0,
            v: 0
        }

        this.matter = 10000
        this.health = 100
        this.deadzoneBorder = 300
    }

    preload () {}

    randomX() {
        return this.deadzoneBorder + Math.round(Math.random() * (this.world.x - this.deadzoneBorder * 2));
    }

    randomY() {
        return this.deadzoneBorder + Math.round(Math.random() * (this.world.y - this.deadzoneBorder * 2));
    }

    create () {
        this.createStars()


        this.game.world.setBounds(0, 0, this.world.x, this.world.y)
        this.game.physics.startSystem(Phaser.Physics.P2JS)

        this.ship = this.game.add.sprite(
            this.randomX(),
            this.randomY(),
            'ship'
        )

        this.ship.scale.set(1.5)
        this.ship.smoothed = false

        this.tooltip = this.game.make.bitmapData(48, 32)
        //this.tooltip.fill(0, 0, 0)
        this.tooltip.rect(20, 10, 22, 12, this.game.color.rgba)
        this.tooltip.rect(23, 25, 11, 5, this.game.color.rgba)
        this.tooltip.rect(23, 2, 11, 5, this.game.color.rgba)


        this.ship.addChild(game.make.sprite(-34, -16, this.tooltip));
        this.ship.addChild(game.make.sprite(-34, -16, 'ship'));


        this.ship.animations.add('propel', [1,2])
        this.ship.anchor.setTo(0.7, 0.5)
        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE)

        this.ship.body.maxVelocity.setTo(config.maxSpeed, config.maxSpeed)
        this.ship.body.drag.setTo(config.drag, config.drag)


        this.createWeapon()

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


        this.ateroids = game.add.group()
        this.ateroids.enableBody = true
        this.ateroids.physicsBodyType = Phaser.Physics.ARCADE

        this.matters = game.add.group()
        this.matters.enableBody = true
        this.matters.physicsBodyType = Phaser.Physics.ARCADE

        this.createAsteroid()
        game.time.events.loop(10000, this.createAsteroid, this)
    }

    hitAsteroid (bullet, asteroid) {
        bullet.kill()

        asteroid.life -= 1

        if(asteroid.life <= 0){
            asteroid.destroy()

            for (let index = 0; index < 15; index++) {
                this.createMatter(asteroid.x, asteroid.y);
            }
        }

        this.createMatter(asteroid.x, asteroid.y);
    }

    createMatter (x, y) {
        let matter = game.make.graphics(0, 0);
        matter.lineStyle(0);
        matter.beginFill(0xFF00FF, 1);
        matter.drawCircle(470, 10, 10);
        matter.endFill();
        let sprite = this.matters.create(x, y, matter.generateTexture())
        sprite.anchor.setTo(0.5,0.5);
        sprite.body.velocity = {x:Math.random()*200 - 100,y:Math.random()*200 - 100}
        sprite.body.drag.setTo(50)
    }

    createWeapon () {
        let bullet = this.game.make.bitmapData(10, 10)
        bullet.rect(0, 0, 6, 6, this.game.color.rgba)
        bullet.rect(1, 1, 4, 4, "rgba(255,255,255,0.8)")

        this.weapon = game.add.weapon(30, bullet)
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this.ship, 32, 0, true);
        this.weapon.onFire.add(function() {
            this.matter -= 10
        }, this)
    }


    createAsteroid () {
        //let sprite = game.add.sprite(this.randomX(),this.randomY());


        let asteroid = game.make.graphics(0, 0);
        asteroid.lineStyle(0);
        asteroid.beginFill(0xFFFF0B, 1);
        asteroid.drawCircle(470, 100, 100);
        asteroid.endFill();
        let sprite = this.ateroids.create(this.randomX(),this.randomY(), asteroid.generateTexture())
        sprite.anchor.setTo(0.5,0.5);
        sprite.life = Math.random() * 20

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

        this.game.physics.arcade.overlap(this.weapon.bullets, this.ateroids, this.hitAsteroid, null, this);
        this.game.physics.arcade.overlap(this.ship, this.matters, this.getMatter, null, this);
        this.game.world.wrap(this.ship, 0, true)
    }

    getMatter (ship, matter) {
        this.matter += 100
        matter.destroy()
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
