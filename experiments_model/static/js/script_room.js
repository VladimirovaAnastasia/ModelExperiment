

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
var isActive; // индикатор попадания объекта в зону детектирования датчика

balls_quantity = 10;
sty = [];
yp = [];
xp = [];
balls_in_field = [];
speed= 50; // скорость
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
var number_circles = 10;
//var x_variable = [ 25, 75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 575 ];
//var y_variable = [ 25, 75, 125, 175, 225, 275, 325, 375 ];
var x_variable = [ 52, 75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 550];
var y_variable = [  52, 75, 125, 175, 225, 275, 325, 350];

for (let i=0; i< number_circles; i++) {

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


function makeCircle(xo, yo, r, j) {
    var circle = `<svg><circle id="circle-${j}" r="${r}" cx="${xo}" cy="${yo}" fill="white" stroke="#4793bf"/></svg>`;
    var g = document.getElementById('g');
    g.insertAdjacentHTML('afterBegin', circle);
}


CreateBalls();
setTimeout('Run2()', speed);

function CreateBalls(){
	for (i=0; i<balls_quantity; i++){
		field.insertAdjacentHTML('afterbegin', `<div id="ball-${i}" class="ball"</div>`);
		yp[i] =  400/balls_quantity*i;
		if (i % 3 == 0) {
		    xp[i] =  150 - i* (Math.random() * (30 - 10) + 10);
        } else {
		    xp[i] = -150 +  i* (Math.random() * (30 - 10) + 10);
        }
		document.getElementById(`ball-${i}`).style.top = yp[i] + "px";
	}
}

let step_y;
let current_ball;
let isActiveFiedls=[];

function Run2(){
	for (i=0; i<balls_quantity; i++){
		step_y = 4;
	  	xp[i] += step_y;
	  	if ((xp[i] < -500) || (xp[i] >800 )) {
	  		xp[i] = -400;
	  	}
	  	//document.getElementById(`ball-${i}`).style.top = yp[i] + "px";
		current_ball = document.getElementById(`ball-${i}`);
	    current_ball.style.left = xp[i] + "px";
	    //Pos(xo, yo, radius, fPlot, fPlot2, sector, current_ball, i, 1);
	    //Pos(xo2, yo, radius, fPlota, fPlota2, sector2, current_ball, i, 2);
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
	balls_movement_2 = setTimeout('Run2()', speed);
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
  data.push({
    //time: time,
    delay: delay,
    //balls: balls,
	balls_field: balls_field,
    //detectors: detectors,
    detectors_field: detectors_field,
    detection: detection,
    actually: actually
  });
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
		k=k+1;
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


//Для удобства отладки
addEventListener("keydown", function(event) {
    if ((event.keyCode === 32)&&(balls_movement === true)) {
    	clearTimeout(balls_movement_1);
      	clearTimeout(balls_movement_2);
      	balls_movement = false;
	} else if ((event.keyCode === 32)&&(balls_movement === false)){
    	balls_movement = true;
		setTimeout('Run2()', speed);
    	//setTimeout('Run()', speed);
	}
  });