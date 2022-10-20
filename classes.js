class Sprite {
    constructor({position,velocity, image,frames = {max: 1, hold: 10}, sprites, animate = false}){
      this.position = position  
      this.image = image
      this.frames = {...frames, val: 0, elapse: 0}

      this.image.onload = () =>{
        this.width = this.image.width / this.frames.max
        this.height = this.image.height
      }
      this.animate = animate
      this.sprites = sprites
      
    }

    draw(){
       c.drawImage(
        this.image,
        this.frames.val * this.width,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height
      )

      if (!this.animate) return
    
      if (this.frames.max > 1){
        this.frames.elapse ++
      }

      if (this.frames.elapse % this.frames.hold === 0){
        if (this.frames.val < this.frames.max -1) this.frames.val++
        else this.frames.val = 0
      }
      
    }
}


class Boundary{
    static width = 48
    static height = 48
    constructor({position}){
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw(){
        c.fillStyle = 'rgba(255,0,0,0.0)'
        c.fillRect(this.position.x, this.position.y,this.width,this.height)
    }
}

 /*
Classe monstro com 3 instâncias de monstro, posição 0 do array, posição 1 e 2 
Limpa tela, desenha mapa, desenha sprite
Final atualiza variáveis (pra onde andou e etc), quando for redesenhar
Posição X
 */
