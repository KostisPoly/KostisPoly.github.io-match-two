document.addEventListener("DOMContentLoaded", function(event) { 
    
    document.getElementById('fetch').addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('canvas').style.visibility = "hidden";
        var cards = document.getElementsByClassName('card-inner');
        [...cards].forEach(function(element){
            element.classList.remove('fliped');
            element.classList.remove('matched');
        })
        document.getElementById('spinner').removeAttribute('hidden');
        getImages().then(imageData => {
            console.log(imageData.message);
            var arrOne = Object.values(imageData.message);
            var arrTwo = Object.values(imageData.message);
            var randomArrOne = shuffle(arrOne);
            var randomArrTwo = shuffle(arrTwo);
            var randomConcat = randomArrOne.concat(randomArrTwo);
            var randomArr = shuffle(randomConcat);
            var backImages = document.getElementsByClassName('back-img');

            [...backImages].forEach(function(element, index) {
                element.src = randomArr[index];
            })
            document.getElementById('heading').innerHTML = 'Match All Cards To Win!';
            document.getElementById('spinner').setAttribute('hidden', '');
        })
        
    })

    var cards = document.getElementsByClassName('card-inner');
    [...cards].forEach(function(element, index){
        element.addEventListener('click', function(e){

            this.classList.add('fliped');
            var active = document.getElementById('active');
            if(active && this !== active){
                
                var activeSrc = active.querySelector('.card-back').children[0].src;
                var currentSrc = this.querySelector('.card-back').children[0].src;
                if(activeSrc === currentSrc){
                    active.classList.add('matched');
                    this.classList.add('matched');
                    active.removeAttribute('id','active');
                    if(document.getElementsByClassName('matched').length > 15) {
                        document.getElementById('heading').innerHTML = 'Hooray You Won!';
                        // Initialize Canvas
                        document.getElementById('canvas').style.visibility = "visible";
                        canvas.width = W;
                        canvas.height = H;
                        Draw();
                    }
                }else{
                    var currentEl = this;
                    setTimeout(function(){
                        active.classList.remove('fliped');
                        currentEl.classList.remove('fliped');
                        active.removeAttribute('id','active');
                    },1200);
                }

            }else{
                this.setAttribute('id', 'active');
            }
        });
    })

    async function getImages(){
        var response = await fetch('https://dog.ceo/api/breeds/image/random/8');
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        var data = await response.json();
        return data;
    }

    //Knuth shuffle
    function shuffle(array) {
        var currentIndex = array.length,  randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    //Bubbly button
    var animateButton = function(e) {

        e.preventDefault;
        //reset animation
        e.target.classList.remove('animate');
        
        e.target.classList.add('animate');
        setTimeout(function(){
        e.target.classList.remove('animate');
        },700);
    };
    
    var bubblyButtons = document.getElementsByClassName("bubbly-button");
    
    for (var i = 0; i < bubblyButtons.length; i++) {
        bubblyButtons[i].addEventListener('click', animateButton, false);
    }

    //Canvas Win Animation
    let W = window.innerWidth;
    let H = window.innerHeight;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const maxConfettis = 150;
    const particles = [];

    const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson"
    ];

    function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
    }

    function confettiParticle() {
    this.x = Math.random() * W; // x
    this.y = Math.random() * H - H; // y
    this.r = randomFromTo(11, 33); // radius
    this.d = Math.random() * maxConfettis + 11;
    this.color =
        possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function() {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
    };
    }

    function Draw() {
    const results = [];

    // Magical recursive functional love
    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i];

        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.y <= H) remainingFlakes++;

        // If a confetti has fluttered out of view,
        // bring it back to above the viewport and let if re-fall.
        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
        particle.x = Math.random() * W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
        }
    }

    return results;
    }

    window.addEventListener(
    "resize",
    function() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    false
    );

    // Push new confetti objects to `particles[]`
    for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
    }


});