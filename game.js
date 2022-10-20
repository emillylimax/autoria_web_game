const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i< collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i< battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
    x: -760,
    y: -800
}

collisionsMap.forEach((row,i) =>{
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})

c.fillRect(0,0,canvas.width,canvas.height)

const battleZones = []

battleZonesMap.forEach((row,i) =>{
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        battleZones.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})

const image = new Image()
image.src = 'MapaProject.png'

const foregroundImage = new Image()
foregroundImage.src = 'fore.png'

const playerDownImage = new Image()
playerDownImage.src = 'playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = 'playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = 'playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = 'playerRight.png'

const player = new Sprite({
    position:{
        x:canvas.width / 2 - 192 / 2,
        y:canvas.height / 2 - 68 / 2
    },
    image:playerDownImage,
    frames:{
        max: 3,
        hold: 10
    },
    sprites: {
        up:playerUpImage,
        left:playerLeftImage,
        right:playerRightImage,
        down:playerDownImage
    }
})

const background = new Sprite({
    position: {
    x: offset.x,
    y:offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
    x: offset.x,
    y:offset.y
    },
    image: foregroundImage
})

const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    }
}


const movables = [background, ...boundaries,foreground, ...battleZones]

function rectangularCollisions({rectangle1, rectangle2}){
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const battle = {
    initiated: false
}

function animate(){
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
    boundary.draw()
    /*monstros.andar / movimentar chamar cada draw dos monstros*/

})
    battleZones.forEach(battleZone =>{
        battleZone.draw()
    })

    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false 
    
    if (battle.initiated) return

// ATIVAR A BATALHA
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        for(let i=0; i<battleZones.length; i++){
            const battleZone = battleZones [i]
            const overlappingArea = 
            (Math.min(
                player.position.x + player.width,
                battleZone.position.x + battleZone.width
            ) - 
                Math.max (player.position.x, battleZone.position.x)) *
                (Math.min (
                    player.position.y + player.height
                ) -
                Math.max (player.position.y, battleZone.position.y))
            if (
                rectangularCollisions ({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2 && 
                Math.random () < 0.02
            ) {
                //DEACTIVATE CURRENT ANIMATION LOOP
                window.cancelAnimationFrame(animationId)

                audio.Map.stop()
                audio.initBattle.play()

                battle.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                            //ACTIVATE A NEW ANIMATION LOOP
                            animateBattle()
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4
                            })
                            }
                        })
                    }
                })
                break
            }
        }       
    }        

    if(keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up

        for(let i=0; i<boundaries.length; i++){
            const boundary = boundaries [i]
            if (
                rectangularCollisions({
                    rectangle1: player,
                    rectangle2: {...boundary, position :{
                        x: boundary.position.x,
                        y:boundary.position.y +3
                    }}
                })
            ){
                moving = false
                break
            }
        }

        if(moving)
        movables.forEach(movable =>{
            movable.position.y += 3
        })
    } 
    else if (keys.a.pressed  && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for(let i=0; i<boundaries.length; i++){
            const boundary = boundaries [i]
            if (
                rectangularCollisions({
                    rectangle1: player,
                    rectangle2: {...boundary, position :{
                        x: boundary.position.x +3,
                        y:boundary.position.y
                    }}
                })
            ){
                moving = false
                break
            }

        }

        if(moving)
        movables.forEach(movable =>{
            movable.position.x += 3
        })
    }
    else if (keys.s.pressed  && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down

        for(let i=0; i<boundaries.length; i++){
            const boundary = boundaries [i]
            if (
                rectangularCollisions({
                    rectangle1: player,
                    rectangle2: {...boundary, position :{
                        x: boundary.position.x,
                        y:boundary.position.y -3
                    }}
                })
            ){
                moving = false
                break
            }

        }

        if(moving)
        movables.forEach(movable =>{
            movable.position.y -= 3
        })
    } 
    else if (keys.d.pressed  && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right

        for(let i=0; i<boundaries.length; i++){
            const boundary = boundaries [i]
            if (
                rectangularCollisions({
                    rectangle1: player,
                    rectangle2: {...boundary, position :{
                        x: boundary.position.x - 3,
                        y:boundary.position.y
                    }}
                })
            ){
                moving = false
                break
            }

        }

        if(moving)
        movables.forEach(movable =>{
            movable.position.x -= 3
        })
    } 

}

animate()

const battleBackgroundImage = new Image ()
battleBackgroundImage.src = 'battleback.png'
const battleBackground = new Sprite ({
    position: {
    x: 0,
    y: 0
},
image: battleBackgroundImage
})

const jogadorImage = new Image ()
jogadorImage.src = 'jogadorStill_2.png'
const jogador = new Sprite ({
    position: {
        x: 150,
        y: 300
    },
    image: jogadorImage,
    frames: {
        max: 3,
        hold: 15
    },
    animate: true
})

const offset2 = {
    x: 600,
    y: 300
}

const character_1Image = new Image ()
character_1Image.src = 'Character_1.png'
const character_1 = new Sprite ({
    position: {
        x: offset2.x,
        y: offset2.y
    },
    image: character_1Image,
    frames: {
        max: 3,
        hold: 15
    },
    animate: true
}) 

const character_2Image = new Image ()
character_2Image.src = 'Character_2.png'
const character_2 = new Sprite ({
    position: {
        x: 500,
        y: 150
    },
    image: character_2Image,
    frames: {
        max: 3,
        hold: 15
    },
    animate: true
})

const character_3Image = new Image ()
character_3Image.src = 'Character_3.png'
const character_3 = new Sprite ({
    position: {
        x: 800,
        y: 200
    },
    image: character_3Image,
    frames: {
        max: 3,
        hold: 15
    },
    animate: true,

})
   

function animateBattle() {
    window.requestAnimationFrame (animateBattle)
    battleBackground.draw()
    jogador.draw()
    character_1.draw()
    character_2.draw()
    character_3.draw()
    
}

let contador = 0
let execucao = setInterval(() => {
    contador++

    if (contador === 1 ){
        character_1.position.y+=50
        character_2.position.y+=50
        character_3.position.y+=50
    }
    if (contador === 2 ){
        character_1.position.x-=50
        character_2.position.x-=50
        character_3.position.x-=50
    }
    if (contador === 3 ){
        character_1.position.y-=50
        character_2.position.y-=50
        character_3.position.y=200
    }
    if (contador === 4 ){
        character_1.position.x+=50
        character_2.position.x+=50
        character_3.position.x=800
        contador = 0
    }
}, 700)


let lastKey = ''
window.addEventListener('keydown', (e) => {

    switch(e.key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break;

        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break;
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break;
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break;    

    }

})



window.addEventListener('keyup', (e) => {

    switch(e.key){
        case 'w':
            keys.w.pressed = false
            break;

        case 'a':
            keys.a.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;    

    }

})

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})



