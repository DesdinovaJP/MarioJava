//initialize kaboom
kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

//load the root for sprites
loadRoot('https://i.imgur.com')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('goomba','KPO3fR9.png')
loadSprite('brick','pogC9x5.png')
loadSprite('block','bdrLpi6.png')
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

})

start("game")