/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'
import {formatNumber} from '../utils'

export default class extends Phaser.State {
    init () {
        this.world = {
            x: 5000,
            y: 5000
        }


        this.cargo = 8000

        this.matter = 2500
        this.health = 100
        this.deadzoneBorder = 300

        this.barLength = 300

        this.game.score = 0

        this.date = new Date()
        this.date.setDate(1)
        this.date.setFullYear(this.date.getFullYear() + 200);

        this.pay = 500
    }


    isCargoFull () {
        return this.matter >= this.cargo
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
        this.tooltip.rect(20, 10, 22, 12, this.game.color)
        this.tooltip.rect(23, 25, 11, 5, this.game.color)
        this.tooltip.rect(23, 2, 11, 5, this.game.color)


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
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.ENTER
        ]);

        this.dateText = this.game.add.text(30, 20, this.matter, {
            font: '60px Gridlocked',
            fill: '#ffffff'
        })
        this.dateText.fixedToCamera = true


        this.ateroids = game.add.group()
        this.ateroids.enableBody = true
        this.ateroids.physicsBodyType = Phaser.Physics.ARCADE

        this.matters = game.add.group()
        this.matters.enableBody = true
        this.matters.physicsBodyType = Phaser.Physics.ARCADE

        for (let index = 0; index < 15; index++) {
            this.createAsteroid()
        }

        game.time.events.loop(8000, this.createAsteroid, this)

        this.healthBar = game.add.graphics(game.width - this.barLength - 20, 20)
        this.healthBar.fixedToCamera = true

        game.time.events.loop(1000, this.newDay, this)

    }

    newDay () {
        let month = this.date.getMonth()
        this.date.setDate(this.date.getDate() + 1)

        this.game.score += 100

        let newMonth = this.date.getMonth()

        if(month !== newMonth) {
            game.sound.play('cash', 0.2)

            this.matter -= this.pay

            let text = game.add.text(this.ship.x, this.ship.y - 55, "ship rental -"+this.pay, {
                font: '40px Gridlocked',
                fill: '#f22121',
                align: 'center'
            })
            text.anchor.set(0.5, 0.5)
            text.angle = -5


            let tween = game.add.tween(text).to({alpha: 0, y: this.ship.y - 105}, Phaser.Timer.SECOND, 'Linear').start()
            tween.onComplete.add(function () {
                text.destroy()
            })

            this.pay += 100
            this.cargo += 100
        }
    }

    drawHealthBar () {
        this.healthBar.clear()

        // red bar
        this.healthBar.beginFill(0xFF3300)
        this.healthBar.drawRect(0, 0, this.barLength, 20)

        // green bar
        this.healthBar.beginFill(0x28d63f)
        this.healthBar.drawRect(0, 0, Math.round((this.matter / this.cargo) * this.barLength), 20)

        // border
        this.healthBar.endFill()
        this.healthBar.lineStyle(2, 0xFFFFFF, 1)
        this.healthBar.drawRect(0, 0, this.barLength, 20)
        this.healthBar.dirty = true
    }

    hitAsteroid (bullet, asteroid) {
        bullet.kill()

        asteroid.life -= 1

        if(asteroid.life <= 0){
            asteroid.destroy()
            this.createAsteroid()
            for (let index = 0; index < asteroid.Initlife; index++) {
                this.createMatter(asteroid.x, asteroid.y);
            }
        }

        this.createMatter(asteroid.x, asteroid.y);
    }

    createMatter (x, y) {

        let sprite = this.matters.create(x, y, 'matter')
        sprite.anchor.setTo(0.5,0.5)
        sprite.body.velocity = {x:Math.random()*200 - 100,y:Math.random()*200 - 100}
        sprite.body.drag.setTo(20)
        sprite.angle = Math.floor(Math.random() * 360)
        sprite.frame = Math.floor(Math.random() * 3)
        sprite.body.angularVelocity = Math.floor(Math.random() * 120) - 60;
        sprite.scale.set(3)
    }

    createWeapon () {
        let bullet = this.game.make.bitmapData(10, 10)
        bullet.rect(0, 0, 6, 6, this.game.color)
        bullet.rect(1, 1, 4, 4, "rgba(255,255,255,0.8)")

        this.weapon = game.add.weapon(30, bullet)
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this.ship, 32, 0, true);
        this.weapon.onFire.add(function() {
            game.sound.play('fire', 0.2)
            this.matter -= 15
        }, this)
    }


    createAsteroid () {
        //let sprite = game.add.sprite(this.randomX(),this.randomY());

        let sprite = this.ateroids.create(this.randomX(),this.randomY(), 'asteroid')
        sprite.angle = Math.floor(Math.random() * 360)
        sprite.anchor.setTo(0.5,0.5);
        sprite.Initlife = Math.floor(Math.random() * 20)
        sprite.life = sprite.Initlife
        sprite.scale.set(sprite.life / 4)
        sprite.body.angularVelocity = Math.floor(Math.random() * 60) - 30;
        sprite.body.bounce.setTo(0.5, 0.5);


        this.ship.bringToTop()
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
        this.game.physics.arcade.overlap(this.ship, this.matters, this.getMatter, null, this)
        this.game.world.wrap(this.ship, 0, true)

        this.drawHealthBar()
    }

    getMatter (ship, matter) {
        if(!this.isCargoFull()) {
            this.matter += 75

            let text = game.add.text(this.ship.x, this.ship.y-15, "$$", {
                font: '30px Gridlocked',
                fill: '#09c416',
                align: 'center'
            })
            text.anchor.set(0.5, 0.5)
            text.angle = -5
            game.sound.play('blop', 0.2)

            let tween = game.add.tween(text).to({alpha: 0, y: this.ship.y - 65}, Phaser.Timer.SECOND, 'Linear').start()
            tween.onComplete.add(function () {
                text.destroy()
            })

            matter.destroy()
        }
    }

    propel () {
        if(this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            if(!this.propelOn) {
                game.sound.play('drive', 0.2)
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
        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            this.weapon.fire();
        }
    }

    die() {
        this.state.start('GameOver')
    }

    render () {
        this.dateText.text = "Score : " + formatNumber(this.game.score, 2)
        this.dateText.text = this.date.toLocaleDateString("en", {year: 'numeric', month: 'short', day: 'numeric' })
        this.dateText.bringToTop()

        if(config.debug) {
            this.game.debug.cameraInfo(this.game.camera, 32, 32);
            this.game.debug.spriteCoords(this.ship, 32, config.height - 54);
            this.game.debug.spriteBounds(this.ship);
            this.game.debug.camera(this.game.camera);
        }
    }
}
