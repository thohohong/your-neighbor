var main_c;
var direction;

var screenHeight = 900;
var screenWidth = 1200;
var personImgWidth = 233;
var personImgHeight = 394;

var game_start;
var game_prepare = 1;
var game_over;
var ending_code;
var ending_frame = 0;
var time = 0;
var date = 1;
const TIME_PER_DAY = 7200 //2 min

var transition_from;
var transition_to;

var transition_frame;
var wait_frame;
var wait;
const TRANSITION_TIME = 60; // transition map while this frame;

var smoking_frame;
const SMOKING_TIME = 120;

var cur_map;
const MAP_WINDOW = 0;
const MAP_ROOM = 1;
const MAP_TOILET = 2;
const MAP_OUTSIDE = 5;
const MAP_ENDING = 6;
const MAP_TRUE_ENDING = 7;

var stress_value = 30;
const MIN_STRESS = 0;
const MAX_STRESS = 100;

var work_value = 0;
const MIN_WORK = 0;
const MAX_WORK = 100;

var neighbor_state;
var neighbor_health = 100;
var neighbor_flag = true;
const NEIGHBOR_WINDOW = 0;
const NEIGHBOR_SIT = 1;
const NEIGHBOR_STAND = 2;

const STATE_STAND_FRONT = 0;
const STATE_STAND_SIDE = 1;
const STATE_WALK = 2;
const STATE_SMOKE = 3;
const STATE_WORK = 4;
const STATE_SITTING = 5;

const D_LEFT = false;
const D_RIGHT = true;

var bar_color;
var fonts;



/* ======== graphic value ======= */

    /* 'pg' means person graphic */
var pg_walk = [];
var pg_sit = [];
var pg_stand;
var pg_smoke;
var ob_smoke;
var pg_neighbor = [];

    /* 'bg' means background graphic */
var bg_map = [];
var bg_chair;
var bg_desk;
var bg_yellow;
var bg_button;

var sound;
/* ============================== */
class person {
    constructor(x, y, state){
        this.x = x;
        this.y = y;
        this.state = state;
        this.frame = 0;
        this.block = false;
    }
    action(){
        switch(this.state){
            case STATE_WALK :
                this.draw(pg_walk[this.frame % 4], direction);
                break;
            case STATE_STAND_SIDE :
                this.draw(pg_stand_side, direction);
                break;
            case STATE_WORK :
                this.draw(pg_sit[3], D_LEFT);
                break;
            case STATE_STAND_FRONT :
                this.draw(pg_stand_front, direction);
                break;
            case STATE_SMOKE :
                this.smoke(direction);
                this.draw(pg_smoke, direction);
        }
    }
    walk(flag) { 
        if (!this.block) {
            if (this.state != STATE_WALK) {
                this.state = STATE_WALK;
            }

            if (!flag) {
                this.frame = 0;
                return;
            }
            if (time % 9 == 0) {
                this.frame++;
            }

            if (direction == D_RIGHT) {
                this.x += 3;
            }
            else {
                this.x -= 3;
            }
        }
    }

    work() {

    }

    stand_front() {

    }

    stand_side() { //true == right, false == left
        this.state = STATE_STAND_SIDE;
        this.frame = 0;
    }


    sit(sitting) {  // true == sitting; false == standing
        if (sitting){

        }
        else {

        }
    }

    draw(img, direction) { //draw person based on feet's coordinate
        if (direction == D_LEFT){
            image(img, this.x - personImgWidth / 2, this.y - personImgHeight);
        }
        else {
            push();
            translate(personImgWidth, 0);
            translate(this.x - personImgWidth / 2, this.y - personImgHeight);
            scale(-1, 1);
            image(img, 0, 0);
            pop();
        }
    }

