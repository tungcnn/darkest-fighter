const CANVAS_WIDTH = 2700;
const CANVAS_HEIGHT = 1300;
const IDLE_WIDTH = 600;
class Game {
    constructor() {
        this.destroy = new Image();
        this.destroy.src = 'pictures/destroyed.png';
    }
    start() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.hero1.flip();
        this.hero2.flip();
        this.interval = setInterval(update, 20);
    }
    async stop() {
        clearInterval(this.interval);
        destroy.play();
        bg.draw(this);
        var number;
        if (this.hero1.isDead) {
            number = 2;
        }
        else {
            number = 1;
        }
        this.drawHero1HUD();
        this.drawHero2HUD();
        this.hero2.flip();
        this.hero1.flip();
        this.hero1.draw(this);
        this.hero2.draw(this);
        this.ctx.drawImage(this.destroy, CANVAS_WIDTH / 2 - IDLE_WIDTH, CANVAS_HEIGHT / 2 - 300)
        await new Promise(resolve => setTimeout(resolve, 3000));
        let choice = confirm("Player " + number + " wins! Play again? ");
        if (choice)
            location.reload();
        else
            window.close();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    setHero1(hero) {
        this.hero1 = hero;
    }
    setHero2(hero) {
        this.hero2 = hero;
    }
    drawHero1HUD() {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("HP " + this.hero1.health.toFixed(0), 40, 80);
        this.ctx.fillText("MP " + this.hero1.energy.toFixed(0), 40, 150);
        this.ctx.fillStyle = "green"
        this.ctx.fillRect(150, 60, this.hero1.health * 4, 30);
        if (this.hero1.energy == 100)
            this.ctx.fillStyle = "blue"
        else
            this.ctx.fillStyle = "yellow"
        this.ctx.fillRect(150, 130, this.hero1.energy * 7, 30);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.hero1.message, 150, 230);
        if (this.hero1.isHit) {
            this.ctx.fillStyle = "white";
            this.ctx.fillText("Stunned!", 150, 280);
        }
    }
    drawHero2HUD() {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("HP " + this.hero2.health.toFixed(0), CANVAS_WIDTH - 140, 80);
        this.ctx.fillText("MP " + this.hero2.energy.toFixed(0), CANVAS_WIDTH - 140, 150);
        this.ctx.fillStyle = "green"
        this.ctx.fillRect(CANVAS_WIDTH - 150, 60, -this.hero2.health * 4, 30);
        if (this.hero2.energy == 100)
            this.ctx.fillStyle = "blue"
        else
            this.ctx.fillStyle = "yellow"
        this.ctx.fillRect(CANVAS_WIDTH - 150, 130, -this.hero2.energy * 7, 30);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.hero2.message, CANVAS_WIDTH - 350, 230);
        if (this.hero2.isHit) {
            this.ctx.fillStyle = "white";
            this.ctx.fillText("Stunned!", CANVAS_WIDTH - 350, 280);
        }
    }
    move(event) {
        switch (event.keyCode) {
            case 65:
                this.hero1.move("left");
                break;
            case 37:
                this.hero2.move("left");
                break;
            case 68:
                this.hero1.move("right");
                break;
            case 39:
                this.hero2.move("right");
                break;
            case 73:
                this.hero1.block();
                break;
            case 74:
                if (!this.hero1.isAtk)
                    this.hero1.attack();
                break;
            case 75:
                if (!this.hero1.isSp)
                    this.hero1.special();
                break;
            case 76:
                if (!this.hero1.isUlti)
                    this.hero1.ulti();
                break;
            case 100:
                if (!this.hero2.isAtk)
                    this.hero2.attack();
                break;
            case 101:
                if (!this.hero2.isSp)
                    this.hero2.special();
                break;
            case 102:
                if (!this.hero2.isUlti)
                    this.hero2.ulti();
                break;
            case 104:
                this.hero2.block();
                break;
        }
    }
    charge(e) {
        switch (e.keyCode) {
            case 73:
                this.hero1.unblock();
                break;
            case 104:
                this.hero2.unblock();
                break;
        }
    }
}
class Background {
    constructor() {
        this.image = new Image();
    }
    draw(Game) {
        let ctx = Game.ctx;
        ctx.drawImage(this.image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    setSrc(src) {
        this.image.src = src;
    }
}