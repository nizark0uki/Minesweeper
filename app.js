document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.getElementById('result')
    const width = 10
    var bombAmount = 20
    var squares = []
    var isGameOver = false
    var flags = 0

    function createBord(){
        flagsLeft.innerHTML = bombAmount

        const bombArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for(var i = 0; i < width*width; i++){
            const square = document.createElement('div')
            square.id = i
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            square.addEventListener('click', function(e){
                if (e.ctrlKey && e.button === 0) {
                    addFlag(square)
                } else click(square)})
            
        }


        for(var i=0; i < squares.length; i++){
            var total=0
            const leftEdge = (i % width === 0)
            const rightEdge = (i % width === width - 1)
            if ( squares[i].classList.contains('valid')){
                if(!leftEdge && squares[i - 1].classList.contains('bomb')) total++
                if(!rightEdge && squares[i + 1].classList.contains('bomb')) total++
                if(i >  width - 1 && squares[i  - width].classList.contains('bomb')) total++
                if(i < squares.length - width && squares[i + width].classList.contains('bomb')) total++
                if(!leftEdge && i >  width - 1 && squares[i  - width - 1].classList.contains('bomb')) total++
                if(!leftEdge && i < squares.length - width && squares[i  + width - 1].classList.contains('bomb')) total++
                if(!rightEdge && i >  width - 1 && squares[i  - width + 1].classList.contains('bomb')) total++
                if(!rightEdge && i < squares.length - width && squares[i  + width + 1].classList.contains('bomb')) total++
                
                squares[i].setAttribute('data', total)

            }
        }
    }
    createBord()

    function addFlag(square){
        if (isGameOver) return
        if (!square.classList.contains('flag') && (flags <= bombAmount)){
            if (!square.classList.contains('flag')){
                square.classList.add('flag')
                flags++
                square.innerHTML = '🚩'
                flagsLeft.innerHTML = bombAmount - flags
                checkWin()
            }
        } else {
            square.classList.remove('flag')
            flags--
            square.innerHTML = ''
            flagsLeft.innerHTML = bombAmount - flags
        }
    }

    function checkWin(){
        var matches = 0
        for (var i = 0; i<squares.length; i++){
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) matches++
        }
        if (matches === bombAmount){
            result.innerHTML = 'YOU WIN !!!'
            isGameOver = true
        }
    }
    
    function click(square){
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')){
            gameOver()
        } else{
            var total = square.getAttribute('data')
            if (total !=0) {
                if (total == 1) square.style.color = 'blue'
                if (total == 2) square.style.color = 'green'
                if (total == 3) square.style.color = 'red'
                if (total == 4) square.style.color = '#00008B'
                if (total == 5) square.style.color = 'brown'
                if (total == 6) square.style.color = '#fc8f9f'
                if (total == 7) square.style.color = 'black'
                if (total == 8) square.style.color = 'gray'
                square.innerHTML = total
                square.classList.add('checked')
                return
                
            }
        square.classList.add('checked')
             
        }
        checkSquare(square)  
    }

    function checkSquare(square){
        const currentId = square.id
        const leftEdge = currentId % width === 0
        const rightEdge = currentId % width === width - 1
        setTimeout(function(){
            if (!leftEdge){
                const newSquare = document.getElementById(parseInt(currentId) - 1)
                click (newSquare)
            }
            if (!rightEdge){
                const newSquare = document.getElementById(parseInt(currentId) + 1)
                click (newSquare)
            }
            if (currentId > width ){
                const newSquare = document.getElementById(parseInt(currentId) - width)
                click (newSquare)
            }
            if (currentId < squares.length-width){
                const newSquare = document.getElementById(parseInt(currentId) + width)
                click (newSquare)
            }
            if (currentId > width - 1 && !rightEdge){
                const newSquare = document.getElementById(parseInt(currentId) + 1 - width)
                click (newSquare)
            }
            if (currentId < squares.length-width && !rightEdge){
                const newSquare = document.getElementById(parseInt(currentId) + 1 + width)
                click (newSquare)
            }
            if (currentId > width && !leftEdge){
                const newSquare = document.getElementById(parseInt(currentId) - 1 - width)
                click (newSquare)
            }
            if (currentId < squares.length-width && !leftEdge){
                const newSquare = document.getElementById(parseInt(currentId) - 1 + width)
                click (newSquare)
            }
        },10)
    }

    function gameOver(){
        result.innerHTML = "Boom!! Game Over"
        isGameOver = true

        squares.forEach(function(square){
            if (square.classList.contains('bomb')){
                square.innerHTML ='💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }

});