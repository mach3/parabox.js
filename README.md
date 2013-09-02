
# ParaBox.js

Toolbox for parallax web page.

## Features

- Background Image Parallax
- Item Position Parallax
- Define sections and trigger "sectionChange" event

## Usage

Basically, pass action's name and extra arguments to $.fn.parabox()

```javascript
$(/* some element */).parabox( action, options );
```

### Background

Update background image's top position for scrolling.

```javascript
$(".element-which-has-background").parabox("background", {
	bgHeight: 480,
	area: 240,
	reverse: true 
});
```

- bgHeight:Integer (480) : Background image height
- area:Integer (240) : Area which background animate (distance to offset top of its node)
- reverse:Boolean (true) : Animate reversely or not

### Item

Animate item element when scroll top enters or leaves the area

```javascript
$(".element-to-animte-for-scrolling").parabox("item", {
	top: 0,
	bottom: $("body").attr("offsetHeight"),
	easing: "swing",
	duration: 500,
	from: { left: -100, opactiy: 0 },
	to: { left: 0, opacity: 1 },
    done: function(show){
        console.log(show ? "show" : "hide");
    }
}
});
```

- top:Integer (null) : Scroll top align which activates item
- bottom:Integer (null) : Scroll bottom align which deactivates item
- easing:String ("swing") : Easing function name
- duration:Integer (500) : Duration time for animation
- delay:Integer (0) : Delay for starting animation
- from:Object ({}) : Styles when it's deactive
- to:Object ({}) : Styles when it's active
- done:Function (function(){}) : Handler for completing animation

When `bottom` is null, it will be set page's height

### Section

Define the named section and vertical align, 
and add event which trigger when section changes.

```javascript
$(document).parabox("section", {
    "top": 0,
    "section-first": 500,
    "section-second" 1000,
    "section-third": 1500,
    ...
})
```

The action "section" initialize the sections in page by passed object,
which consists of name as key and vertical align as value.

```javascript
$(document).on("sectionChange", function(e, data){
    console.log(data.index); // index for the section
    console.log(data.name); // key for the section
    console.log(data.value); // vertical align for the section
    console.log(data.instance); // $.ParaBox.section object
});
```

Event handler for "sectionChange" accept data which contains some values about section,
as second argument.

