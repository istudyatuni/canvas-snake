let cnv = document.getElementById('cnv');
let ctx = cnv.getContext('2d');

const sensitivity = 20;

let w = window.innerWidth;
let h = window.innerHeight;
cnv.width = w;
cnv.height = h;

let s =50;
let sw = ~~(w / s) - 1;
let sh = ~~(h / s) - 1;
let border = 4;

let dirChanged = false;
let dir = 1;
let snake = [];
for (let i = 0; i < 3; i++) {
    snake.push({x: ~~(sw / 2) - i, y: ~~(sh / 2)});
}

let foodX = 0;
let foodY = 0;
newFood();

function newFood() {
    let valid = true;
    do {
        foodX = ~~(Math.random() * sw);
        foodY = ~~(Math.random() * sh);
        valid = true;
        for (let i = 0; i < snake.length; i++) {
            if(foodX == snake[i].x && foodY == snake[i].y) {
                valid = false;
            }
        }
    } while(!valid);
}

function newSnake() {
    dir = 1;
    snake = [];
    for (let i = 0; i < 3; i++) {
        snake.push({x: ~~(sw / 2) - i, y: ~~(sh / 2)});
    }
}

var touchStart = null; //Точка начала касания
var touchPosition = null; //Текущая позиция
cnv.addEventListener("keypress", function (e) { playWhen(e); })
//Перехватываем события
cnv.addEventListener("touchstart", function (e) { TouchStart(e); }); //Начало касания
cnv.addEventListener("touchmove", function (e) { TouchMove(e); }); //Движение пальцем по экрану
//Пользователь отпустил экран
cnv.addEventListener("touchend", function (e) { TouchEnd(e); });
//Отмена касания
cnv.addEventListener("touchcancel", function (e) { TouchEnd(e); });
//for touchscreem
function TouchStart(e) {
    //Получаем текущую позицию касания
    touchStart = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    touchPosition = { x: touchStart.x, y: touchStart.y };
}

function TouchMove(e) {
    //Получаем новую позицию
    touchPosition = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
}

function TouchEnd(e) {
    CheckAction(); //Определяем, какой жест совершил пользователь

    //Очищаем позиции
    touchStart = null;
    touchPosition = null;
}
swipeDir = null;
function CheckAction()
{
    //console.log('check');
    var d = //Получаем расстояния от начальной до конечной точек по обеим осям
    {
     x: touchStart.x - touchPosition.x,
     y: touchStart.y - touchPosition.y
    };

    if(Math.abs(d.x) > Math.abs(d.y)) //Проверяем, движение по какой оси было длиннее
    {
     if(Math.abs(d.x) > sensitivity) //Проверяем, было ли движение достаточно длинным
     {
         if(d.x > 0) {//Если значение больше нуля, значит пользователь двигал пальцем справа налево
             keyDown(37);
         } else {//Иначе он двигал им слева направо
            keyDown(39);
         }
     }
    }
    else {//Аналогичные проверки для вертикальной оси
        if(Math.abs(d.y) > sensitivity) {
            if(d.y > 0) {//Свайп вверх
                keyDown(38);
            } else {//Свайп вниз
                keyDown(40);
            }
        }
    }
}
animate = setInterval(update, 150);
document.onkeydown = keyDown;
function pause() {
    clearInterval(animate);
    isPause = !isPause;
}
function playWhen(e) {
    console.log('here');
    if(e.code == 32 && isPause) {
        play();
    }
}
function play() {
    animate = setInterval(update, 0);
    isPause = !isPause;
}

update();
function update() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';//'#ddd';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#212121';//'#ddd';
    for (let i = 0; i <= sw; i++) {
        ctx.fillRect(i * s, 0, border, sh * s + border);
    }
    for (let i = 0; i <= sh; i++) {
        ctx.fillRect(0, i * s, sw * s + border, border);
    }
  ctx.fillStyle = '#F40404';//'#47d';
    ctx.fillRect(foodX * s + border, foodY * s + border, s - border, s - border);
  ctx.fillStyle = '#57E959';//'#'+Math.floor(Math.random()*2**24).toString(16).padStart(6, '0');
    let dx = snake[0].x;
    let dy = snake[0].y;
    if(dx == foodX && dy == foodY) {
        newFood();
        snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y});
    }
    for (let i = 0; i < snake.length; i++) {
        let x = snake[i].x;
        let y = snake[i].y;
        ctx.fillRect(x * s + border, y * s + border, s - border, s - border);
    }
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }
    if(dir == 0) {
        dy--;
    }
    else if(dir == 1) {
        dx++;
    }
    else if(dir == 2) {
        dy++;
    }
    else {
        dx--;
    }
    snake[0].x = (dx % sw + sw) % sw;
    snake[0].y = (dy % sh + sh) % sh;
    for (let i = 1; i < snake.length; i++) {
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            newFood();
            newSnake();
        }
    }
    dirChanged = false;
}
var isPause = false;
function keyDown(e) {
    if(dirChanged) return;
    let newDir = 0;
    //console.log(e.keyCode);
    if(w >= 1500) {
        switch(e.keyCode) {
            case 87: case 38:
                newDir = 0;
                if (isPause) {
                    play();
                    isPause = !isPause;
                }
                break;
            case 68: case 39:
                newDir = 1;
                if (isPause) {
                    play();
                    isPause = !isPause;
                }
                break;
            case 83: case 40:
                newDir = 2;
                if (isPause) {
                    play();
                    isPause = !isPause;
                }
                break;
            case 65: case 37:
                newDir = 3;
                if (isPause) {
                    play();
                    isPause = !isPause;
                }
                break;
            case 80:
                console.log(isPause);
                break;
            case 32:
                if(!isPause) {
                    pause();
                } else if(isPause) {
                    play();
                }
                isPause = !isPause;
                return;
        }
    }
    if(w < 1500) {//предположим что если экран уже чем 1500 пикселей то у него сенсорное управление
        if(e == 38) {
            newDir = 0;
        } else if(e == 39) {
            newDir = 1;
        }else if(e == 40) {
            newDir = 2;
        }else if(e == 37) {
            newDir = 3;
        }
    }
    if(((dir + 2) % 4) != newDir) {
        dir = newDir;
        dirChanged = true;
    }
}