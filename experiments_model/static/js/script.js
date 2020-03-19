
alpha = 80; // 90 - угол обзора датчика/2
time = 0; //отсчет эксперимента
nplotpoints = 300; // количество точек для построения графика
xo = -200; //начальное положение объекта в поле
yo = 0; //начальное положение объекта в поле
radius = 400;// радиус обнаружения
X = 0;
Y = 0;



fPlot = document.getElementById("fplot");
fPlot2 = document.getElementById("fplot-2");
circle = document.getElementById("circle");
sector = document.getElementById("sector");


fPlota = document.getElementById("fplota");
fPlota2 = document.getElementById("fplota-2");
sector2 = document.getElementById("sector-2");
xo2 = -300;

field = document.getElementById("field");
var isActive; // индикатор попадания объекта в зону детектирования датчика
no = 1;
balls_quantity = 2;
sty = [];
yp = [];
xp = [];
balls_in_field = [];
speed= 300; // скорость
T = 0.3; // задержка датчика от 0.3 минуты до 5 минут
systemTime = 100; // частота записи данных состояния системы
experimentTime = 0; // текущее время эксперимента
data = []; // данные эксперимента
sensorDelay = 100; // задержка опроса датчика в мс
var IKsensor;
var currentExperiment;
var stopCount ;
var ikSensor;
k = 0; // счетчик таймера
var obgMain = 400;
var objUser = 400;
sum = 0;


var  balls_movement_1;
var  balls_movement_2;
var balls_movement = true;
var detector_1 =[];
var detector_2 =[];
var detector_1_value = [];
var detector_2_value = [];

makePlot(xo, yo, fPlot, fPlot2);
setSector(radius, xo, yo, sector);

makePlot(xo2, yo, fPlota, fPlota2);
setSector(radius, xo2, yo, sector2);

//document.getElementById(`ball`).style.top = 200 + "px";
//setTimeout('Run(xo, yo, radius)', speed);

// Получаем данные из формы о координатах датчика и радиусе обнаружения
function setData(){
 	dstring="";
 	dstring2="";
 	xo = - document.getElementById("xo").value;
 	yo = document.getElementById("yo").value;
 	radius = document.getElementById("radius").value;
 	makePlot();
 	setSector();
}

// Считаем длину окружности
function getL (r) {
   return Math.PI*r/180 * (180-2*alpha)
}

// Вычисляем координаты образующих прямых сектора
function getY (x, xo, yo) {
	return Math.tan(degToRad(alpha))*(x+xo) + yo
}
function getX (y, xo, yo) {
	return  (y - yo) / Math.tan(degToRad(alpha)) - xo
}
function getY2 (x, xo, yo) {
	return -Math.tan(degToRad(alpha))*(x+xo) + yo
}
function getX2 (y, xo, yo) {
	return (yo - y) / Math.tan(degToRad(alpha)) - xo
}

// Градусы в радианы
function degToRad (deg) {
	return deg / 180 * Math.PI;
}

// Отрисовка прямых образующих сектор
function makePlot(xo, yo, fPlot, fPlot2 ){
 	var dstring="M"+-xo+","+yo+" ";
 	var dstring2="M"+-xo+","+yo+" ";
 	//nplotpoints = Math.max(getX2(radius),getX(radius));
 	for(t=-xo;t<getX(radius*Math.cos(degToRad(90-alpha)), xo, yo);t++){
 		dstring=dstring+"L"+t+","+getY(t, xo, yo)+" ";
 	}
	for(t=getX2(radius*Math.cos(degToRad(90-alpha)), xo, yo);t<-xo;t++){
		dstring2=dstring2+"L"+t+","+getY2(t, xo, yo)+" ";
 }
 //X = radius + radius * Math.cos(degToRad(180 - 2*alpha))
 //Y = radius + radius * Math.sin(degToRad(180 - 2*alpha))
 //dstring3="M"+-xo+","+0 +" " +  "A" + radius + "," + radius + " " + "1 0,1" + " " + X + "," + Y  + " "+ "z";
 fPlot.setAttributeNS(null, "d", dstring);
 fPlot2.setAttributeNS(null, "d", dstring2);
 //circle.setAttributeNS(null, "d", dstring3);
}

// Устанавливаем параметры отображения сектора
function setSector(radius, xo, yo, sector){
	sector.setAttribute('r', radius);
	sector.setAttribute('cx', -xo);
	var L = getL(radius);
	var offL = 2 * Math.PI * radius - L;
	var offsetL = Math.PI * radius / 4 + 3*L - 1*L/4;
	sector.setAttribute('stroke-dasharray', L + " " + offL);
	sector.setAttribute('stroke-dashoffset', offsetL);
	sector.setAttribute('transform', 'rotate(' + ' ' +  '-180' + ' ' + -xo  + ' ' + yo + ')');
}


// Анимация движения детектируемого объекта
yp[0] = Math.random()*200;

CreateBalls();
setTimeout('Run2()', speed);

function CreateBalls(){
	for (i=0; i<balls_quantity; i++){
		field.insertAdjacentHTML('afterbegin', `<div id="ball-${i}" class="ball"</div>`);
		yp[i] = 100 + 500/balls_quantity*i;
		xp[i] = 50 + i*30;
		document.getElementById(`ball-${i}`).style.top = yp[i] + "px";
	}
}

let step_y;
let current_ball;

