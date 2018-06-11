// Fall 2016 Assignment 3 Sample Solution used as reference
// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };



    /* Accessors */

    //Get Memos
    self.get_memos = function () {
        $.getJSON(memos_url, function (data) {
            self.vue.memos = data.memos;
        })
    };



    /*  Buttons */

    //New Button
    self.button_new = function(){
        self.vue.is_adding = true;
        self.vue.form_title = "";
        self.vue.form_content = "";
    },

    //Cancel New Button
    self.button_cancel_new = function(){
        self.vue.is_adding = false;
    },

    //Create New Button
    self.button_create_new = function(){
        $.post(add_memo_url,
            {
                title: self.vue.form_title,
                memo: self.vue.form_content
            },
            function (data) {
                $.web2py.enableElement($("#button_create_new"));
                self.vue.memos.unshift(data.memo);
                self.vue.is_adding = false;
                self.vue.form_title = "";
                self.vue.form_content = "";
            });
    },

    //Edit Button
    self.button_edit = function(memo_id){
        self.vue.is_being_edited = true;
        self.vue.edit_id = memo_id;
    };

    //Cancel Edit Button
    self.button_cancel_edit = function(){
        self.vue.is_being_edited = false;
        self.vue.edit_id = 0;
    };

    //Save Edit Button
    self.button_save_edit = function(){
        $.post(edit_memo_url,
            {
                title: self.vue.edit_title,
                memo: self.vue.edit_content,
                id: self.vue.edit_id
            },
            function (data) {
                $.web2py.enableElement($("#button_save_edit"));
                self.vue.is_being_edited = false;
            });
    },

    //Delete Button
    self.button_delete = function(memo_id) {
        $.post(del_memo_url,
            {
                memo_id: memo_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.memos.length; i++) {
                    if (self.vue.memos[i].id === memo_id) {
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.memos.splice(idx - 1, 1);
                }
            }
        )
    };

    //Toggle Public Button
    self.button_toggle_public = function(memo_id){
        $.post(toggle_public_url,
            {
                memo_id: memo_id
            },
        )
    };


    //******* Any functions for the activity page ***** //

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

  /*
        for (i=0; i < 400; i--){
            $(".dot").postion += 1;
        }
*/


     //   if (self.vue.duration >0) {
     //       self.vue.pos -= 1;
     //   }
     //   else {
      //      self.vue.pos = position;
      //  }
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
        //    $(".animated").animate('bounce-in', '2s', 'infinite');

          //  animateDuration(2);


   //             animationDuration: 1,
    //            animationIterationCount: 3
     //       }, "slow");

            console.log('here?');

         //   animation.css('animation-duration', 3);
            self.vue.more_buttons = true;
            console.log($(".animated"));
            animation.classList.add('animated');
            animation.style.animationPlayState = "running";
    };


    self.start = function () {
        self.vue.show=true;
        self.vue.more_buttons=false;
        console.log('ok');

    //    self.vue.plays.addEventListener('click', self.play, true);

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





    //**************** End game functions **************//


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            memos: [],
            is_adding: false,
            is_being_edited: false,
            form_title: null,
            form_content: null,
            edit_title: null,
            edit_content: null,
            edit_id: 0,

            //for activity page //

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
            get_memos_url: self.get_memos_url,
            get_memos: self.get_memos,
            button_new: self.button_new,
            button_cancel_new: self.button_cancel_new,
            button_create_new: self.button_create_new,
            button_edit: self.button_edit,
            button_cancel_edit: self.button_cancel_edit,
            button_save_edit: self.button_save_edit,
            button_delete: self.button_delete,
            button_toggle_public: self.button_toggle_public,

            //for activity page //
            up: self.up,
            down:self.down,     //not needed? they are just helped functions ...

            bounce: self.bounce,
            stop_bounce: self.stop_bounce,

            start: self.start,

            play: self.play,


            //end activity page //
        },

    });

    self.start();
    self.get_memos();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});



// $dot.add("click", function() {

      //  })

        //        self.vue.dot.classList.add('animated');



      /*  $('.dot:eq(1)').on('click', function () {
            self.vue.dot.addClass('dot');
        */


    /*
    self.bounce = function() {
        for (var i = 0; i < self.vue.angles.length; i++){
            self.vue.angle=self.vue.angles[i];

            self.vue.x = self.vue.cx + self.vue.radius * Math.cos(self.vue.angle*self.vue.deg2rad);
            self.vue.y = self.vue.cy + self.vue.radius * Math.sin(self.vue.angle*self.vue.deg2rad);

            $("#ball" + i).css({left:self.vue.x - self.vue.radius/2, top:self.vue.y - self.vue.radius/2});

            self.vue.angles[i] = self.vue.angles[i] + 1;
            if (self.vue.angles[i] > 360){
                self.vue.angles[i] = 0;  //resetting the angle to 0 at complete circle
            }


        }
    };


    self.bounce = function() {
        self.vue.is_showing = !self.vue.is_showing;
        console.log(self.vue.is_showing);
    };

    const Child = {
        template: '#childarea'

    };


    self.up_or_down = function (position) {
        for (i = 0; i < $(".game_container").height/2; i++) {
            if (self.vue.pos = $(".game_container").height/2) {
                self.vue.pos -= 1;
            } else if (self.vue.pos = 0){
                self.vue.pos += 1;
            } else {
                self.vue.pos = i;
            }

        }



            if (self.vue.pos = $(".game_container").height/2) {
                self.vue.pos -= 1;
            } else if (self.vue.pos = 0) {
                self.vue.pos += 1;
            }
    };


    self.bounce = function() {
        if (self.vue.duration > 0) {
            if (self.vue.pos > $(".dot").position) {
                self.vue.pos = $(".dot").position;
            }
             else if (self.vue.pos < $(".game_container").height/2) {

            }

        }

    };



    */