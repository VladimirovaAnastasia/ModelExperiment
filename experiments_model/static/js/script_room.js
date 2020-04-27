

time = 0; //отсчет эксперимента
X = 0;
Y = 0;
let sum_balls;
let detector;
let balls_in;
let sum_detection;

var  balls_movement_1;
var  balls_movement_2;
var balls_movement = true;
field = document.getElementById("field");
field.style.display="none";
var isActive; // индикатор попадания объекта в зону детектирования датчика
let balls_quantity;
let number_circles;

sty = [];
yp = [];
xp = [];
balls_in_field = [];
speed= 30; // скорость
T = 0.3; // задержка датчика от 0.3 минуты до 5 минут
systemTime = 100; // частота записи данных состояния системы
experimentTime = 0; // текущее время эксперимента
data = []; // данные эксперимента
sensorDelay = 100; // задержка опроса датчика в мс
var IKsensor;
var currentExperiment;
var stopCount ;
k = 0; // счетчик таймера
var obgMain = 400;


var sectors = [];



//var x_variable = [ 25, 75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 575 ];
//var y_variable = [ 25, 75, 125, 175, 225, 275, 325, 375 ];
var x_variable = [ 52, 75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 550];
var y_variable = [  52, 75, 125, 175, 225, 275, 325, 350];

makeObjects = function (number_circles) {
    for (let i = 0; i < number_circles; i++) {

        let x = x_variable[Math.floor(Math.random() * x_variable.length)];
        let y = y_variable[Math.floor(Math.random() * y_variable.length)];
        let radius = 53;
        makeCircle(x, y, radius, i);
        sectors.push({
            xo: x,
            yo: y,
            r: radius,
            isActive: 0,
            balls: []
        })
    }
};

let timer_online = document.getElementById("timer_online");
let timer_certain = document.getElementById("timer_certain");
let configuration = document.getElementById("configuration");

timer_online.style.display="none";
timer_certain.style.display="none";
configuration.style.display="flex";


const setData = function () {
    balls_quantity = document.getElementById("objects").value;
 	number_circles = document.getElementById("detectors").value;
 	field.style.display="flex";
 	timer_online.style.display="block";
    timer_certain.style.display="block";
    configuration.style.display="none";

    let html = `<p>Количество объектов - <span style="color:red">${balls_quantity}</span>;&nbsp;&nbsp;</p> <p> Количество датчиков -<span style="color:red"> ${number_circles}</span>.</p>`;
    document.querySelector('#experiment_data').insertAdjacentHTML("afterBegin", html);

    let rad = document.getElementsByName('direction');
    makeObjects(number_circles);
 	CreateBalls(balls_quantity);
    for (let i=0; i<rad.length; i++) {
        if (rad[i].checked) {
            switch(i) {
                case 0:
                    setTimeout('Run_left_right()', speed);
                    break;
                case 1:
                    setTimeout('Run_left_and_right()', speed);
                    break;
                case 2:
                    setTimeout('Run_random()', speed);
                    break;
                default:
                    alert('Ошибка!')
            }
        }
    }
};


function makeCircle(xo, yo, r, j) {
    var circle = `<svg><circle id="circle-${j}" r="${r}" cx="${xo}" cy="${yo}" fill="white" stroke="#4793bf"/></svg>`;
    var g = document.getElementById('g');
    g.insertAdjacentHTML('afterBegin', circle);
}



function CreateBalls(balls_quantity){
	for (i=0; i<balls_quantity; i++){
		field.insertAdjacentHTML('afterbegin', `<div id="ball-${i}" class="ball"</div>`);
		//yp[i] =  400/balls_quantity*i;
        yp[i] = getRandomInt(5, 400);
		xp[i] =  -400 + getRandomInt(5, 100);
		document.getElementById(`ball-${i}`).style.top = yp[i] + "px";
	}
}

let step_y;
let current_ball;
let isActiveFiedls=[];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}




function Run_left_right(){
	for (i=0; i<balls_quantity; i++){
	    current_ball = document.getElementById(`ball-${i}`);
		step_y = 4;
	  	xp[i] += step_y;
	  	if ((xp[i] < -500) || (xp[i] >800 )) {
	  		xp[i] = -350 + getRandomInt(5, 100);
	  		current_ball.style.top = getRandomInt(1, 350) + "px";
	  	}
	    current_ball.style.left = xp[i] + "px";
        Pos__front(current_ball, i);
        if ((xp[i] < 0) || ( xp[i] > 600)) {
            isActiveFiedls[i] = 0
        } else {
            isActiveFiedls[i] = 1
        }
	}
	sum_balls = 0;
	isActiveFiedls.forEach(function(item) {
	    sum_balls = sum_balls + item
    });
    if (sum_balls>0) {
        field.style.background="#FFFFA1"
    } else {
        field.style.background="#FFFFFF"
    }
	balls_movement_2 = setTimeout('Run_left_right()', speed);
}

