/*!
 * ParaBox.js
 * ----------
 * @version 0.9.0
 * @author mach3 <http://github.com/mach3>
 * @license MIT License
 * @url http://github.com/mach3/parabox.js
 * @require jQuery
 */
(function($){

	/**
	 * ParaBox
	 * -------
	 * Collection of tools for parallax page
	 */
	$.ParaBox = {};

	/**
	 * Background parallax
	 * -------------------
	 */
	$.ParaBox.background = {

		/**
		 * Defaults for options:
		 * - bgHeight:Integer = Background images's height
		 * - area:Integer = Area which background moves, margin from offset top of element
		 * - reverse:Boolean = Move background reversely or not
		 */
		defaults: {
			bgHeight: 480,
			area: 240,
			reverse: true
		},

		/**
		 * Initialize background parallax
		 * @param jQueryObject nodes
		 * @param Object options
		 */
		initialize: function(nodes, options){
			var my = this;
			options = $.extend({}, this.defaults, options);
			nodes.each(function(){
				var node, attrs;
				node = $(this);
				attrs = {
					reverse : options.reverse,
					height : node.prop("clientHeight"),
					left : $.ParaBox.util.getLeft(node),
					offset : node.offset().top,
					area : options.area
				};
				attrs.margin = options.bgHeight - attrs.height;
				node.data("paraBoxAttrs", attrs);
				$(window).on("scroll", $.proxy(my.onScroll, node));
			});
		},

		/**
		 * Hanlder for window scrolls
		 * `this` is assigned as the each node (jQueryObject)
		 * Background moves its position for scrolling
		 */
		onScroll: function(){
			var attrs, diff, top;
			attrs = this.data("paraBoxAttrs");
			diff = $(window).scrollTop() - attrs.offset;
			if(Math.abs(diff) < attrs.area){
				top = attrs.reverse ? ((diff + attrs.area) / (attrs.area * 2) * attrs.margin * -1) + "px"
				: ((1 - (diff + attrs.area) / (attrs.area * 2)) * attrs.margin * -1) + "px";
			} else if(attrs.reverse) {
				top = diff < 0 ? "top" : "bottom";
			} else {
				top = diff < 0 ? "bottom": "top";
			}
			this.css("background-position", [attrs.left, top].join(" ") );
		}

	};

	/**
	 * Item parallax
	 * -------------
	 */
	$.ParaBox.item = {

		/**
		 * Defaults for options:
		 * - top:Integer = Top align for the area which activates the item
		 * - bottom:Integer = Bottom align for the area which activates the item
		 * - easing:String = Easing function's name for animation
		 * - duration:Integer = Duration time for animation
		 * - from:Object = CSS when deactivated
		 * - to:Object = CSS when activated
		 */
		defaults: {
			top: null,
			bottom: null,
			easing: "swing",
			duration: 500,
			from: {},
			to: {}
		},

		/**
		 * Initialize item parallax
		 * @param jQueryObject nodes
		 * @param Object options
		 */
		initialize: function(nodes, options){
			var my = this;
			options = $.extend(true, {}, this.defaults, options);
			if(! options.bottom){
				options.bottom = $("body").height();
			}
			nodes.each(function(){
				var node, attrs;
				node = $(this);
				attrs = {
					easing: options.easing,
					duration: options.duration,
					top: options.top,
					bottom: options.bottom,
					from: options.from,
					to: options.to
				};
				node.data("paraBoxAttrs", attrs);
				node.data("paraBoxShow", false);
				node.css(attrs.from);
				$(window).on("scroll", $.proxy(my.onScroll, node));
			});
		},

		/**
		 * Handler for window scrolls
		 * `this` is assigned as the each node (jQueryObject)
		 * The node animates to from/to styles when the activated status changes
		 */
		onScroll: function(){
			var scroll, attrs, show, inRange;
			scroll = $(window).scrollTop();
			attrs = this.data("paraBoxAttrs");
			show = this.data("paraBoxShow");
			inRange = $.ParaBox.util.inRange(scroll, attrs.top, attrs.bottom);
			if((show && ! inRange) || (! show && inRange)){
				this.stop().animate(show ? attrs.from : attrs.to, {
					easing: attrs.easing,
					duration: attrs.duration
				});
				this.data("paraBoxShow", ! show);
			}
		}
	};

	/**
	 * sectionChange Event
	 * -------------------
	 */
	$.ParaBox.section = {

		/**
		 * Attributes:
		 * - node:jQueryObject = The node which trigger the event
		 * - points:Array = Collection of section name and its scroll top
		 * - index:Integer = Section index which is activated now
		 */
		node: null,
		points: null,
		index: null,

		/**
		 * Initialize sections and add handler
		 * `options` is object which contains labeled align, like `{name: align}`
		 * @param jQueryObject node
		 * @param Object options
		 */
		initialize: function(node, options){
			var points = [];
			$.each(options, function(name, value){
				points.push({
					name: name,
					value: value
				});
			});
			points.sort(function(a, b){
				return a.value - b.value;
			});
			this.points = points;
			this.node = node;
			$(window).on("scroll", $.proxy(this.onScroll, this));
		},

		/**
		 * Hanlder for window scrolls
		 * `this` is assigned as $.ParaBox.section
		 * When scroll top leap over some section's, 
		 * this trigger "sectionChange" event on `this.node`
		 */
		onScroll: function(){
			var i, scroll, point, data;
			scroll = $(window).scrollTop();
			i = this.points.length;
			while(i--){
				if(this.points[i].value < scroll){ break; }
			}
			if(i !== this.index){
				point = this.points[i];
				data = {
					index: i,
					name: point ? point.name : null,
					value: point ? point.value : null ,
					instance: this
				};
				this.node.trigger("sectionChange", data, this);
				this.index = i;
			}
		}
	};

	/**
	 * Utilities 
	 * ---------
	 */
	$.ParaBox.util = {

		/**
		 * Returns whether `num` is in the range `min` to `max`
		 * @param Number num
		 * @param Number min
		 * @param Number max
		 */
		inRange: function(num, min, max){
			return num >= min && num < max;
		},

		/**
		 * Helper to get left position of background image
		 * @param jQueryObject node
		 */
		getLeft: function(node){
			return node.css("background-position-x")
			|| node.css("background-position").split(" ")[0];
		}

	};

	/**
	 * Interface as jQuery feature
	 */
	$.fn.parabox = function(/* action, arg1, arg2 ... */){
		var args, action, obj;
		args = $.makeArray(arguments);
		action = args.shift();
		obj = $.ParaBox[action];
		if(obj){
			args.unshift(this);
			obj.initialize.apply(obj, args);
		}
		return this;
	};

}(jQuery));
