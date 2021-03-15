let counter = 0;
let myGame = new Game();
let bg = new Background();
let bgs = ["pictures/bg1.png", "pictures/bg2.png", "pictures/bg3.png", "pictures/bg4.png", "pictures/bg5.png", "pictures/bg6.png"]
let select = new Audio('sound/menu.mp3');
let announcerSelect = new Audio('sound/select.wav');
let announcerStart = new Audio('sound/start.wav');
let destroy = new Audio('sound/destroy.wav')
let theme = new Audio();
let themes = ['sound/fairytail.mp3', 'sound/goldenwind.mp3', 'sound/mk.mp3', 'sound/berserk.mp3', 'sound/silver.mp3', 'sound/nero.mp3', 'sound/kiske.mp3'];
let loop = null;

function randomTheme() {
    let index = Math.floor(Math.random()*6);
    theme.src = themes[index];
    theme.volume = 0.5;
    theme.loop = true;
    theme.play();
}
function randomBackground() {
    let index = Math.floor(Math.random()*5);
    bg.setSrc(bgs[index]);
}
function guide() {
    alert("Player 1 (left): \nWASD to move \nJ to normal attack \nK to special attack \nL to ult when energy is full \nHold I to block" +
        "\nPlayer 2 (right): \nArrow to move \nNum4 to normal attack \nNum5 to special attack \nNum6 to ult when energy is full \nHold Num8 to block")
}
function showMenu() {
    select.loop = true;
    select.play();
    announcerSelect.play();
    var bg = document.getElementById('bg');
    bg.style.backgroundImage = "url('')";
    bg.style.backgroundColor = "black";
    var witcherSkill = 'Geralt<br>The legendary Witcher, the butcher of Blaviken<br>Special: Get over here<br>Ulti: Consumes potions, double damage and heal'
    var aboSkill = 'The Abomination<br>A terrifying beast in human form<br>Special: Spit acid<br>Ulti: True form'
    var dragonSKill = 'The Dragon Slayer<br>A knight of Gwyn who slayed thousands of dragons with the power of lightning<br>Special: Charge energy<br>Ulti: Lightning grants attack speed'
    var highwaySkill = 'The Highwayman<br>A guy with a gun<br>Special: Shoot<br>Ulti: BANG'

    bg.innerHTML = "<p id='message'>Player 1 select your hero</p>"
        + "<div class='column'><img src='bh/menu.png' class='hero' id='bh' onclick='createHero(id)'><p class='heroname'>" + witcherSkill + "</p></div>"
        + "<div class='column'><img src='ab/menu.png' class='hero' id='ab' onclick='createHero(id)'><p class='heroname'>" + aboSkill + "</p></div>"
        + "<div class='column'><img src='ds/menu.png' class='hero' id='ds' onclick='createHero(id)'><p class='heroname'>" + dragonSKill + "</p></div>"
        + "<div class='column'><img src='hw/menu.png' class='hero' id='hw' onclick='createHero(id)'><p class='heroname'>" + highwaySkill + "</p></div>"
}
function createHero(id) {
    document.getElementById('message').innerHTML = "Player 2 select your hero";
    switch (id) {
        case 'bh':
            let geralt = new Witcher("bh", 100, 750, 200, counter, 15, 30, 0, 0.2);
            if (counter == 0)
                myGame.setHero1(geralt);
            else 
                myGame.setHero2(geralt);
            break;
        case 'ab':
            let abo = new Abomination("ab", 60, 800, 250, counter, 10, 20, 0, 0.4);
            if (counter == 0)
                myGame.setHero1(abo);
            else 
                myGame.setHero2(abo);
            break;
        case 'ds':
            let ds = new DragonSlayer("ds", 80, 500, 250, counter, 15, 20, 0, 0.1);
            if (counter == 0)
                myGame.setHero1(ds);
            else 
                myGame.setHero2(ds);
            break;
        case 'hw':
            let hw = new HighwayMan("hw", 110, 500, 150, counter, 10, 10, 60, 0.5);
            if (counter == 0)
                myGame.setHero1(hw);
            else 
                myGame.setHero2(hw);
            break;
    }
    counter++;
    if (counter > 1) {
        select.pause();
        announcerStart.play();
        randomTheme();
        randomBackground();
        document.body.innerHTML = "<canvas id='gameCanvas' width='2700' height='1300'></canvas>";
        myGame.start();
    }
}