function Run_right_left(){
	for (i=0; i<balls_quantity; i++){
	    current_ball = document.getElementById(`ball-${i}`);
		step_y = 4;
	  	xp[i] -= step_y;
	  	if ((xp[i] < -500) || (xp[i] >800 )) {
	  		xp[i] = 800 - getRandomInt(5, 100);
	  		current_ball.style.top = getRandomInt(1, 350) + "px";
	  	}
	    current_ball.style.left = xp[i] + "px";
        Pos__front(current_ball, i);
        if ((xp[i] < 0) || ( xp[i] > 600)) {
            isActiveFiedls[i] = 0
        } else {
            isActiveFiedls[i] = 1
        }
	}
	sum_balls = 0;
	isActiveFiedls.forEach(function(item) {
	    sum_balls = sum_balls + item
    });
    if (sum_balls>0) {
        field.style.background="#FFFFA1"
    } else {
        field.style.background="#FFFFFF"
    }
	balls_movement_2 = setTimeout('Run_right_left()', speed);
}

function Run_left_and_right(){
	for (i=0; i<balls_quantity; i++){
	    current_ball = document.getElementById(`ball-${i}`);
		step_y = 4;
		if (i%2=== 0) {
		    xp[i] += step_y;
            if ((xp[i] < -500) || (xp[i] >800 )) {
                xp[i] = -350 + getRandomInt(5, 100);
                current_ball.style.top = getRandomInt(1, 350) + "px";
            }
        } else {
		    xp[i] -= step_y;
            if ((xp[i] < -500) || (xp[i] >800 )) {
                xp[i] = 800 - getRandomInt(5, 100);
                current_ball.style.top = getRandomInt(1, 350) + "px";
            }
        }

	    current_ball.style.left = xp[i] + "px";
        Pos__front(current_ball, i);
        if ((xp[i] < 0) || ( xp[i] > 600)) {
            isActiveFiedls[i] = 0
        } else {
            isActiveFiedls[i] = 1
        }
	}
	sum_balls = 0;
	isActiveFiedls.forEach(function(item) {
	    sum_balls = sum_balls + item
    });
    if (sum_balls>0) {
        field.style.background="#FFFFA1"
    } else {
        field.style.background="#FFFFFF"
    }
	balls_movement_2 = setTimeout('Run_left_and_right()', speed);
}

function Run_random(){
	for (i = 0; i<balls_quantity; i++){
	    current_ball = document.getElementById(`ball-${i}`);
	  	step_y = 4;

	  	if (i % 2 === 0) {
		    xp[i] += step_y;
		    yp[i] += step_y;
            if ((xp[i] < -500) || (xp[i] >800 )) {
                xp[i] = -350 + getRandomInt(5, 100);
            }
            if ((yp[i] > 500) || (yp[i] <-100 )) {
                yp[i] = -100 + getRandomInt(5, 100);
            }
        } else if (i % 3 === 0) {
		    xp[i] -= step_y;
		    yp[i] -= step_y;
            if ((xp[i] < -500) || (xp[i] >800 )) {
                xp[i] = 800 - getRandomInt(5, 100);
            }
            if ((yp[i] > 500) || (yp[i] <-100 )) {
                yp[i] = 400 - getRandomInt(5, 100);
            }
        }
	  	if (i % 4 === 0) {
		    xp[i] -= step_y*2;
		    yp[i] += step_y*2;
            if ((xp[i] < -500) || (xp[i] >800 )) {
                xp[i] = 700 - getRandomInt(5, 100);
            }
            if ((yp[i] > 500) || (yp[i] <-100 )) {
                yp[i] = 400 - getRandomInt(5, 100);
            }
        }



	    current_ball.style.left = xp[i] + "px";
	  	current_ball.style.top = yp[i] + "px";

        Pos__front(current_ball, i);
        if ((xp[i] < 0) || ( xp[i] > 600) || (yp[i] > 400) || (yp[i] < 0)) {
            isActiveFiedls[i] = 0
        } else {
            isActiveFiedls[i] = 1
        }
	}
	sum_balls = 0;
	isActiveFiedls.forEach(function(item) {
	    sum_balls = sum_balls + item
    });
    if (sum_balls>0) {
        field.style.background="#FFFFA1"
    } else {
        field.style.background="#FFFFFF"
    }
	balls_movement_2 = setTimeout('Run_random()', speed);
}

function Pos__front(current_ball, i) {
    let posX = current_ball.offsetLeft;  // верхний отступ эл-та от родителя
    let posY = current_ball.offsetTop;  // верхний отступ эл-та от родителя
    obgMain = Detection__front(posX, posY, i);
}