function Run2(){
	for (i=0; i<balls_quantity; i++){
		step_y = 4;
	  	xp[i] += step_y;
	  	if ((xp[i] < -500) || (xp[i] >500 )) {
	  		xp[i] = 0;
	  	}
	  	//document.getElementById(`ball-${i}`).style.top = yp[i] + "px";
		current_ball = document.getElementById(`ball-${i}`);
	    current_ball.style.left = xp[i] + "px";

	    Pos(xo, yo, radius, fPlot, fPlot2, sector, current_ball, i, 1);
	    Pos(xo2, yo, radius, fPlota, fPlota2, sector2, current_ball, i, 2);

	}

	balls_movement_2 = setTimeout('Run2()', speed);
}


function Run(xo, yo, radius) {
	    let sty = 4;
	  	yp[0] += sty;
	  	if ((yp[0] < -500) || (yp[0] >500 )) {
	  		yp[0] = 0
	  	}
	  	//document.getElementById("ball").style.top = yp[i] + "px";
	    current_ball = document.getElementById("ball");
	    current_ball.style.left = yp[0] + "px";


	    Pos(xo, yo, radius, fPlot, fPlot2, sector, current_ball, balls_quantity, 1);
	    Pos(xo2, yo, radius, fPlota, fPlota2, sector2, current_ball, balls_quantity, 2);

		balls_movement_1 = setTimeout('Run(xo, yo, radius)', speed);
}


// Определяем реакцию датчика
function Pos(xo, yo, radius, fPlot, fPlot2, sector, current_ball, i, detector) {
	//var ball = document.getElementById('ball'); // берем интересующий элемент
	//var posX = ball.offsetLeft;  // верхний отступ эл-та от родителя
	//var posY = ball.offsetTop; // левый отступ эл-та от родителя
		let posX = current_ball.offsetLeft;  // верхний отступ эл-та от родителя
		let posY = current_ball.offsetTop;  // верхний отступ эл-та от родителя
		obgMain = Detection(posX, posY, xo, yo, radius, fPlot, fPlot2, sector, i, detector);
}

// Определяем выходные данные датчика при движении 2х объектов
function currentDistance (obgMain, objUser, fPlot, fPlot2, sector) {
	if ((obgMain - objUser) === 0){
		ikSensor = 400;
   		document.getElementById("coordinates").innerHTML = ikSensor ;
		fPlot.setAttribute('stroke',"#4793bf");
		fPlot2.setAttribute('stroke',"#4793bf");
		sector.setAttribute('stroke',"#4793bf");
		isActive = 0;
	} else {
		if (obgMain === 400) {
			console.log('Я в поле');
			ikSensor = objUser;
		} else if (objUser === 400) {
			console.log('Мяч в поле');
			ikSensor = obgMain;
		} else {
			if ((obgMain - objUser) > 0) {
				console.log('ближе мой');
				ikSensor = objUser;
				console.log(ikSensor);
			} else {
				console.log('ближе обычный');
				ikSensor = obgMain;
				console.log(ikSensor)
			}
		}
		isActive = 1;

		fPlot.setAttribute('stroke', "#d6313c");
		fPlot2.setAttribute('stroke', "#d6313c");
		sector.setAttribute('stroke', "#d6313c");
		document.getElementById("coordinates").innerHTML = ikSensor;
	}
}


function Detection(posX, posY, xo, yo, radius, fPlot, fPlot2, sector, i, detector) {

   if ((posY>getY(posX, xo, yo)) && (posY>getY2(posX, xo, yo)) && (posY<Math.sqrt(radius*radius-xo*xo))){
		IKsensor=Math.sqrt((posY-yo)**2+(posX+xo)**2);
		if (detector === 1) {
			detector_1[i] = 1;
			detector_1_value[i] = Math.sqrt((posY-yo)**2+(posX+xo)**2);
		} else if (detector === 2) {
			detector_2[i] = 1;
			detector_2_value[i] = Math.sqrt((posY-yo)**2+(posX+xo)**2);
		}
		//balls_in_field[i] = 1;
   } else {
   		if (detector === 1) {
			detector_1[i] = 0;
			detector_1_value[i] = 0
		} else if (detector === 2) {
			detector_2[i] = 0;
			detector_2_value[i] = 0
		}
   		IKsensor = 400;
   		//balls_in_field[i] = 0;
   }
   /*sum = 0;
   balls_in_field.forEach(function (item) {
			sum = sum + item;
		});
   console.log(sum);*/

    console.log('Первый', detector_1);
	console.log('Второй', detector_2);
	console.log('fsdf', detector_2_value);

   //currentDistance(obgMain, objUser, fPlot, fPlot2, sector);
   return IKsensor
}

// Формирование результатов экспериментов
function addData(time, delay, distance1, distance2, realState) {
  data.push({
    time: time,
    delay: delay,
    distance1: distance1,
	distance2: distance2,
    onField: realState
  });
}


// Таймер
var startTimer = function(){
	currentExperiment = setInterval(function(){
		sum = 0;
		for (let j=0; j<balls_quantity; j++) {
			if (detector_1[i]===1 || detector_2[i]===1) {
				sum = sum + 1;
			}
		}
		console.log(sum);

		detector1 = Math.max.apply(null, detector_1_value);
		detector2 = Math.max.apply(null, detector_2_value);

		if (detector1 === 0) {
			detector1 = 400
		}

		if (detector2 === 0) {
			detector2 = 400
		}

		isActive = sum;
		addData(experimentTime, sensorDelay, detector1, detector2, isActive);
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
	//sendData(data);
};


// Эксперименты с мышкой
/*
$('html').mousemove(function(e){
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	$('div.movablediv').css({'top': y,'left': x});
	let posX = ball.offsetLeft;  // верхний отступ эл-та от родителя
	let posY = ball.offsetTop; // левый отступ эл-та от родителя
	objUser = Detection(x - field.offsetLeft, y - field.offsetTop, xo, yo, radius, fPlot, fPlot2, sector, 5);
});

 */


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