    smoke(direction){
        smoking_frame++;
        let opacity = smoking_frame / SMOKING_TIME * 255;
        if (direction == D_LEFT){
            push();
            tint(255, opacity);
            //scale(1, 0.3);
            image(ob_smoke, this.x - personImgWidth / 2 - 142, this.y - personImgHeight - 234);
            //image(ob_smoke, this.x - personImgWidth / 2 - 142, this.y - personImgHeight + 940);
            pop();
        }
        else {
            push();
            tint(255, opacity);
            translate(personImgWidth, 0);
            translate(this.x - personImgWidth / 2 + 140, this.y - personImgHeight - 234);
            scale(-1, 1);            

            //translate(this.x - personImgWidth / 2 + 140, this.y - personImgHeight - 34);

            image(ob_smoke, 0, 0);
            pop();
        }
    }
}

function setup(){
    createCanvas(1200, 900);
    game_start = false;
    game_over = false;
    cur_map = MAP_WINDOW;
    stress_value = 20;
    work_value = 0;
    bar_color = color(255, 255, 255);
    main_c = new person(1062, 913, STATE_STAND_FRONT);
    transition_frame = 0;
    smoking_frame = 0;
    neighbor_state = NEIGHBOR_WINDOW;
    neighbor_health = 100;
    sound.play();
}

function preload(){
    pg_stand_front = loadImage('resource/img_person/stand_front.png');
    pg_stand_side = loadImage('resource/img_person/stand_side.png');

    pg_walk[0] = pg_stand_side;
    pg_walk[1] = loadImage('resource/img_person/walk_0.png');
    pg_walk[2] = pg_stand_side;
    pg_walk[3] = loadImage('resource/img_person/walk_1.png');

    pg_sit[0] = loadImage('resource/img_person/sit_0.png');
    pg_sit[1] = loadImage('resource/img_person/sit_1.png');
    pg_sit[2] = loadImage('resource/img_person/sit_2.png');
    pg_sit[3] = loadImage('resource/img_person/sit_3.png');

    pg_smoke = loadImage('resource/img_person/smoke.png');
    ob_smoke = loadImage('resource/img_person/smoke_ob.png');

    bg_map[MAP_WINDOW] = loadImage('resource/img_background/window.png');
    bg_map[MAP_ROOM] = loadImage('resource/img_background/room.png');
    bg_map[MAP_TOILET] = loadImage('resource/img_background/toilet.png');
    bg_map[MAP_ROOM + 2] = loadImage('resource/img_background/room_shadow.png');
    bg_map[MAP_TOILET + 2] = loadImage('resource/img_background/toilet_shadow.png');
    bg_chair = loadImage('resource/img_background/chair.png');
    bg_desk = loadImage('resource/img_background/desk.png');
    bg_yellow = loadImage('resource/img_background/yellow.png');
    bg_button = loadImage('resource/img_background/cmd.png');

    //pg_neighbor[NEIGHBOR_WINDOW] = loadImage('resource/img_person/neighbor_window.png');
    pg_neighbor[NEIGHBOR_SIT] = loadImage('resource/img_person/neighbor_sit.png');
    pg_neighbor[NEIGHBOR_STAND] = loadImage('resource/img_person/neighbor_stand.png');
    pg_neighbor[NEIGHBOR_SIT + 2] = loadImage('resource/img_person/neighbor_sit_black.png');
    pg_neighbor[NEIGHBOR_STAND + 2] = loadImage('resource/img_person/neighbor_stand_black.png');

    soundFormats('mp3', 'ogg');
    sound = loadSound('resource/Maestro_Tlakaelel_revise.mp3');
    fonts = loadFont('resource/fonts/PressStart2P-Regular.ttf');
}

