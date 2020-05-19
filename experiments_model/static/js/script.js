
time = 0;

let sum_balls;
let detector;
let isBallsInField;
let sum_detection;

let step_y;
let current_ball;
let isActiveFiedls = [];


let target_sectors = [];

let width_of_field = 650;

let rad = document.getElementsByName('direction');

let sectors_for_delete = [];



detection_area = document.getElementById("detection-area");
field = document.getElementById("field");

field.style.display="none";
field.style.width = width_of_field + 'px';
detection_area.style.width = width_of_field + 'px';


let balls_quantity;
let number_circles;

sty = [];
yp = [];
xp = [];
let sectors = [];

systemTime = 100; // частота опроса датчика
let experimentTime = 0; // текущее время эксперимента
data = []; // данные эксперимента
let currentExperiment;
let stopCount ;
k = 0; // счетчик таймера


let radius = 66;
let detectors_x = 0;
let detectors_y = 0;


let timer_online = document.getElementById("timer_online");
let timer_certain = document.getElementById("timer_certain");
let configuration = document.getElementById("configuration");
timer_online.style.display="none";
timer_certain.style.display="none";
configuration.style.display="flex";


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeDetectors (number_circles) {
    let actually_detectors = 0;
    for (let i = 0; i < Number(number_circles); i++) {
        let x;
        let y;
        let delete_circles = 0;

        for (let n=0; n<sectors_for_delete.length; n++) {
            if (sectors_for_delete[n] === i) {
                delete_circles++;
            }
        }

        if (i === 15) {
            detectors_x = 0;
            detectors_y = 0;
        }

        if (i < 15) {
            if ((radius + 2*detectors_x*radius) < width_of_field) {
                if ((radius + 2*detectors_x*radius) > width_of_field - radius + 10) {
                    x =  2*detectors_x*radius;
                } else {
                    x = radius + 2*detectors_x*radius;
                }
                y = radius + 2*detectors_y*radius;
                detectors_x++;
            } else {
                detectors_x = 0;
                detectors_y++;
                x = radius + 2*detectors_x*radius;
                y = radius + 2*detectors_y*radius;
                detectors_x++;
            }
        } else {
            if ((2*radius + 2*detectors_x*radius) < width_of_field) {
                if ((radius + 2*detectors_x*radius) > width_of_field - radius + 10) {
                    x =  2*detectors_x*radius;
                } else {
                    x = 2*radius + 2*detectors_x*radius;
                }
                y = 2*radius + 2*detectors_y*radius;
                detectors_x++;
            } else {
                detectors_x = 0;
                detectors_y++;
                x = 2*radius + 2*detectors_x*radius;
                y = 2*radius + 2*detectors_y*radius;
                detectors_x++;
            }
        }

        if (delete_circles === 0) {
            makeCircle(x, y, radius, actually_detectors);
            sectors.push({
                xo: x,
                yo: y,
                r: radius,
                isActive: 0,
                balls: []
            });
            actually_detectors ++;
        }
    }
}


function setData () {
    balls_quantity = document.getElementById("objects").value;
 	number_circles = document.getElementById("detectors").value;

 	field.style.display="flex";
 	timer_online.style.display="block";
    timer_certain.style.display="block";
    configuration.style.display="none";

    let html = `<p>Количество объектов - <span style="color:red">${balls_quantity}</span>;&nbsp;&nbsp;</p> <p> Количество датчиков -<span style="color:red"> ${number_circles}</span>.</p>`;
    document.querySelector('#experiment_data').insertAdjacentHTML("afterBegin", html);

    makeDetectors(number_circles);
 	сreateBalls(balls_quantity);

 	for (let b=0; b<number_circles; b++) {
        target_sectors.push(1)
    }

 	deleteDetectors();
}

function deleteDetectors () {
    let detector_circles = document.querySelectorAll('.detector-circle');
    for (let o=0; o<detector_circles.length; o++) {
        detector_circles[o].onclick = function() {
            target_sectors_counter = 0;
            for (let c=0; c<target_sectors.length; c++) {
                if (target_sectors[c] === 0) {
                    target_sectors_counter++;
                }
                if ((c-target_sectors_counter) === o) {
                    target_sectors[c] = 0;
                    sectors_for_delete.push(c);
                }
            }
            sectors = [];
            objects_group = document.getElementById('objects-group');
            objects_group.innerHTML = '';
            detectors_x = 0;
            detectors_y = 0;
            let html = `<p>Количество объектов - <span style="color:red">${balls_quantity}</span>;&nbsp;&nbsp;</p> <p> Количество датчиков -<span style="color:red"> ${number_circles-sectors_for_delete.length}</span>.</p>`;
            document.querySelector('#experiment_data').innerHTML='';
            document.querySelector('#experiment_data').insertAdjacentHTML("afterBegin", html);
            makeDetectors(Number(number_circles));
            deleteDetectors()
        }
    }
}

