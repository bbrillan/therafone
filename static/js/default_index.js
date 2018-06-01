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
    },

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
            button_toggle_public: self.button_toggle_public
        }

    });

    self.get_memos();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