function draw() {
    if (game_start && !game_over){
        time++;
        if (time % 30 == 0) {
            stress_value += 1.8;
            if (stress_value >= 100){
                game_over = true;
                game_start = false;
                ending_code = 0;
            }
        }
    }
    if (time > TIME_PER_DAY && game_start){
        game_over = true;
        game_start = false;
        ending_code = 1;
    }
    if (game_over){
        game_over = false;
        transition_from = cur_map;
        transition_to = MAP_ENDING;
        transition(cur_map, MAP_ENDING);
    }
    if (keyIsPressed) keyEntered();
    if (main_c.state == STATE_WORK && !game_over){
        if (time % 30 == 0){
            work_value += 1.5;
        }
        if (work_value >= 100){
            game_over = true;
            game_start = false;
            ending_code = 2;
        }
    }
    if (main_c.state == STATE_SMOKE){
        if (time % 30 == 0){
            if (stress_value > 3) stress_value -= 4;
            neighbor_health -= 1.5;
        }
    }
    if (transition_frame != 0){
        transition(transition_from, transition_to, wait);
    }
    else{
        draw_background(cur_map);
    }
    if (!game_start && time == 0){
        fill(0, 0, 0, 200);
        rect(0, 0, screenWidth, screenHeight);
        fill(255, 255, 255);
        textFont(fonts);
        textSize(60);
        textAlign(LEFT, CENTER);
        text("YOUR NEIGHBOR", 50, 380);
        if (game_prepare == 1){
            textSize(30);
            text("▶ GAME START", 80, 460);
            text("▶ HOW TO PLAY?", 80, 520);
        }
        if (game_prepare == 2){
            textSize(16);
            text("You waked up in today 9:00 AM,\nand You have to finish your work until 11:59 PM.", 50, 460);
            text("But it is hard time to finish your assignment,\nso you get stress as time goes by.", 50, 530);
            text("If you get full stress, than you will give up your Assignment :(", 50, 590)
            text("You love smoking, so you can reduce your stress by smoking.", 50, 640);
            text("You can smoke in your bathroom, window, and outside.\nIt is best way to smoking on outside, but it takes time to get out.", 50, 690);
            text("But keep in your mind that you have a neighbor on your upstairs.", 50, 730);
            textSize(30);
            text("▶ GAME START", 770, 800);
        }
        return;
    }    
    draw_statebar(0, 0);
}

function keyEntered(){
    switch(cur_map) {
        case MAP_WINDOW :
            switch(keyCode) {
                case UP_ARROW :
                    //transition(MAP_WINDOW, MAP_ROOM);
                    break;
                case DOWN_ARROW :
                    break;
                case LEFT_ARROW :
                    //main_c.walk(true);
                    break;
                case RIGHT_ARROW :
                    //main_c.walk(true);
                    break;
            }
            break;
        case MAP_ROOM :
            switch(keyCode) {
                case UP_ARROW :
                    break;
                case DOWN_ARROW :
                    break;
                case LEFT_ARROW :
                    //direction = D_LEFT;
                    if (main_c.x < 80){
                        main_c.walk(false);
                    }
                    else main_c.walk(true);
                    break;
                case RIGHT_ARROW :
                    //direction = D_RIGHT;
                    if (main_c.x > 1050){
                        transition_from = MAP_ROOM;
                        transition_to = MAP_TOILET;
                        wait = 0;
                        transition(MAP_ROOM, MAP_TOILET, 0);
                    }
                    else main_c.walk(true);
                    break;
            }
            break;
        case MAP_TOILET :
            switch(keyCode){
                case LEFT_ARROW :
                    //direction = D_LEFT;
                    if (main_c.x < 650){
                        transition_from = MAP_TOILET;
                        transition_to = MAP_ROOM;
                        wait = 0;
                        transition(MAP_TOILET, MAP_ROOM, 0);
                    }
                    else main_c.walk(true);
                    break;
                case RIGHT_ARROW :
                    //direction = D_RIGHT;
                    if (main_c.x > 1005){
                        main_c.walk(false);
                    }
                    else main_c.walk(true);
                    break;
            }
            break;
        case MAP_OUTSIDE :
            switch(keyCode){
                case LEFT_ARROW :
                    //direction = D_LEFT;
                    if (main_c.x < 0){
                        main_c.walk(false);
                    }
                    else main_c.walk(true);
                    break;
                case RIGHT_ARROW :
                    //direction = D_RIGHT;
                    if (main_c.x > 300){
                        main_c.walk(false);
                    }
                    else main_c.walk(true);
                    break;
            }

    }
}