function checkHit(hero1, hero2) {
    var hit = true;
    var heroLeft, heroRight, hero2Left, hero2Right;
    if (hero1.face == 0) {
        heroLeft = hero1.xPosition;
        heroRight = hero1.xPosition + hero1.image.width;
        hero2Left = hero2.xPosition - hero2.image.width;
        hero2Right = hero2.xPosition;
    } else {
        heroLeft = hero1.xPosition - hero1.image.width;
        heroRight = hero1.xPosition;
        hero2Left = hero2.xPosition;
        hero2Right = hero2.xPosition + hero2.image.width
    }
    var heroTop = hero1.yPosition;
    var hero2Bot = hero2.yPosition + hero2.image.height;
    switch (hero1.face) {
        case 0:
            if (heroRight < hero2Left || heroTop > hero2Bot)
                hit = false;
            break;
        case 1:
            if (heroLeft > hero2Right || heroTop > hero2Bot)
                hit = false;
            break;
    }
    return hit;
}
async function bhHook(hero1, hero2) {
    await new Promise(resolve => setTimeout(resolve, 500));
    hero1.flip();
    if (hero1.face == 0) {
        hero2.xPosition = hero1.xPosition + hero1.image.width + hero2.image.width;
    }
    else {
        hero2.xPosition = hero1.xPosition - hero1.image.width - hero2.image.width;
    }
    hero1.uppercut();
    for (let i = 0; i < 6; i++) {
        hero2.yPosition -= 10;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    for (let i = 0; i < 6; i++) {
        hero2.yPosition += 10
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    hero1.flip();
    hero1.isSp = false;
}
async function bhHookFail(hero) {
    await new Promise(resolve => setTimeout(resolve, 500));
    hero.isSp = false;
    hero.isHit = true;
    hero.flip();
    await new Promise(resolve => setTimeout(resolve, 1500));
    hero.isHit = false;
}
async function calculateDamage(hero1, hero2, dmg) {
    if (checkHit(hero1, hero2)) {
        if (!hero2.isBlk) {
            switch (hero1.name) {
                case "bh":
                    if (hero1.isSp) {
                        hero1.dealDamage(hero2, dmg, 2500);
                        bhHook(hero1, hero2);
                    } else if (hero1.isAtk)
                        hero1.dealDamage(hero2, dmg, hero1.attackSpeed);
                    break;
                case "ab":
                    if (hero1.isTransform && hero1.isSp) {
                        hero1.dealDamage(hero2, dmg, 800);
                        for (let i = 0; i < 4; i++) {
                            hero2.yPosition -= 10;
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                        for (let i = 0; i < 4; i++) {
                            hero2.yPosition += 10
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    } else {
                        hero1.dealDamage(hero2, dmg, hero1.attackSpeed);
                    }
                    break;
               default:
                    hero1.dealDamage(hero2, dmg, hero1.attackSpeed);
                    break;
            }
        }
        else {
            hero1.dealDamage(hero2, dmg * hero2.blkValue);
            if (hero1.name == 'bh') {
                if (hero1.isSp) {
                    bhHookFail(hero1);
                }
            }
        }
    } else {
        if (hero1.name == 'bh') {
            if (hero1.isSp) {
                bhHookFail(hero1);
            }
        }
    }
}
function boundary(hero1, hero2) {
    hero1.leftLimit = 0;
    hero1.rightLimit = hero2.xPosition - hero2.image.width - hero1.image.width;
    hero2.leftLimit = hero1.xPosition + hero1.image.width + hero2.image.width;
    hero2.rightLimit = CANVAS_WIDTH;
}
function update() {
    myGame.clear();
    bg.draw(myGame);
    myGame.drawHero1HUD();
    myGame.drawHero2HUD();
    boundary(myGame.hero1, myGame.hero2);
    myGame.hero1.draw(myGame);
    myGame.hero2.draw(myGame);
    if (myGame.hero1.isAtk)
        calculateDamage(myGame.hero1, myGame.hero2, myGame.hero1.atkDmg);
    else if (myGame.hero2.isAtk)
        calculateDamage(myGame.hero2, myGame.hero1, myGame.hero2.atkDmg);
    else if (myGame.hero1.isSp)
        calculateDamage(myGame.hero1, myGame.hero2, myGame.hero1.spDmg);
    else if (myGame.hero2.isSp)
        calculateDamage(myGame.hero2, myGame.hero1, myGame.hero2.spDmg);
    else if (myGame.hero1.isUlti)
        calculateDamage(myGame.hero1, myGame.hero2, myGame.hero1.ultiDmg);
    else if (myGame.hero2.isUlti)
        calculateDamage(myGame.hero2, myGame.hero1, myGame.hero2.ultiDmg);
    if (myGame.hero1.isDead || myGame.hero2.isDead)
        myGame.stop();
}