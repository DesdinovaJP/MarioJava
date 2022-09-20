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

//add game scene
scene("game", () => {
    //layers background, object and ui
    //object layer is the default
    layers(['bg', 'obj', 'ui'], 'obj')

    //this is the "layout" of the level, each line is a row on the page
    //the '=' is a block for example at the bottom of the map
    const map = [
       '                                         ',
       '                                         ',
       '                                         ',
       '                                         ',
       '                                         ',
       '   %    $  =*=$=                         ',
       '                                         ',
       '                              []         ',
       '                      ^   ^   ()         ',
       '================================    =====',
    ]

    //assigning sprite for the characteres on the map
    const levelCfg = {
        width: 20,
        height: 20,
        //use solid to make boundaries around the sprite
        '=': [sprite('block'), solid()],
        '$': [sprite('coin')],
        '*': [sprite('surpriseBlock'), solid(), 'coin-surprise'],
        '%': [sprite('surpriseBlock'), solid(), 'mushroom-surprise'],
        '[': [sprite('pipeTopLeft'), solid(), scale(0.5)], //used scale to make the sprite smaller
        ']': [sprite('pipeTopRight'), solid(), scale(0.5)],
        '(': [sprite('pipeBottomLeft'), solid(), scale(0.5)],
        ')': [sprite('pipeBottomRight'), solid(), scale(0.5)],
        '^': [sprite('goomba'), solid()],
        '#': [sprite('mushroom'), solid()]
    }

    //adding the map and the sprites to game level
    const gameLevel = addLevel(map, levelCfg)

    const scoreLabel = add([
        text('test'),
        pos(30, 6),
        layer('ui'),
        {
            value: 'testscore',
        }
    ])

    add([text('level' + 'test', pos(4,6))])

    //adding mario
    const player = add([
        sprite('mario'), solid(), 
        //starting position
        pos(30, 0),
        //gravity effect
        body(),
        origin('bot')
    ])

    //attaching moves to keyboard effects even listeners
    //use kaboom methods for the event listeners
    keyDown('left', () => {
        //(x axis, y axis) use minus bexause we going left
        player.move(-moveSpeed, 0)
    })

    keyDown('right', () => {
        player.move(moveSpeed, 0)
    })

    //jumping we use key press
    keyPress('space', () => {
        //can only jump if grounded
        if(player.grounded()) {
            player.jump(jumpForce)
        }
    })

})

start("game")