function keyPressed(){
    print("keycode is " + keyCode);
    if (!game_start || game_over) return;
    switch(cur_map) {
        case MAP_WINDOW :
            switch(keyCode) {
                case UP_ARROW :
                    transition_from = MAP_WINDOW;
                    transition_to = MAP_ROOM;
                    wait = 0;
                    transition(MAP_WINDOW, MAP_ROOM, 0);
                    break;
                case DOWN_ARROW :
                    break;
                case LEFT_ARROW :
                    break;
                case RIGHT_ARROW :
                    break;
                case 32 : //space_bar;
                    smoking_frame = 0;
                    if (main_c.state == STATE_SMOKE){
                        main_c.state = STATE_STAND_FRONT;
                    }
                    else {
                        main_c.state = STATE_SMOKE;
                    }
                    break;
            }
            break;
        case MAP_ROOM :
            switch(keyCode) {
                case UP_ARROW :
                    if (main_c.x > 0 && main_c.x < 300){
                        main_c.state = STATE_WORK;
                        main_c.x = 210;
                    }
                    if (main_c.x > 720 && main_c.x < 960){
                        transition_frame = 1;
                        transition_from = MAP_ROOM;
                        transition_to = MAP_OUTSIDE;
                        wait = 60;
                        transition(MAP_ROOM, MAP_OUTSIDE, 60);
                    }
                    break;
                case DOWN_ARROW :
                    if (main_c.x > 720 && main_c.x < 960){
                        transition_frame = 1;
                        transition_from = MAP_ROOM;
                        transition_to = MAP_WINDOW;
                        wait = 0;
                        transition(MAP_ROOM, MAP_WINDOW, 0);
                    }
                case LEFT_ARROW :
                    direction = D_LEFT;
                    break;
                case RIGHT_ARROW :
                    direction = D_RIGHT;
                    break;
            }
            break;
        case MAP_TOILET :
            switch(keyCode){
                case LEFT_ARROW :
                    direction = D_LEFT;
                    break;
                case RIGHT_ARROW :
                    direction = D_RIGHT;
                    break;
                case 32 : //space_bar;
                    smoking_frame = 0;
                    if (main_c.state == STATE_SMOKE){
                        main_c.state = STATE_STAND_FRONT;
                    }
                    else {
                        main_c.state = STATE_SMOKE;
                    }
                    break;
            }
            break;
        case MAP_OUTSIDE :
            switch(keyCode){
                case LEFT_ARROW :
                    direction = D_LEFT;
                    break;
                case RIGHT_ARROW :
                    direction = D_RIGHT;
                    break;
                case UP_ARROW :
                    transition_frame = 1;
                    transition_from = MAP_OUTSIDE;
                    transition_to = MAP_ROOM;
                    wait = 60;
                    transition(MAP_OUTSIDE, MAP_ROOM, 60);
                    break;
                case 32 : //space_bar;
                    smoking_frame = 0;
                    if (main_c.state == STATE_SMOKE){
                        main_c.state = STATE_STAND_FRONT;
                    }
                    else {
                        main_c.state = STATE_SMOKE;
                    }
                    break;
            }
            break;
    }
}

function keyReleased(){
    //if (value != 0) return;
    switch(cur_map){
        case MAP_WINDOW :
            break;
        case MAP_ROOM :
            if (keyCode == LEFT_ARROW){
                main_c.stand_side();
            }
            else if (keyCode == RIGHT_ARROW){
                main_c.stand_side();
            }
            break;
        case MAP_TOILET :
            if (keyCode == LEFT_ARROW){
                main_c.stand_side();
            }
            else if (keyCode == RIGHT_ARROW){
                main_c.stand_side();
            }
            break;
    }
}

function draw_background(cur_map){
    switch (cur_map){
        case MAP_WINDOW :
            draw_background_window();   break;
        case MAP_ROOM :
            draw_background_room();     break;
        case MAP_TOILET :
            draw_background_toilet();   break;
        case MAP_OUTSIDE :
            draw_background_outside();  break;
        case MAP_ENDING :
            draw_gameover();            break;
        case MAP_TRUE_ENDING :
            draw_ending();              break;
    }
}