function makeCircle(xo, yo, r, j) {
    let circle = `<svg class="detector-circle"><circle  id="circle-${j}" r="${r}" cx="${xo}" cy="${yo}" fill="white" stroke="#4793bf"/></svg>`;
    let objects_group = document.getElementById('objects-group');
    objects_group.insertAdjacentHTML('beforeEnd', circle);
}



function сreateBalls(balls_quantity){
	for (i=0; i<balls_quantity; i++){
		field.insertAdjacentHTML('afterbegin', `<div id="ball-${i}" class="ball"</div>`);
        yp[i] = getRandomInt(5, 400);
		xp[i] =  -400 + getRandomInt(5, 100);
		document.getElementById(`ball-${i}`).style.top = yp[i] + "px";
	}
}


// Direction of movement
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
        getPosition(current_ball, i);
        if ((xp[i] < 0) || ( xp[i] > width_of_field)) {
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
	balls_movement = setTimeout('Run_left_right()', speed);
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
        getPosition(current_ball, i);
        if ((xp[i] < 0) || ( xp[i] > width_of_field)) {
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
	balls_movement = setTimeout('Run_left_and_right()', speed);
}

function RunRandom(){
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
        getPosition(current_ball, i);
        if ((xp[i] < 0) || ( xp[i] > width_of_field) || (yp[i] > 400) || (yp[i] < 0)) {
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
	balls_movement = setTimeout('RunRandom()', speed);
}



function getPosition(current_ball, i) {
    let posX = current_ball.offsetLeft;  // верхний отступ эл-та от родителя
    let posY = current_ball.offsetTop;  // верхний отступ эл-та от родителя
    detectBalls(posX, posY, i);
}


function detectBalls(posX, posY, i) {
    for (let h = 0; h < sectors.length; h++){
        let id = 'circle-' + h;
        let current_detector = document.getElementById(id);
        if (current_detector === null) {
        } else {

            if (Math.sqrt(((posY - sectors[h].yo) * (posY - sectors[h].yo) + (posX - sectors[h].xo) * (posX - sectors[h].xo))) <= (sectors[h].r + 25)) {
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
    }
}


function addData(actually) {
    let data_exp_1 = {};
    for (let z = 0; z < sectors.length; z++){
        data_exp_1[`ball-${z}`] = sectors[z].isActive
    }
    data_exp_1['actually'] = actually;
    data.push(data_exp_1)
}


// Timer
function startTimer(){
	currentExperiment = setInterval(function(){
	    // Количество сработавших датчиков
        sum_detection = 0;
		for (let d = 0; d < sectors.length; d++){
		    sum_detection = sectors[d].isActive + sum_detection
        }
        if (sum_detection>0) { detector = 1} else {detector = 0}
        if (sum_balls>0) { isBallsInField = 1} else {isBallsInField = 0}

		addData(isBallsInField);
		experimentTime = experimentTime + systemTime;
	}, systemTime);

	var intervalID = setInterval(function(){
		k = k+1;
		let now = new Date();
		let clock = document.getElementById("clock");
		now.setHours(0, 0, k, 0);
		clock.innerHTML = now.toLocaleTimeString();
	}, 1000);
	stopCount = intervalID;
}

function stopTimer(){
	clearInterval(stopCount);
	clearInterval(currentExperiment);
	let json = JSON.stringify(data);
	let experimentData = document.getElementById("id_data_of_experiment");
	experimentData.value = json;
	document.querySelector('.send').click();
}


let timers = [];
timers.push(document.getElementById('one-min'));
timers.push(document.getElementById('two-min'));
timers.push(document.getElementById('three-min'));
timers.push(document.getElementById('five-min'));

let timer_n = document.getElementById('n-min');
let all_time = document.getElementById('all-time');
let custom_time = document.getElementById('custom-time');
custom_time.style.display="none";

for (let g=0; g<timers.length; g++) {
    timers[g].onclick = function() {
        timers[g].classList.add('timers__button--active');
        startTimer();
        setTimeout(stopTimer, 1000 * 60 * (g+1));
    }
}

timer_n.onclick = function() {
    all_time.style.display="none";
    custom_time.style.display="block";
};




const speed= 30; // Cкорость движения
let balls_movement;
let is_balls_move = false;
// Start/stop movement of circles
addEventListener("keydown", function(event) {
    if ((event.keyCode === 32) && (is_balls_move === true)) {
      	is_balls_move = false;
      	clearTimeout(balls_movement);
	} else if ((event.keyCode === 32) && (is_balls_move === false)) {
    	is_balls_move = true;
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
                        setTimeout('RunRandom()', speed);
                        break;
                    default:
                        alert('Ошибка!')
                }
            }
        }
	}
});