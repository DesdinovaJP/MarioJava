//initialize kaboom. It has a library of methods to create a game
kaboom({
    global: true,
    fullscreen: true,
    //makes the game smaller or bigger
    scale: 1.5,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

const moveSpeed = 120
const jumpForce = 360
const biJumpForce = 550
const enemySpeed = 20
let isJumping = true
let currentJumpForce = jumpForce
const fallDeath = 400

//load the root for sprites
loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('goomba','KPO3fR9.png')
loadSprite('brick','pogC9x5.png')
loadSprite('block','M6rwarW.png')
loadSprite('mario','Wb1qfhK.png')
loadSprite('mushroom','0wMd92p.png')
loadSprite('surpriseBlock','gesQ1KP.png')
loadSprite('unboxed','bdrLpi6.png')
loadSprite('pipeTopLeft','ReTPiWY.png')
loadSprite('pipeTopRight','hj2GK4n.png')
loadSprite('pipeBottomRight','nqQ79eI.png')
loadSprite('pipeBottomLeft','c1cYSbt.png')

loadSprite('blueBlock', 'fVscIbn.png')
loadSprite('blueBrick', '3e5YRQd.png')
loadSprite('blueSteel', 'gqVoI2b.png')
loadSprite('blueGoomba', 'SvV4ueD.png')
loadSprite('blueSurpriseBlock', 'RMqCc1G.png')

//add game scene
scene("game", ({level, score}) => {
    //layers background, object and ui
    //object layer is the default
    layers(['bg', 'obj', 'ui'], 'obj')

    //this is the "layout" of the level, each line is a row on the page
    //the '=' is a block for example at the bottom of the map
    const maps = [
        [
            '                                         ',
            '                                         ',
            '                                         ',
            '                                         ',
            '                                         ',
            '   *    $  =*=%=                         ',
            '                                         ',
            '                              []         ',
            '                      ^   ^   ()         ',
            '================================    =====',
        ],

        [
            '£                                         ',
            '£                                         ',
            '£                                         ',
            '£                                         ',
            '£                                         ',
            '£   $    %                                ',
            '£             ££                          ',
            '£                                  z   [] ',
            '£     &  &        z        &      zz   () ',
            '!!!!!!!!!!!!!!!!!!!    !!!!!    !!!!  !!!!',
        ]
    ]

    //assigning sprite for the characteres on the map
    const levelCfg = {
        width: 20,
        height: 20,
        //use solid to make boundaries around the sprite
        '=': [sprite('block'), solid()],
        '$': [sprite('coin'), 'coin'],
        //first tag to identify the sprite, the second tag is for action
        '*': [sprite('surpriseBlock'), solid(), 'coin-surprise'],
        '%': [sprite('surpriseBlock'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '[': [sprite('pipeTopLeft'), solid(), scale(0.5), 'pipe'], //used scale to make the sprite smaller
        ']': [sprite('pipeTopRight'), solid(), scale(0.5), 'pipe'],
        '(': [sprite('pipeBottomLeft'), solid(), scale(0.5)],
        ')': [sprite('pipeBottomRight'), solid(), scale(0.5)],
        '^': [sprite('goomba'), solid(), 'dangerous', body()],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],
        '£': [sprite('blueBlock'), solid(), scale(0.5)],
        '!': [sprite('blueBrick'), solid(), scale(0.5)],
        'z': [sprite('blueSteel'), solid(), scale(0.5)],
        '&': [sprite('blueGoomba'), solid(), scale(0.5), 'dangerous', body()],
        '-': [sprite('blueSurpriseBlock'), solid(), scale(0.5), 'coin-surprise'],
    }

    //adding the map and the sprites to game level
    const gameLevel = addLevel(maps[level], levelCfg)

    const scoreLabel = add([
        text('score'),
        pos(30, 6),
        layer('ui'),
        {
            value: score,
        }
    ])

    add([text('level ' + parseInt(level +1)), pos(26,20)])

    //adding the mushroom effect
    //this is a component added to mario
    function big(){
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig){
                    //delta time since last frame kaboom method
                    timer -=dt()
                    currentJumpForce = biJumpForce
                    if (timer <=0) {
                        this.smallify()
                    }
                }
            },
            isBig(){
                return isBig
            },
            smallify(){
                this.scale = vec2(1)
                currentJumpForce = jumpForce
                timer = 0
                isBig = false
            },
            biggify(time){
                this.scale = vec2(2)
                timer = time
                isBig = true
            }
        }
    }

    //adding mario
    const player = add([
        sprite('mario'), solid(), 
        //starting position
        pos(30, 0),
        //gravity effect
        body(),
        big(),
        origin('bot')
    ])

    //mushroom action
    action('mushroom', (m) => {
        m.move(80, 0)
    })

    //goombas action
    action('dangerous', (d) => {
        d.move(-enemySpeed, 0)
    })

    //surprise box items
    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) {
            //spwan the coin above the object and destroy the block
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }

        if (obj.is('mushroom-surprise')) {
            //spwan the mush above the object and destroy the block
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
    })

    //adding mushroom, coin and enemy effect
    player.collides('mushroom', (m) => {
        destroy(m)
        player.biggify(6)
    })

    player.collides('coin', (c) => {
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })

    player.collides('dangerous', (d) => {
        if(isJumping) {
            destroy(d)
        } else {
            go('lose', {score: scoreLabel.value})
        }
    })

    //die by falling in the pit
    player.action(() => {
        //cam moves with player
        camPos(player.pos)
        if (player.pos.y >= fallDeath)
        {
            go('lose', {score: scoreLabel.value})
        }
    })

    //going to the next level
    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1),
                score: scoreLabel.value
            })
        })
    })

    //attaching moves to keyboard effects even listeners
    //use kaboom methods for the event listeners
    keyDown('left', () => {
        //(x axis, y axis) use minus bexause we going left
        player.move(-moveSpeed, 0)
    })

    keyDown('right', () => {
        player.move(moveSpeed, 0)
    })

    player.action(() => {
        if (player.grounded()) {
            isJumping = false
        } 
    })

    //jumping we use key press
    keyPress('space', () => {
        //can only jump if grounded
        if(player.grounded()) {
            isJumping = true
            player.jump(currentJumpForce)
        }
    })

})

scene('lose', ({score}) => {
    add([text(score, 32), origin('center'), pos(width()/2, height()/2)])
})

//pass the score into the game
start("game", {level: 0, score: 0})