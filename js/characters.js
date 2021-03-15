class Hero {
    constructor(name, mvSpeed, atkSpeed, _health, _face, _atk, _sp, _ulti, _blk) {
        this.name = name;
        this.face = _face;
        if (this.face == 0)
            this.xPosition = CANVAS_WIDTH / 2 - IDLE_WIDTH;
        else
            this.xPosition = CANVAS_WIDTH / 2 + IDLE_WIDTH;
        this.yPosition = CANVAS_HEIGHT - 50;
        this.movementSpeed = mvSpeed;
        this.attackSpeed = atkSpeed;
        this.health = _health;
        this.energy = 0;
        this.atkDmg = _atk;
        this.spDmg = _sp;
        this.ultiDmg = _ulti;
        this.blkValue = _blk;
        this.message = '';
        this.image = new Image();
        this.idleSrc = this.name + "/" + this.name + ".png";
        this.idleSrcR = this.name + "/" + this.name + "_r.png";
        this.atkSrc = this.name + "/" + this.name + "_atk.png";
        this.atkSrcR = this.name + "/" + this.name + "_atk_r.png";
        this.spSrc = this.name + "/" + this.name + "_sp.png";
        this.spSrcR = this.name + "/" + this.name + "_sp_r.png";
        this.ultiSrc = this.name + "/" + this.name + "_ulti.png";
        this.ultiSrcR = this.name + "/" + this.name + "_ulti_r.png";
        this.blSrc = this.name + "/" + this.name + "_bl.png";
        this.blSrcR = this.name + "/" + this.name + "_bl_r.png";
        this.hitSrc = this.name + "/" + this.name + "_hit.png";
        this.hitSrcR = this.name + "/" + this.name + "_hit_r.png";
        this.isAtk = false;
        this.isSp = false;
        this.isUlti = false;
        this.isBlk = false;
        this.itHit = false;
        this.isTransform = false;
        this.isDead = false;
        this.isDealingDmg = false;
        this.leftLimit = 0;
        this.rightLimit = 0;
        this.atkAudio = new Audio('sound/' + this.name + '_atk.wav');
        this.spAudio = new Audio('sound/' + this.name + '_sp.wav');
        this.ultiAudio = new Audio('sound/' + this.name + '_ulti.wav');
    }
    setSource(src) {
        this.image.src = src
    }
    flip() {
        if (!this.isDead) {
            if (this.face == 0) {
                this.image.src = this.idleSrc;
            } else {
                this.image.src = this.idleSrcR;
            }
        } else {
            this.image.src = ""
        }
    }
    draw(Game) {
        let ctx = Game.ctx;
        if (this.face == 0)
            ctx.drawImage(this.image, this.xPosition, this.yPosition, this.image.width, -this.image.height);
        else
            ctx.drawImage(this.image, this.xPosition, this.yPosition, -this.image.width, -this.image.height);
    }
    async dealDamage(hero, dmg, duration) {
        if (!this.isDealingDmg) {
            this.isDealingDmg = true;
            hero.health -= dmg;
            var chance = Math.floor(Math.random() * 10);
            if (chance <= 3) {
                if (hero.face == 0) {
                    hero.xPosition -= 150;
                    if (hero.xPosition < 0)
                        hero.xPosition = 0;
                }
                else {
                    hero.xPosition += 150;
                    if (hero.xPosition > CANVAS_WIDTH)
                        hero.xPosition = CANVAS_WIDTH
                }
            }
            if (hero.health < 0) {
                hero.health = 0;
                hero.isDead = true;
            } else {
                if (!hero.isBlk) {
                    if (!this.isTransform)
                        this.energy += dmg;
                    if (!hero.isTransform)
                        hero.energy += dmg/2;
                    hero.setHit(duration)
                } else {
                    if (!this.isTransform)
                        this.energy += dmg*3;
                    hero.energy += dmg / 4;
                }
                if (hero.energy > 100) {
                    hero.energy = 100;
                }
                if (this.energy > 100) {
                    this.energy = 100;
                }
            }
        }
    }
    async attack() {
        if (!this.isBlk && !this.isHit && !this.isSp && !this.isUlti) {
            switch (this.name) {
                case 'bh':
                    this.atkAudio.src = 'sound/bh_atk.wav'
                    break;
                case 'hw':
                    this.atkAudio.src = 'sound/hw_atk.wav'
                    break;
                case 'ab':
                    this.atkAudio.src = 'sound/ab_atk.wav'
                    break;
                case 'ds':
                    this.atkAudio.src = 'sound/ds_atk.wav'
                    break;
            }
            this.atkAudio.play();
            this.isAtk = true;
            if (this.face == 0)
                this.image.src = this.atkSrc;
            else
                this.image.src = this.atkSrcR;
            await new Promise(resolve => setTimeout(resolve, this.attackSpeed));
            this.flip();
            this.isAtk = false;
            this.isDealingDmg = false;
        }
    }
    block() {
        if (!this.isAtk && !this.isHit && !this.isSp && !this.isUlti) {
            this.isBlk = true;
            if (this.face == 0)
                this.image.src = this.blSrc;
            else
                this.image.src = this.blSrcR;
        }
    }
    unblock() {
        if (!this.isHit) {
            this.flip();
            this.isBlk = false;
        }
    }
    getHit() {
        this.isHit = true;
    }
    move(direction) {
        if (!this.isAtk && !this.isSp && !this.isBlk && !this.isHit && !this.isUlti) {
            switch (direction) {
                case "left":
                    if (this.xPosition > this.leftLimit)
                        this.xPosition -= this.movementSpeed;
                    this.flip();
                    break;
                case "right":
                    if (this.xPosition < this.rightLimit)
                        this.xPosition += this.movementSpeed;
                    this.flip();
                    break;
            }
        }
    }
    async setHit(duration) {
        this.isHit = true;
        if (this.face == 0)
            this.image.src = this.hitSrc;
        else {
            this.image.src = this.hitSrcR;
        }
        await new Promise(resolve => setTimeout(resolve, duration));
        this.flip();
        this.isHit = false;
    }
}
class Witcher extends Hero {
    uppercutSrc = this.name + '/' + this.name + '_upper.png';
    uppercutSrcR = this.name + '/' + this.name + '_upper_r.png';
    upperAudio = new Audio('sound/bh_uppercut.wav');
    async special() {
        if (!this.isBlk && !this.isHit && !this.isAtk && !this.isUlti) {
            this.spAudio.play();
            this.isSp = true;
            if (this.face == 0)
                this.image.src = this.spSrc;
            else
                this.image.src = this.spSrcR;
        }
        this.isDealingDmg = false;
    }
    async uppercut() {
        this.upperAudio.play();
        if (this.face == 0)
            this.image.src = this.uppercutSrc;
        else
            this.image.src = this.uppercutSrcR;
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    async ulti() {
        if (!this.isAtk && !this.isBlk && !this.isSp && !this.isHit && this.energy >= 100) {
            this.ultiAudio.play();
            this.health += 50;
            if (this.health > 200) {
                this.health = 200;
            }
            this.energy = 0;
            this.isUlti = true;
            this.isTransform = true;
            this.message = 'Drank Potion!';
            if (this.face == 0)
                this.image.src = this.ultiSrc;
            else
                this.image.src = this.ultiSrcR;
            await new Promise(resolve => setTimeout(resolve, this.attackSpeed));
            this.message = 'Double Damage!';
            this.flip();
            this.isUlti = false;
            this.atkDmg *= 2;
            this.spDmg *= 2;
            await new Promise(resolve => setTimeout(resolve, 10000));
            this.message = '';
            this.isTransform = false;
            this.atkDmg /= 2;
            this.spDmg /= 2;
        }
    }
}
class HighwayMan extends Hero {
    shootSrc = 'hw/hw_shoot.png'
    shootSrcR = 'hw/hw_shoot_r.png'
    async special() {
        if (!this.isBlk && !this.isHit && !this.isAtk && !this.isUlti) {
            this.message = 'Aiming';
            if (this.face == 0)
                this.image.src = this.spSrc;
            else
                this.image.src = this.spSrcR;
            await new Promise(resolve => setTimeout(resolve, 500));
            this.message = 'Shot!';
            this.isHit = true;
            this.isSp = true;
            this.spAudio.play();
            if (this.face == 0)
                this.image.src = this.shootSrc;
            else
                this.image.src = this.shootSrcR;
            await new Promise(resolve => setTimeout(resolve, 100));
            this.message = '';
            this.flip();
            this.isSp = false;
            this.isHit = false;
            this.isDealingDmg = false;
        }
    }
    async ulti() {
        if (!this.isBlk && !this.isHit && !this.isAtk && !this.isSP && this.energy >= 100) {
            this.ultiAudio.play();
            this.isUlti = true;
            if (this.face == 0)
                this.image.src = this.ultiSrc;
            else
                this.image.src = this.ultiSrcR;
            this.message = 'Point-Blank Shot!';
            await new Promise(resolve => setTimeout(resolve, 500));
            this.isUlti = false;
            this.isHit = true;
            this.message = 'Recovering from impact!';
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.message = '';
            this.flip();
            this.energy = 0;
            this.isHit = false;
            this.isDealingDmg = false;
        }
    }
}
class Abomination extends Hero {
    ulti2Src = 'ab/ab_ulti2.png';
    spAudio2 = new Audio('sound/bs_sp.wav');
    async ulti() {
        if (!this.isBlk && !this.isHit && !this.isAtk && !this.isSP && this.energy >= 100) {
            this.isUlti = true;
            this.ultiAudio.play();
            this.image.src = this.ultiSrc;
            await new Promise(resolve => setTimeout(resolve, 500));
            this.image.src = this.ulti2Src;
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.isTransform = true;
            this.idleSrc = "ab/bs.png";
            this.idleSrcR = "ab/bs_r.png";
            this.atkSrc = "ab/bs_atk.png";
            this.atkSrcR = "ab/bs_atk_r.png";
            this.spSrc = "ab/bs_sp.png";
            this.spSrcR = "ab/bs_sp_r.png";
            this.blSrc = "ab/bs_bl.png";
            this.blSrcR = "ab/bs_bl_r.png";
            this.hitSrc = "ab/bs_hit.png";
            this.hitSrcR = "ab/bs_hit_r.png";
            this.atkDmg *= 1.2;
            this.spDmg *= 1.2;
            this.movementSpeed *= 2;
            this.health += 30;
            this.isUlti = false;
            this.flip();
            this.energy = 0;
            this.message = 'True Form!';
            await new Promise(resolve => setTimeout(resolve, 15000));
            this.isHit = true;
            this.image.src = this.ulti2Src;
            this.ultiAudio.play();
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.message = '';
            this.isHit = false;
            this.isTransform = false;
            this.idleSrc = "ab/ab.png";
            this.idleSrcR = "ab/ab_r.png";
            this.atkSrc = "ab/ab_atk.png";
            this.atkSrcR = "ab/ab_atk_r.png";
            this.spSrc = "ab/ab_sp.png";
            this.spSrcR = "ab/ab_sp_r.png";
            this.blSrc = "ab/ab_bl.png";
            this.blSrcR = "ab/ab_bl_r.png";
            this.hitSrc = "ab/ab_hit.png";
            this.hitSrcR = "ab/ab_hit_r.png";
            this.atkDmg /= 1.2;
            this.spDmg /= 1.2;
            this.movementSpeed /= 2;
            this.flip();
        }
    }
    async special() {
        if (!this.isBlk && !this.isAtk && !this.isUlti && !this.isHit) {
            this.isSp = true;
            if (!this.isTransform) {
                this.spAudio.play();
                if (this.face == 0)
                    this.image.src = this.spSrc;
                else
                    this.image.src = this.spSrcR;
                this.message = 'Spit Acid!';
                await new Promise(resolve => setTimeout(resolve, this.attackSpeed));
                this.message = '';
                this.flip();
                this.isSp = false;
            } else {
                this.spAudio2.play();
                this.message = 'SLAM!';
                if (this.face == 0) {
                    this.image.src = this.spSrc;
                    var temp = (CANVAS_WIDTH - this.xPosition + this.image.width) / 5
                    for (let i = 0; i < 5; i++) {
                        this.xPosition += temp
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    this.image.src = this.spSrcR;;
                    for (let i = 0; i < 5; i++) {
                        this.xPosition -= temp
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    this.image.src = this.idleSrc;
                    this.isSp = false;
                }
                else {
                    this.image.src = this.spSrcR;
                    var temp = (0 + this.xPosition - this.image.width) / 5
                    for (let i = 0; i < 5; i++) {
                        this.xPosition -= temp
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    this.image.src = this.spSrc;;
                    for (let i = 0; i < 5; i++) {
                        this.xPosition += temp
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    this.image.src = this.idleSrcR;
                    this.isSp = false;
                }
                this.message = 'True Form!';
            }
        }
        this.isDealingDmg = false;
    }
}
class DragonSlayer extends Hero {
    async ulti() {
        if (!this.isBlk && !this.isHit && !this.isAtk && !this.isSP && this.energy >= 100) {
            this.ultiAudio.play();
            this.isUlti = true;
            if (this.face == 0)
                this.image.src = this.ultiSrc;
            else
                this.image.src = this.ultiSrcR;
            this.message = 'Lightning up!';
            await new Promise(resolve => setTimeout(resolve, 500));
            this.isTransform = true;
            this.idleSrc = "ds/ln.png";
            this.idleSrcR = "ds/ln_r.png";
            this.atkSrc = "ds/ln_atk.png";
            this.atkSrcR = "ds/ln_atk_r.png";
            this.spSrc = "ds/ln_sp.png";
            this.spSrcR = "ds/ln_sp_r.png";
            this.attackSpeed /= 1.5;
            this.atkDmg *= 1.2;
            this.spDmg *= 1.2;
            this.isUlti = false;
            this.flip();
            this.energy = 0;
            this.message = 'Attack Speed Up!';
            await new Promise(resolve => setTimeout(resolve, 10000));
            this.message = '';
            this.attackSpeed *= 1.5;
            this.atkDmg /= 1.2;
            this.spDmg /= 1.2;
            this.isTransform = false;
            this.idleSrc = "ds/ds.png";
            this.idleSrcR = "ds/ds_r.png";
            this.atkSrc = "ds/ds_atk.png";
            this.atkSrcR = "ds/ds_atk_r.png";
            this.spSrc = "ds/ds_sp.png";
            this.spSrcR = "ds/ds_sp_r.png";
            this.flip();
        }
    }
    async special() {
        if (!this.isBlk && !this.isHit && !this.isAtk && !this.isUlti) {
            this.isSp = true;
            if (!this.isTransform) {
                this.ultiAudio.play();
                if (this.face == 0)
                    this.image.src = this.spSrc;
                else
                    this.image.src = this.spSrcR;
                this.energy += 20;
                if (this.energy > 100)
                    this.energy = 100
                this.message = 'MP charged!';
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.message = '';
                this.flip();
                this.isSp = false;
            } else {
                this.spAudio.play();
                if (this.face == 0)
                    this.image.src = this.spSrc;
                else
                    this.image.src = this.spSrcR;
                this.message = 'Lightning Uppercut!';
                await new Promise(resolve => setTimeout(resolve, this.attackSpeed));
                this.message = 'Attack Speed Up!';
                this.flip();
                this.isSp = false;
            }
            this.isDealingDmg = false;
        }
    }
}