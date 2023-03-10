const canvasEl = document.querySelector("canvas"), 
            canvasCtx = canvasEl.getContext("2d"),
            gapX = 10,
            lineWidth = 15 //Para tratar a espessura da linha (no fillrect relacionado à linha central (rede) e raquetes).

        const mouse = { x: 0, y: 0 }

        const campo = {
            w: window.innerWidth,
            h: window.innerHeight,
            draw: function() { //O draw estará em todos os métodos
                canvasCtx.fillStyle = "#286047"
                canvasCtx.fillRect(0, 0, this.w, this.h)
            },
        }

        const line = {
            w: lineWidth, //15
            h: campo.h, //Podemos aproveitar a altura do objeto campo (herança)
            draw: function(){
                canvasCtx.fillStyle = "#ffffff" //O fillStyle branco deverá ser replicado para todos os elementos do jogo dentro dos métodos que compõem o objeto
                canvasCtx.fillRect(
                    campo.w / 2 - this.w / 2,
                    0,
                    this.w,
                    this.h)
            },
        }

        const leftPaddle = {
            x: gapX,
            y: 200,
            w: line.w,
            h: 200,
            _move: function() {
                this.y = mouse.y - this.h / 2
            },
            draw: function() {
                canvasCtx.fillStyle = "#ffffff"
                canvasCtx.fillRect(this.x, this.y, this.w, this.h)

                this._move()
            },
        }

        const rightPaddle = { //Lembrando que temos diferença na propriedade x, já que estamos construindo a raquete direita
            x: campo.w - line.w - gapX,
            y: 200,
            w: line.w,
            h: 200,
            speed: 5,
            _move: function() { 
                if (this.y + this.h / 2 < ball.y + ball.r){ //se o meio da raquete for menor que a dimensão da bola (posição y da bola mais o raio)
                    //À medida medida que a bolinha vai se movimentando rapidamente, trabalho também com a velocidade da raquete
                    this.y += this.speed //incremento a posição y da raquete fazendo ela descer (trabalhando juntamente com a speed dela)
                } else {
                    this.y -= this.speed //decremento a posição y da raquete fazendo ela subir (trabalhando juntamente com a speed dela)
                }
            },

            _speedUp: function (){
                this.speed += 1 //o incremento da velocidade da bola é diferente do incremento da velocidade da raquete (sugerido, para criar motivação no jogo)
            },

            draw: function() {
                canvasCtx.fillStyle = "#ffffff"
                canvasCtx.fillRect(this.x, this.y, this.w, this.h)
                this._move()
            }
        }

        const score = {
            human: 0,
            computer: 0,

            increaseHuman: function() {
                this.human++
            },

            increaseComputer: function() {
                this.computer++
            },

            draw: function() {
                canvasCtx.font = "bold 72px Arial"
                canvasCtx.textAlign = 'center'
                canvasCtx.textBaseline = 'top'
                canvasCtx.fillStyle = "#01341D"
                canvasCtx.fillText(this.human, campo.w / 4, 
                50)

                canvasCtx.fillText(
                this.computer, 
                campo.w / 4 + campo.w / 2, 
                50)
                }
        }


        const ball = {
            x: 0,
            y: 0, 
            r: 20, 
            speed: 4,
            directionX: 1,
            directionY: 1, //diz o sentido em que a bolinha está andando. 1: bolinha anda para baixo; -1: bolinha anda para cima.
            

            _calcPosition: function() { //função de cálculo da posição; verifica as laterais superior e inferior do campo
                //verifica se o jogador 1 fez ponto (x > largura do campo). Verificar se passa de Y
                if (this.x > campo.w - this.r - rightPaddle.w - gapX){
                    //verifica se a raquete direita está na posição y da bola
                    if( //se isso for verdade, significa que a bola está rebatendo em algum desses pontos (dimensão de altura da raquete) 
                        this.y + this.r > rightPaddle.y &&
                        this.y - this.r < rightPaddle.y + rightPaddle.h
                    ) {
                        //rebate a bola invertendo o sinal de X
                        this._reverseX()
                    } else {
                        //pontuar o jogador 1
                        score.increaseHuman()
                        this._pointup()
                    }
                }

                //verifica se o jogador 2 fez ponto (x < 0 (largura do campo)).
                if (this.x < this.r + leftPaddle.w + gapX){
                    //verifica se a raquete esquerda está na posição y da bola
                    if(
                        this.y + this.r > leftPaddle.y &&
                        this.y - this.r < leftPaddle.y + leftPaddle.h 
                    ) {
                        //rebate a bola invertendo o sinal de X
                        this._reverseX()
                    } else {
                        //pontuar o jogador 2
                        score.increaseComputer()
                        this._pointup()
                    }
            }


                if (
                    (this.y - this.r < 0 && this.directionY < 0) ||
                    (this.y > campo.h - this.r && this.directionY > 0)
                    ){ //vai verificar se a posição da bola está relativa à lateral (inferior e superior)
                    
                    //rebate a bola invertendo o sinal do eixo Y
                    this._reverseY()
                }
            },

            

            _reverseX: function () { //função usada para rebater (x = eixo horizontal)
                //1 * -1 = -1
                //-1 * -1 = 1
                this.directionX = this.directionX * -1 //inverte o sinal do valor que contém a propriedade directionX
                //forma resumida: this.directionX *= -1
            },

            _reverseY: function () {
                //1 * -1 = -1
                //-1 * -1 = 1
                this.directionY = this.directionY * -1 //inverte o sinal do valor que contém a propriedade directionY
                //forma resumida: this.directionY *= -1
            },

            _pointup: function(){//função para quando há marcação de ponto, colocando a bola no meio do campo
                this._speedUp()
                rightPaddle._speedUp()

                this.x = campo.w / 2
                this.y = campo.h / 2
            },

            _move: function() {
                this.x += this.directionX * this.speed
                this.y += this.directionY * this.speed
            },
            
            _speedUp: function(){
                this.speed += 1
            },

            draw: function() {
                canvasCtx.fillStyle = "#ffffff"
                canvasCtx.beginPath()
                canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false) //As duas últimas propriedades são fixas, pois quero sempre uma bola
                canvasCtx.fill() 

                this._calcPosition()
                this._move()
            },
        }

        function setup(){
            canvasEl.width = canvasCtx.width = campo.w //Simplificando e referenciando objeto à partir do pilar de herança
            canvasEl.height = canvasCtx.height = campo.h
        }

        function draw(){
            campo.draw() //Com objeto, agora posso somente chamar o método de desenho. Tudo o que eu precisava me preocupar, já está contido nesse objeto campo, declarado lá em cima. 
            line.draw()
            
            leftPaddle.draw()
            rightPaddle.draw()
            
            score.draw() //Chamar a função score antes da função ball para ficar abaixo da mesma, dentro do funcionamento de empilhamento do canvas

            ball.draw()
            

        }

        //setup()
        //draw() //Chamar essa função para desenhar os elementos na tela - Já está contida na function main

        //while(true){
            //draw()
        //}

        window.animateFrame = (function () { //Para tratar da animação do objeto ball, tornando a animação mais suavizada frame à frame
            return ( //chamar várias vezes em razão das versões/navegadores
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback){
                    return window.setTimeout(callback, 1000 / 60)
                }
            )

        })()

        function main() {
            animateFrame(main)
            draw()
        }

        setup()
        main()
        //window.setInterval(draw, 1000 / 60)

        canvasEl.addEventListener("mousemove", function(e){
            mouse.x = e.pageX //O objeto mouse vai ter na sua propriedade X, os valores do pageX
            mouse.y = e.pageY

            //console.log(mouse) //para verificar a alteração do mouse.x e mouse.y em função do movimento do mouse cuja propriedade é pageX e pageY de e (que é o parâmetro da função)
        })