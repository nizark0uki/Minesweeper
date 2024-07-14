document.addEventListener('DOMContentLoaded', (event) => {
    const playBtn = document.getElementById('playBtn')
    const pauseBtn = document.getElementById('pause')
    const gamePage = document.getElementById('game-page')
    const homePage = document.getElementById('home-page')
    const music = document.getElementById('music')
    const howToPlayBtn = document.getElementById('howToPlayBtn')
    const menu = document.getElementById('menu')
    playBtn.addEventListener("click", () => {
        
        gamePage.classList.remove('hidden')
        gamePage.classList.add('style')
        homePage.classList.add('hidden')
        homePage.classList.remove('play')
        console.log(music)
        console.log(pauseBtn)
        menu.insertBefore(music, pauseBtn)
        music.style.display='flex'
        
    })
    
    pauseBtn.addEventListener("click", () => {
        gamePage.classList.add('hidden')
        gamePage.classList.remove('style')
        homePage.classList.remove('hidden')
        homePage.classList.add('play')
        homePage.insertBefore(music, howToPlayBtn)
    })

    var checkbox = document.querySelector('input[type="checkbox"]')
    var audio = document.getElementById("audio")
    if (checkbox.checked) audio.play()
    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          audio.play()
        } else {
          audio.pause()
        }
    })
    
    
    const popup = document.getElementById('popup')
    const closeBtn = document.querySelector('.close')

    howToPlayBtn.addEventListener('click', () => {
        popup.style.display = 'block'
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none'
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none'
        }
    });
    
    
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.getElementById('result')
    const refresh = document.getElementById('refresh')
    const selectDifficulty = document.getElementById('difficulty')
    const width = 10
    var bombAmount = 15
    flagsLeft.innerHTML = (bombAmount).toString().padStart(3, '0')
    
    selectDifficulty.addEventListener('change', function() {
        const selectedDifficulty = selectDifficulty.value
        if (selectedDifficulty == "easy") {
            bombAmount = 15
        } else if ((selectedDifficulty == "medium")) {
            bombAmount = 25
        } else {
            bombAmount = 35
        }
        flagsLeft.innerHTML = (bombAmount).toString().padStart(3, '0')
        resetGame()
    })
    
    var squares = []
    var isGameOver = false
    var flags = 0
    
    refresh.addEventListener('click',()=>{
        if (isGameOver) resetGame()
        else{
            alert('Are You Sure !')
            resetGame()
        }
    })

    function createBoard(){
        const bombArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        

        for(var i = 0; i < width*width; i++){
            const square = document.createElement('div')
            square.id = i
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            

        if (isMobile) {
            var start;
            var longPressTimeout;

            square.addEventListener('touchstart', function(event) {
                start = new Date().getTime();
                longPressTimeout = setTimeout(function() {
                    addFlag(square);
                }, 200);
            });

            square.addEventListener('touchend', function(event) {
                clearTimeout(longPressTimeout);
                var end = new Date().getTime();
                if ((end - start) < 200) {
                    click(square);
                }
            })
        } else {
            square.addEventListener('click', function(e) {
                if (e.ctrlKey) {
                    addFlag(square);
                } else {
                    click(square);
                }
            });
        }
            
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
                // squares[i].innerHTML = total

            }
        }
    }
    createBoard()

    function resetGame() {
        result.innerHTML = ''
        refresh.innerHTML = '😀'
        isGameOver = false
        flags = 0
        flagsLeft
        squares = []
        grid.innerHTML = ''
        flagsLeft.innerHTML = (bombAmount).toString().padStart(3, '0')
        createBoard()
    }

    function addFlag(square){
        if (isGameOver) return
        if (!square.classList.contains('flag') && (flags < bombAmount)){
            if (!square.classList.contains('flag')){
                square.classList.add('flag')
                flags++
                square.innerHTML = '🚩'
                flagsLeft.innerHTML = (bombAmount - flags).toString().padStart(3, '0')
                checkWin()
            }
        } else if (square.classList.contains('flag')){
            square.classList.remove('flag')
            flags--
            square.innerHTML = ''
            flagsLeft.innerHTML = (bombAmount - flags).toString().padStart(3, '0')
        } else return
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
        console.log(bombAmount)
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')){
            
            gameOver(square)
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

    function gameOver(square){
        result.innerHTML = "Boom!! Game Over"
        refresh.innerHTML = '🙁'
        isGameOver = true
        square.style.backgroundColor = 'rgb(206, 72, 72)'
        squares.forEach(function(square){
            if (square.classList.contains('bomb')){
                square.innerHTML ='💣'
                // square.classList.remove('bomb')
                square.classList.add('checked')
            } else if (!square.classList.contains('bomb') && square.classList.contains('flag'))
                square.innerHTML = '❌'
        })
    }

    

});