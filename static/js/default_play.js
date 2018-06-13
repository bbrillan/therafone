
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

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

    self.insertion_id = null; // Initialization.


    //deals with all the timer functions
    self.bounce = function () {
        if (self.vue.is_playing) {


            var temparr = [];
            for (var i = 0; i <= self.vue.num_beats; i+= 1) {   //for every beat
                var hit = self.vue.speed * i;                          //the time stamp for every beat
                self.vue.time_stamps[i] = hit;
            //    console.log("time stamp: " + self.vue.time_stamps[i]);
            }

            var tempvar = 0;
            var counter = 0;
            document.onkeydown = function (event) {
                    self.vue.timerr = event.timeStamp/1000.0;
                    tempvar = event.timeStamp/1000.0;
                    console.log("hit time " + (self.vue.timerr));
                    temparr[counter] = tempvar;
                    counter += 1;
                    console.log("hit time arr: " + temparr);
            };

        }


        if (self.vue.is_playing && self.vue.is_restart) {
            self.vue.temp = event.timeStamp - event.timeStamp;
            self.vue.timerr = self.vue.temp + event.timeStamp;
            console.log(self.vue.temp +"timer" +  self.vue.timerr);

        }



    };


    self.play = function(bpm, duration) {
        self.vue.is_playing = true;
        self.vue.timerr = 0.0;
        self.bounce();

            var bps = bpm / 60; // setting beats per minute to beats per second
            self.vue.num_beats = bps * duration;
            self.vue.duration = duration;
            self.vue.speed = bps;

            var animation = document.getElementsByClassName('animated')[0];
            animation.style.setProperty("animation-iteration-count", self.vue.num_beats); // the ball will bounce num_beats times
            animation.style.setProperty("animation-duration", bps + "s");
            self.vue.more_buttons = true;
            animation.classList.add('animated');
            animation.style.animationPlayState = "running";




            //setting all the time stamps for the beats throughout the song.


    };

    self.pause = function() {
        self.vue.is_playing = false;
        var animation = document.getElementsByClassName('animated')[0];
        self.vue.more_buttons = true;
        animation.style.animationPlayState = "paused";
    };


    self.restart = function() {
            self.vue.is_playing = false;
            self.vue.is_restart = true;
            self.vue.hits = [];
            self.vue.time_stamps = [];
            self.vue.timerr = 0.0;
            self.play();
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
        self.vue.is_playing = false;
        console.log('ok');


        var play = document.getElementById('play');
        var pause = document.getElementById('pause');
        var restart = document.getElementById('restart');
        var dot = document.getElementById('dot');
        var animation = document.getElementsByClassName('animated')[0];

        };


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
            num_beats: 0.0,
            bpm: 0.0,
            show_balls: false, // boolean to display all the trailing balls
            stop_ball: false,
            show: true,
            more_buttons: true,
            is_playing: false,
            hits: [],
            time_stamps: [],
            percent_hit: 0.0,
            timerr: 0.0,

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