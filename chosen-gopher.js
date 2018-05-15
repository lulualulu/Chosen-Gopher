/*!
Gopher, a Plugnin for jQuery-Chosen
by Psyduck http://lulualulu.com
Version 1.0.0

Full source at https://github.com/lulualulu/Chosen-Gopher
Copyright (c) 2018 Psyduck http://lulualulu.com

MIT License, https://github.com/lulualulu/Chosen-Gopher/blob/master/license.md
*/


(function ($) {
	var $, Gopher,
		bind = function (fn, me) {
			return function () {
				return fn.apply(me, arguments);
			};
		},
		extend = function (child, parent) {
			for (var key in parent) {
				if (hasProp.call(parent, key)) child[key] = parent[key];
			}

			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		},
		hasProp = {}.hasOwnProperty;

	Gopher = (function () {
		function Gopher(form_field, options) {
			this.form_field = form_field;
			this.options = options != null ? options : {};

			this.set_default_values();
			this.setup();
			this.set_up_html();
			this.set_up_attr();
			this.set_selected();
			this.register_observers();
			this.register_class();

			this.on_ready();
			console.log('Gopher Done');
		}
		//Set option values
		Gopher.prototype.set_selected = function () {
			if (this.clean_select) {
				$(this.form_field_jq).html('');
			} else {
				if (this.form_field_jq.text()) {
					this.trigger_input.val(this.form_field_jq.text());
				}
			}
			return;
		};

		//Set option values
		Gopher.prototype.set_default_values = function () {
			this.main_select = null;
			if (typeof this.options.main_select !== 'undefined') {
				this.main_select = this.options.main_select;
			} else {
				throw "selection source not find!";
			}
			this.default_msg = null;
			if (typeof this.options.default_msg !== 'undefined') {
				this.default_msg = this.options.default_msg;
			}
			this.clean_select = false;
			if (typeof this.options.clean_select !== 'undefined') {
				this.clean_select = this.options.clean_select;
			}
			this.inherit_select_classes = false;
			if (typeof this.options.inherit_select_classes !== 'undefined') {
				this.inherit_select_classes = this.options.inherit_select_classes;
			}
			this.input_class = null;
			if (typeof this.options.input_class !== 'undefined') {
				this.input_class = this.options.input_class;
			}
			return;
		};
		//Get container width
		Gopher.prototype.container_width = function () {
			if (this.options.width != null) {
				return this.options.width;
			} else {
				//todo fix if form_field display = none
				if (false) {
					return $(this.form_field).width(); + "px";
				}
				return this.form_field.offsetWidth + "px";
			}
		};
		//Setup up for option.
		Gopher.prototype.setup = function () {
			this.form_field_jq = $(this.form_field);
			return;
		};
		//Setup up for html.
		Gopher.prototype.set_up_html = function () {
			var container_classes, container_props;
			container_classes = ["gopherSelect-container"];
			//var someClass = "ClassName";
			//container_classes.push("gopherSelect-container-" + someClass);

			if (this.inherit_select_classes && this.form_field.className) {
				container_classes.push(this.form_field.className);
			}
			container_props = {
				'class': container_classes.join(' '),
				'title': this.form_field.title
			};

			if (this.form_field.id.length) {
				this.mainId = this.form_field.id.replace(/[^\w]/g, '_') + "_gopher_select";
				container_props.id = this.mainId;
			}
			this.container = $("<div />", container_props);
			this.container.width(this.container_width());
			this.container.css('display', 'inline-block');
			this.container.html(this.get_trigger_input_html());

			this.form_field_jq.hide().after(this.container);

			this.trigger_input = this.container.find('input.gopherSelect-trigger-input').first();
			this.main_chosen = document.getElementById(this.main_select.id + '_chosen');

			return;
		};
		//Set attribute
		Gopher.prototype.set_up_attr = function () {
			$(this.trigger_input)[0].setAttribute("tabIndex", this.form_field.tabIndex);
			$(this.main_chosen).find('.chosen-focus-input')[0].removeAttribute("tabIndex");
		};
		//Triggered after Gopher has been fully instantiated.
		Gopher.prototype.on_ready = function () {
			return this.form_field_jq.trigger("gopher:ready", {
				gopher: this
			});
			//Example:
			//$('.my_select').on('gopher:ready', function (evt, params) {
			//    do_something(evt, params);
			//});
		};
		//Get trigger button html
		Gopher.prototype.get_trigger_input_html = function () {
			var input = document.createElement("input");
			input.type = "text";
			var className = "gopherSelect-trigger-input ";
			if (this.input_class) {
				className += this.input_class;
			}
			input.className = className;
			if (this.default_msg) {
				input.placeholder = this.default_msg;
			}
			input.readOnly = true;
			return input.outerHTML;
		};
		//Observers source select change
		Gopher.prototype.select_change = function (event) {
			if (!$(this.trigger_input).hasClass('gopher-active-input')) {
				return;
			}
			console.log("gopher change");
			$('.gopher-active-input').removeClass('gopher-active-input');
			var value = $(this.main_select).val();
			var text = $(this.main_select).find("option:selected").text();

			$(this.form_field).html(new Option(text, value, false, false).outerHTML);

			$(this.trigger_input).val(text);
			if ($(this.trigger_input).hasClass('gopher-focus-back')) {
				console.log('gopher focus back');
				$(this.trigger_input).focus();
			}
			$(this.main_select).val(-1);
			$(this.main_select).trigger('chosen:close');
			$(this.form_field).change();
		};
		//Observers chosen input focus
		Gopher.prototype.jump_from_chosen = function (event) {
			if (!$(this.trigger_input).hasClass('gopher-active-input')) {
				return;
			}
			console.log("gopher jump");
			$('.gopher-active-input').removeClass('gopher-active-input');
			$(this.trigger_input).focus();
			$(this.main_select).trigger('chosen:close');
			return;
		};

		//Focus Gopher
		Gopher.prototype.input_on_focus = function (event) {
			console.log("gopher focus");
			//if focus again, keep focus and do not thing
			if ($(this.trigger_input).hasClass('gopher-focus-back')) {
				$('.gopher-focus-back').removeClass('gopher-focus-back');
				console.log("gopher focus pass focus");
				return;
			}
			this.set_focus_tag();
			this.pop_chosen();
		};
		//Mousedown Gopher
		Gopher.prototype.input_on_mousedown = function (event) {
			console.log("gopher click");
			this.set_focus_tag();
			this.pop_chosen();
			return;
		};
		//Up
		Gopher.prototype.keyup_arrow = function () {
			console.log("gopher arrow");
			this.set_focus_tag();
			this.pop_chosen();
			return;
		};
		//Down
		Gopher.prototype.keydown_arrow = function () {
			console.log("gopher arrow");
			this.set_focus_tag();
			this.pop_chosen();
			return;
		};
		//Pop 
		Gopher.prototype.pop_chosen = function (event) {
			console.log("gopher pop");
			this.set_tag();

			this.move_chosen();
		};

		//Move chosen on window
		Gopher.prototype.move_chosen = function () {
			var target = this.trigger_input;
			var val = this.form_field_jq.val();
			$(this.main_select).val(val);
			var rect = target[0].getBoundingClientRect();
			var top = rect.top;
			var right = rect.right;
			var bottom = rect.bottom;
			var left = rect.left;
			var scrollTop = window.scrollY;
			var scrollLeft = window.scrollX;
			var documentTop = top + scrollTop;
			var documentLeft = left + scrollLeft;
			$(this.main_select).trigger('chosen:updated');
			$(this.main_select).trigger('chosen:open');
			this.main_chosen.style.position = "absolute";
			this.main_chosen.style.top = documentTop + 'px';
			this.main_chosen.style.left = documentLeft + 'px';
		};
		//Register class
		Gopher.prototype.register_class = function () {
			$(this.main_chosen).addClass('gopher-chosen');
		};
		//Register event
		Gopher.prototype.register_observers = function () {
			var transfer_value;
			$(this.trigger_input).on('focus.gopher', (function (_this) {
				return function (evt) {
					_this.input_on_focus(evt);
				};
			})(this));
			$(this.trigger_input).on('mousedown.gopher', (function (_this) {
				return function (evt) {
					evt.preventDefault();
					_this.input_on_mousedown(evt);
				};
			})(this));
			$(this.trigger_input).on('keydown.gopher', (function (_this) {
				return function (evt) {
					_this.keydown_checker(evt);
				};
			})(this));
			$(this.main_select).on('change.gopher', (function (_this) {
				return function (evt) {
					_this.select_change(evt);
				};
			})(this));

			$(this.main_chosen).on('focusout.gopher', (function (_this) {
				return function (evt) {
					console.log('chosen focusout');
					//_this.go_back_focus();
				};
			})(this));
			$(this.main_chosen).on('click.gopher', (function (_this) {
				return function (evt) {
					//console.log('Chosen Click');
				};
			})(this));
			$(this.main_chosen).find('.chosen-focus-input').on('focus.gopher', (function (_this) {
				return function (evt) {
					//console.log('Chosen focus');
					//When chosen focus on mine input,
					//trigger maiin select change event
					_this.jump_from_chosen(evt);
				};
			})(this));
			this.form_field_jq.on("gopher:set.gopher", (function (_this) {
				return function (evt, val) {
					_this.set_value(evt, val);
				};
			})(this));
		};

		Gopher.prototype.keydown_checker = function (evt) {
			var ref, stroke;
			stroke = (ref = evt.which) != null ? ref : evt.keyCode;
			switch (stroke) {

				case 8: //backspace
				case 9: //tab
				case 13: //enter
				case 27: //esc
				case 32: //space
					break;
				case 38: //up arrow
					evt.preventDefault();
					this.keyup_arrow();
					break;
				case 40: //down arrow
					evt.preventDefault();
					this.keydown_arrow();
					break;
			}
		};
		Gopher.prototype.set_value = function (event, val) {
			this.set_tag();
			$(this.main_select).val(val);
			$(this.main_select).change();
		};

		Gopher.prototype.set_tag = function () {
			$('.gopher-active-input').removeClass('gopher-active-input');
			$(this.trigger_input).addClass('gopher-active-input');
		};
		Gopher.prototype.set_focus_tag = function () {
			$('.gopher-active-input').removeClass('gopher-focus-back');
			$(this.trigger_input).addClass('gopher-focus-back');
		};

		//Destory Gopher
		Gopher.prototype.destroy = function () {
			this.container.remove();
			this.form_field_jq.show();
			this.form_field_jq.removeData('gopher');
			return;
		};

		//Check browser
		Gopher.browser_is_supported = function () {
			if ("Microsoft Internet Explorer" === window.navigator.appName) {
				return document.documentMode >= 8;
			}
			if (/iP(od|hone)/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) || /BB10/i.test(window.navigator.userAgent) || /Android.*Mobile/i.test(window.navigator.userAgent)) {
				return false;
			}
			return true;
		};

		return Gopher;
	})();

	$ = jQuery;

	$.fn.extend({
		gopher: function (options) {
			if (!Gopher.browser_is_supported()) {
				return this;
			}
			return this.each(function (input_field) {
				var $this, gopher;
				$this = $(this);
				gopher = $this.data('gopher');
				if (options === 'destroy') {
					if (gopher instanceof Gopher) {
						gopher.destroy();
					}
					return;
				}
				if (!(gopher instanceof Gopher)) {
					$this.data('gopher', new Gopher(this, options));
				}
			});
		}
	});

})(jQuery);