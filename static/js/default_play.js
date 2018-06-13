
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.get_liked_tracks = function(){
        $.getJSON(get_liked_tracks_url, function (data) {
            for(var i = 0; i<data.liked_tracks.length; i++){
                if(data.liked_tracks[i].liked_by == self.vue.current_user.id){
                    self.vue.liked_tracks.push(data.liked_tracks[i]);
                }
            enumerate(self.vue.liked_tracks);
            }
        });
    };

    self.get_current_user = function(){
      $.getJSON(
        my_user_url,
        function(data){
          console.log(data);
          self.vue.current_user = data.current_user;
          self.get_liked_tracks();
        }
      );
    };

    //helper function for bounce()
    self.up = function () {
        var num = $(".dot");
        num.slideUp(1000);
        console.log(num);
    };

    //helper function for bounce()
    self.down = function () {
        var num = $(".dot");
        num.slideDown(1000);
        console.log(num);

    };

    self.stop_bounce = function(duration) {
        console.log('stop?');
        self.vue.stop_ball = true;
        setTimeout(self.bounce, duration);
    };


    self.bounce = function (bpm, duration) {    // duration must be in seconds
        var bps = bpm / 60;                     // setting beats per minute to beats per second
        var num_beats = bps * duration;         // number of beats in the song
        console.log(num_beats);
        self.vue.show_balls = true;
        var btime = bps/2;                      //the time the ball will be traveling up or down.

        self.vue.show = false;


            for (var i = 0; i <= num_beats; i++) {   //for every beat
                console.log('in for loop1');
                var hit = bps * i;                    //the time stamp for every beat
                console.log(hit);
                for (var j = 0; j < bps; j++) { //what is going to happen for each beat; i.e. within each bounce
                    console.log('in for loop2');
                    if (j < btime) {
                        $(".dot").slideDown(bps * 1000);
                        console.log('going down');
                    } else {
                        $(".dot").slideUp(bps * 1000);
                        console.log('going up');
                    }
                }
                duration -=1;
                console.log(duration);
            } //end for num_beats

    };


    self.play = function() {
            var animation = document.getElementsByClassName('animated')[0];
            console.log('here?');
            self.vue.more_buttons = true;
            console.log($(".animated"));
            animation.classList.add('animated');
            animation.style.animationPlayState = "running";
    };


    self.start = function () {
        self.vue.show=true;
        self.vue.more_buttons=false;
        console.log('ok');


        var play = document.getElementById('play');
        var pause = document.getElementById('pause');
        var restart = document.getElementById('restart');
        var dot = document.getElementById('dot');


        var animation = document.getElementsByClassName('animated')[0];
        //'pressing play makes the ball bounce'//


        play.addEventListener('click', function(a) {
            a.preventDefault();
            self.vue.more_buttons = true;
            animation.classList.add('animated');
            animation.style.animationPlayState = "running";
        }, false);


        pause.addEventListener('click', function(a) {
            a.preventDefault();
            self.vue.more_buttons = true;
            animation.style.animationPlayState = "paused";
        }, false);


        restart.addEventListener('click', function(a) {
            a.preventDefault();
            self.vue.more_buttons = false;
            dot.classList.remove('animated');
            void dot.offsetWidth;
            animation.style.animationPlayState = "paused";
        }, false);


    };


     self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            liked_tracks: [],
            current_user: null,

            play_button: false,

            speed: 0.0,
            duration: 0.0,
            show_balls: false, // boolean to display all the trailing balls
            stop_ball: false,
            show: true,
            more_buttons: true,

            plays: document.getElementById('play'),
            pause: document.getElementById('pause'),
            restart: document.getElementById('restart'),
            dot: document.getElementById('dot'),

             animation: document.getElementsByClassName('animated')[0],
            //end activity page //
        },
        methods: {

            up: self.up,
            down:self.down,     //not needed? they are just helped functions ...

            bounce: self.bounce,
            stop_bounce: self.stop_bounce,

            start: self.start,

            play: self.play,

        },

    });

    self.get_current_user();
    self.start();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});