function Detection__front(posX, posY, i) {
    for (let h = 0; h < sectors.length; h++){
        let id = 'circle-' + h;
        let current_detector = document.getElementById(id);

        if (((posY - sectors[h].yo) * (posY - sectors[h].yo) + (posX - sectors[h].xo) * (posX - sectors[h].xo)) <= sectors[h].r * sectors[h].r) {
            sectors[h].balls[i] = 1
        } else {
            sectors[h].balls[i] = 0
        }

        let sum = 0;
        sectors[h].balls.forEach(function(item) {
            sum = sum + item;
        });

        if (sum>0) {
            current_detector.setAttribute('stroke', "#d6313c");
            current_detector.setAttribute('fill', "#d6313c");
            sectors[h].isActive = 1
        } else {
            current_detector.setAttribute('stroke', "#4793bf");
            current_detector.setAttribute('fill', "#4793bf");
            sectors[h].isActive = 0
        }

    }

   return IKsensor
}

// Формирование результатов экспериментов
function addData(time, delay, balls, balls_field, detectors, detectors_field, detection, actually) {
    console.log(time, delay, balls, balls_field, detectors, detectors_field, detection, actually);
    current_ball = document.getElementById('ball-1');
    let top_h;
    let left_h;
        if (   (+/\d+/.exec(current_ball.style.left)) > 0 && (+/\d+/.exec(current_ball.style.left)) < 600) {

                top_h= Number(+/\d+/.exec(current_ball.style.top));
                left_h = Number(+/\d+/.exec(current_ball.style.left));

        } else {
                top_h = 1;
                left_h = 1;
        }
        //добавляем только показания датчиков

        let data_exp_1 = {};
        for (let z = 0; z < sectors.length; z++){
		    data_exp_1[`ball-${z}`] = sectors[z].isActive
        }
        data_exp_1['actually'] = actually

        // добавляем всякие количество шаров, координаты, задержку и т д
        let data_exp_2 = {
            //time: time,
            delay: delay,
            balls: balls,
            balls_field: balls_field,
            detectors: detectors,
            detectors_field: detectors_field,
            detection: detection,
            top: top_h,
            left: left_h,
            actually: actually,
        };

  data.push(data_exp_1);


}


// Таймер
var startTimer = function(){
	currentExperiment = setInterval(function(){
	    // Количество сработавших датчиков
        sum_detection = 0;
		for (let d = 0; d < sectors.length; d++){
		    sum_detection = sectors[d].isActive + sum_detection
        }
		//balls_quantity общее количество точек
        // sum_balls количество точек в поле
        // number_circles количество датчиков
        // sum_detection Количество сработавших датчиков
        // sum_detection>0 присутствует ли кто судя по датчику
        // sum_balls>0 присутствует ли кто-то на самом деле
        if (sum_detection>0) { detector = 1} else {detector = 0}
        if (sum_balls>0) { balls_in = 1} else {balls_in = 0}


		addData(experimentTime, sensorDelay, balls_quantity, sum_balls, number_circles, sum_detection, detector, balls_in );
        console.log(experimentTime, sensorDelay, balls_quantity, sum_balls, number_circles, sum_detection, detector, balls_in )
		experimentTime = experimentTime + systemTime;
	}, systemTime);
	var intervalID = setInterval(function(){
		k = k+1;
		var now = new Date();
		var clock = document.getElementById("clock");
		now.setHours(0, 0, k, 0);
		clock.innerHTML = now.toLocaleTimeString();
	}, 1000);
	stopCount = intervalID;
};

var stopTimer = function(){
	clearInterval(stopCount);
	clearInterval(currentExperiment);

	let json = JSON.stringify(data);
	let experimentData = document.getElementById("id_data_of_experiment");
	experimentData.value = json;

	document.querySelector('.send').click();
	sendData(data);
};

let timer_1 = document.getElementById('one-min');
let timer_2 = document.getElementById('two-min');
let timer_3 = document.getElementById('three-min');
let timer_5 = document.getElementById('five-min');
let timer_n = document.getElementById('n-min');
let all_time = document.getElementById('all_time');
let custom_time = document.getElementById('custom_time');
custom_time.style.display="none";

timer_1.onclick = function() {
    timer_1.classList.add('timers__button--active');
    startTimer();
    setTimeout(stopTimer, 1000 * 60);
};

timer_n.onclick = function() {
    all_time.style.display="none";
    custom_time.style.display="block";
};

timer_2.onclick = function() {
    timer_2.classList.add('timers__button--active');
    startTimer();
    setTimeout(stopTimer, 1000 * 60 * 2);
};

timer_3.onclick = function() {
    timer_3.classList.add('timers__button--active');
    startTimer();
    setTimeout(stopTimer, 1000 * 60 * 3);
};

timer_5.onclick = function() {
    timer_5.classList.add('timers__button--active');
    startTimer();
    setTimeout(stopTimer, 1000 * 60 * 5);
};
//Для удобства отладки
addEventListener("keydown", function(event) {
    if ((event.keyCode === 32)&&(balls_movement === true)) {
    	clearTimeout(balls_movement_1);
      	clearTimeout(balls_movement_2);
      	balls_movement = false;
	} else if ((event.keyCode === 32)&&(balls_movement === false)){
    	balls_movement = true;
		//setTimeout('Run_left_right()', speed);
        setTimeout('Run_random()', speed);
    	//setTimeout('Run()', speed);
	}
  });