function draw_background_window(){ 
    if (transition_frame > TRANSITION_TIME / 2){
        main_c.x = 1062;
        main_c.y = 913;
        main_c.state = STATE_STAND_FRONT;
        main_c.block = true;
    }

    push();
    noStroke();
    /* draw background - sky */
    fill( 50, 127, 249); //sky blue
    rect(0, 0, screenWidth/3, screenHeight);

    let opacity = map(time, TIME_PER_DAY*1/4, TIME_PER_DAY*2/4, 0, 50);
    fill(255, 255, 255, opacity);
    rect(0, 0, screenWidth/3, screenHeight);

    let sunset = map(time, TIME_PER_DAY*2/4, TIME_PER_DAY*5/8, 0, 255);
    fill(233, 80, 39, sunset); //sunset
    rect(0, 0, screenWidth/3, screenHeight);
    
    let night = map(time, TIME_PER_DAY*5/8, TIME_PER_DAY*7/8, 0, 255);
    fill( 48,  15,  74, night); //night sky
    rect(0, 0, screenWidth/3, screenHeight);

    pop();

    image(bg_yellow, 0, 0, screenWidth, screenHeight);
    image(bg_map[MAP_ROOM], 220, 50, screenWidth, screenHeight);
    main_c.action();
    draw_neighbor(MAP_WINDOW);
    image(bg_map[MAP_WINDOW], 0, 0, screenWidth, screenHeight);
    if (main_c.state == STATE_SMOKE) main_c.smoke(direction);
    image(bg_button, 0, 0, screenWidth, screenHeight);
}

function draw_background_room(){
    if (transition_frame > TRANSITION_TIME / 2){
        if (transition_from == MAP_WINDOW) {
            main_c.x = 900;
            main_c.y = 845;
            main_c.state = STATE_STAND_FRONT;
        }
        if (transition_from == MAP_TOILET) {
            main_c.x = 1037;
            main_c.y = 845;
            main_c.state = STATE_STAND_SIDE;
        }
        if (transition_from == MAP_OUTSIDE) {
            main_c.x = 782;
            main_c.y = 845;
            main_c.state = STATE_STAND_FRONT;
        }
        main_c.block = false;
    }
    
    push();
    image(bg_map[MAP_ROOM], 0, 0, screenWidth, screenHeight);
    pop();

    image(bg_chair, 200, 605);
    draw_clock(553, 492, time, TIME_PER_DAY);
    main_c.action();
    draw_neighbor(MAP_ROOM);
    image(bg_desk, 25, 607);
    image(bg_map[MAP_ROOM + 2], 0, 0, screenWidth, screenHeight);
}

function draw_background_toilet(){
    if (transition_frame > TRANSITION_TIME / 2){
        main_c.x = 700;
        main_c.y = 845;   
        main_c.block = false;
    }
    push();
    image(bg_map[MAP_TOILET], 0, 0, screenWidth, screenHeight);
    main_c.action();
    image(bg_map[MAP_TOILET + 2], 0, 0, screenWidth, screenHeight);
    pop();
    image(bg_button, 0, 0, screenWidth, screenHeight);
}

function draw_background_outside(){ 
    if (transition_frame > TRANSITION_TIME / 2){
        main_c.x = 0;
        main_c.y = 0;
        main_c.state = STATE_STAND_FRONT;
        main_c.block = false;
    }

    push();
    noStroke();
    /* draw background - sky */
    fill( 50, 127, 249); //sky blue
    rect(0, 0, screenWidth/3, screenHeight);

    let opacity = map(time, TIME_PER_DAY*1/4, TIME_PER_DAY*2/4, 0, 50);
    fill(255, 255, 255, opacity);
    rect(0, 0, screenWidth/3, screenHeight);

    let sunset = map(time, TIME_PER_DAY*2/4, TIME_PER_DAY*5/8, 0, 255);
    fill(233, 80, 39, sunset); //sunset
    rect(0, 0, screenWidth/3, screenHeight);
    
    let night = map(time, TIME_PER_DAY*5/8, TIME_PER_DAY*7/8, 0, 255);
    fill( 48,  15,  74, night); //night sky
    rect(0, 0, screenWidth/3, screenHeight);

    pop();
    
    image(bg_yellow, 0, 0, screenWidth, screenHeight);
    
    image(bg_map[MAP_ROOM], 220, 50, screenWidth, screenHeight);
    draw_neighbor(MAP_OUTSIDE);
    image(bg_map[MAP_WINDOW], 0, 0, screenWidth, screenHeight);

    push();
    scale(3.5, 3.5);
    translate(50, 550);
    main_c.action();
    pop();

    image(bg_button, 0, 0, screenWidth, screenHeight);
}

