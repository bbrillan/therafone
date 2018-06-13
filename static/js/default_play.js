
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

<<<<<<< HEAD
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};
=======
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
>>>>>>> eb792922042f67b2054de2d5cb22230e56385d09

    self.insertion_id = null; // Initialization.


    self.bounce = function () {
        console.log('HI');

    };


    self.play = function(bpm, duration) {
        self.vue.is_playing = true;

            var bps = bpm / 60;                     // setting beats per minute to beats per second
            var num_beats = bps * duration;


            var animation = document.getElementsByClassName('animated')[0];
            animation.style.setProperty("animation-iteration-count", num_beats); // the ball will bounce

            animation.style.setProperty("animation-duration", 1 + "s");
            self.vue.more_buttons = true;
            animation.classList.add('animated');
            animation.style.animationPlayState = "running";



            //setting all the time stamps for the beats throughout the song.

            for (var i = 0; i <= num_beats; i++) {   //for every beat
                var hit = bps * i;                    //the time stamp for every beat
                duration -=1;
                self.vue.time_stamps[i] = hit;
                //console.log(duration);
            }

        var start_time = Date.now();
            var temp = 0;
        $(document).keypress(function(event){
            var counter = Date.now()-start_time;
            console.log(Math.floor(counter/1000.0));
            var yes = Math.floor(counter/1000.0);
            temp += 1;
            self.vue.hits[temp] = yes;
        });


    };

    self.pause = function() {
        self.vue.is_playing = true;
        var animation = document.getElementsByClassName('animated')[0];
        self.vue.more_buttons = true;
        animation.style.animationPlayState = "paused";
    };

    self.restart = function() {
            self.vue.is_playing = true;
            var dot = document.getElementById('dot');
            var animation = document.getElementsByClassName('animated')[0];
            self.vue.more_buttons = false;
            dot.classList.remove('animated');
            void dot.offsetWidth;
            animation.style.animationPlayState = "paused";
            dot.classList.add('animated');
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


        };


        //'pressing play makes the ball bounce'//

/*
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
*/


        self.select_track = function(track_idx) {
            var track = self.vue.tracks[track_idx];
            if (self.vue.selected_id === track.id) {
                // Deselect track.
                self.vue.selected_id = -1;
            } else {
                // Select it.
                self.vue.selected_idx = track_idx;
                self.vue.selected_id = track.id;
                self.vue.selected_url = track.track_url;
            }
            if (self.vue.selected_url && self.vue.selected_id > -1) {
                // We play the track.
                self.inc_play_track(track_idx);
            }
        };

        self.inc_play_track = function (track_idx) {
            var track = self.vue.tracks[track_idx];
            track.num_plays += 1;
            $.post(
                inc_plays_url,
                {track_id: track.id},
                function () {}
            )
        };

        function get_tracks_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
            return tracks_url + "&" + $.param(pp);
        }

        self.get_tracks = function () {
            $.getJSON(get_tracks_url(0, 10), function (data) {
                self.vue.tracks = data.tracks;
                self.vue.has_more = data.has_more;
                self.vue.logged_in = data.logged_in;
                enumerate(self.vue.tracks);
            })
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
            is_playing: false,
            hits: [],
            time_stamps: [],
            percent_hit: 0.0,

            plays: document.getElementById('play'),
            pause: document.getElementById('pause'),
            restart: document.getElementById('restart'),
            dot: document.getElementById('dot'),
            animation: document.getElementsByClassName('animated')[0],
            //end activity page //


            selected_id: -1,
            tracks: [],
            logged_in: false,
            has_more: false,


        },
        methods: {

            up: self.up,
            down:self.down,     //not needed? they are just helped functions ...

            bounce: self.bounce,
            stop_bounce: self.stop_bounce,

            start: self.start,

            play: self.play,
            pause: self.pause,
            restart: self.restart,


            select_track: self.select_track,
            inc_play_track: self.inc_play_track,
            get_tracks: self.get_tracks,

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