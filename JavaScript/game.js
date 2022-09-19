//initialize kaboom
kaboom({
    global: true,
    fullscreen: true,
    //makes the game smaller or bigger
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

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
    layers(['bg', 'obj', 'ui'], 'obj')

    //this is the "layout" of the level, each line is a row on the page
    //the '=' is a block for example at the bottom of the map
    const map = [
       '                                         ',
       '                                         ',
       '                                         ',
       '                                         ',
       '                                         ',
       '                                         ',
       '                                         ',
       '                                         ',
       '                                         ',
       '================================    =====',
    ]

    //assigning sprite for the characteres on the map
    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block', solid())]
    }

    //adding the map and the sprites to game level
    const gameLevel = addLevel(map, levelCfg)

})

start("game")