function draw_gameover(){
    fill(0, 0, 0);
    rect(0, 0, screenWidth, screenHeight);

    fill(255, 255, 255);
    textAlign(CENTER, CENTER);
    textFont(fonts);

    switch(ending_code){
        case 0 :
            textSize(20);
            text("[00] SURRENDER", 600, 600);
            textSize(15);
            text("You gave up your assignment because of too much stress.", 600, 650);
            break;
        case 1 : 
            textSize(20);
            text("[01] TIME OVER", 600, 600);
            textSize(15);
            text("You failed to finish your assignment on time.", 600, 650);
            break;
        case 2 :
            textSize(25);
            text("CONGRATULATIONS!", 600, 600);
            textSize(20);
            text("You finished your assignment on time!", 600, 650);
            ending_frame++;
            if (ending_frame == 300){
                print(ending_frame);
                transition_frame = 1;
                transition_from = MAP_ENDING;
                transition_to = MAP_TRUE_ENDING;
                wait = 0;
                transition(MAP_ENDING, MAP_TRUE_ENDING, 0);
            }
            break;
    }
}

function draw_ending() {
    //neighbor_flag = true;
    neighbor_state = NEIGHBOR_SIT; 

    push();
    translate(146, 216);
    image(bg_map[MAP_ROOM], 0, 0);
    draw_neighbor(MAP_ROOM);
    pop();

    fill(0);
    rect(1063, 202, screenWidth - 1063, screenHeight - 202);
    rect(138, 626, screenWidth - 138, screenHeight - 626);

    if (neighbor_health <= 0){
        fill(255);
        textAlign(CENTER, CENTER);
        textFont(fonts);
        textSize(20);
        text("But, Aren't you forgetting something?", 600, 690);
    }
    else {
        fill(255);
        textAlign(CENTER, CENTER);
        textFont(fonts);
        textSize(20);
        text("Are you Good Student? Are you Good eighbor?", 600, 690);
    }
}
/* ==================================
 * draw state bar on position x, y
 * ================================== */
function draw_statebar(x, y){
    push();
    translate(x, y);

    /* draw stress bar */
    textSize(13);
    textFont(fonts);
    textAlign(RIGHT, CENTER);
    noStroke();
    fill(bar_color);
    text("STRESS", 0, 22.5, 100);
    
    stroke(bar_color);
    noFill();
    rect(100, 15, 100, 15);
    
    fill(bar_color);
    rect(100, 15, stress_value, 15);

    /* draw work bar */
    textSize(13);
    textFont(fonts);
    textAlign(RIGHT, CENTER);
    noStroke();
    fill(bar_color);
    text("WORK", 0, 22.5 + 25, 100);
    
    stroke(bar_color);
    noFill();
    rect(100, 15 + 25, 100, 15);
    
    fill(bar_color);
    rect(100, 15 + 25, work_value, 15);
    pop();
}

function transition(from, to, wait){
    var action_frame;
    main_c.block = true;
    
    if (transition_frame < TRANSITION_TIME / 3){
        wait_frame = 0;
        draw_background(from);
        push();
        let opacity = transition_frame / (TRANSITION_TIME / 3) * 255;
        fill(0, 0, 0, opacity);
        rect(0, 0, screenWidth, screenHeight);
        pop();
    }
    else if (transition_frame == TRANSITION_TIME / 3){
        if (random(0, 10) >= 2){
            neighbor_state = parseInt(random(0, 3));
        }
    }
    else if (transition_frame > TRANSITION_TIME / 3 && transition_frame < TRANSITION_TIME * 2 / 3){
        fill(0, 0, 0);
        rect(0, 0, screenWidth, screenHeight);
    }
    else if (transition_frame == TRANSITION_TIME * 2 / 3){
        if (wait > wait_frame){
            wait_frame++;
            transition_frame--;
        }
        if(neighbor_health <= 0){
            neighbor_flag = false;
        }
        ending_frame = 0;
    }
    else{
        cur_map = to;
        action_frame = transition_frame - TRANSITION_TIME * 2 / 3;
        draw_background(to);
        push();
        let opacity = 255 - (255 * (action_frame / (TRANSITION_TIME/3)));
        fill(0, 0, 0, opacity);
        rect(0, 0, screenWidth, screenHeight);
        pop();
    }

    transition_frame++;

    if (transition_frame == TRANSITION_TIME){
        transition_frame = 0;
        main_c.block = false;
    }
}

function mouseClicked(){
    print(mouseX + ', ' + mouseY);
    if (!game_start && game_prepare == 1){
        if (mouseX > 68 && mouseX < 413 && mouseY < 475 && mouseY > 428){
            game_start = true;
            game_prepare = 0;
        }
        else if (mouseX > 68 && mouseX < 478 && mouseY < 533 && mouseY > 486){
            game_prepare = 2;
        }
    }
    if (!game_start && game_prepare == 2){
        if (mouseX > 754 && mouseX < 1144 && mouseY > 767 && mouseY < 818){
            game_prepare = 0;
            game_start = true;
        }
    }
}

function draw_clock(x, y, cur, total){
    push()
    noFill();
    stroke(0);
    strokeWeight(2);
    translate(x, y);
    rotate(5 / 2 * PI * cur / total);
    line(0, 0, -25, 0);
    pop();

    push();
    noFill();
    stroke(0);
    strokeWeight(1);
    translate(x, y);
    rotate(2 * PI * 15 * cur / total);
    line(0, 0, 0, -30);
    pop();
}

function draw_neighbor(map){
    push();
    if (!neighbor_flag){
        pop();
        return;
    }
    switch(neighbor_state){
        case NEIGHBOR_SIT :
            if (map == MAP_WINDOW || map == MAP_OUTSIDE){
                image(pg_neighbor[NEIGHBOR_SIT], 189 + 220, 80 + 50, 294, 288);
                tint(255, (100 - neighbor_health) / 100 * 255);
                image(pg_neighbor[NEIGHBOR_SIT + 2], 189 + 220, 80 + 50, 294, 288);
            }
            else if (map == MAP_ROOM){
                image(pg_neighbor[NEIGHBOR_SIT], 189, 80, 294, 288);
                tint(255, (100 - neighbor_health) / 100 * 255);
                image(pg_neighbor[NEIGHBOR_SIT + 2], 189, 80, 294, 288);
            }
            break;
        case NEIGHBOR_STAND :
            if (map == MAP_WINDOW || map == MAP_OUTSIDE){
                image(pg_neighbor[NEIGHBOR_STAND], 481 + 220, -15 + 50, 233, 394);
                tint(255, (100 - neighbor_health) / 100 * 255);
                image(pg_neighbor[NEIGHBOR_STAND + 2], 481 + 220, -15 + 50, 233, 394);
            }
            else if (map == MAP_ROOM){
                image(pg_neighbor[NEIGHBOR_STAND], 481, -15, 233, 394);
                tint(255, (100 - neighbor_health) / 100 * 255);
                image(pg_neighbor[NEIGHBOR_STAND + 2], 481, -15, 233, 394);
            }
            break;
        case NEIGHBOR_WINDOW :
            if (map == MAP_WINDOW || map == MAP_OUTSIDE){
                image(pg_neighbor[NEIGHBOR_STAND], 269 + 220, -15 + 50, 233, 394);
                tint(255, (100 - neighbor_health) / 100 * 255);
                image(pg_neighbor[NEIGHBOR_STAND + 2], 269 + 220, -15 + 50, 233, 394);
            }
            else if (map == MAP_ROOM){
                image(pg_neighbor[NEIGHBOR_STAND], 269, -15, 233, 394);
                tint(255, (100 - neighbor_health) / 100 * 255);
                image(pg_neighbor[NEIGHBOR_STAND + 2], 269, -15, 233, 394);
            }
            break;
    }
    pop();
}