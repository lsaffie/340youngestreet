// -----------------------------------------------------------------------------------
// By Josh Cope
// http://blazingwolf.com
//
// Based on code by Scott Upton
// http://www.uptonic.com | http://www.couloir.org
//
// -----------------------------------------------------------------------------------
// --- version date: 7/28/08 --------------------------------------------------------


// get current photo id from URL
var thisURL = document.location.href;
var splitURL = thisURL.split("#");
var photoId = splitURL[1] - 1;

// if no photoId supplied then set default
photoId = (!photoId)? 0 : photoId;

// Number of photos in this gallery
var photoNum = photoArray.length;

var timeout;

/*--------------------------------------------------------------------------*/

function Slideshow(photoId) {
		this.photoId = photoId;
		this.photo = 'Photo';
		this.outBox = 'OuterContainer';
		this.photoBox = 'PhotoContainer';
		this.prevLink = 'PrevLink';
		this.viewPhoto = 'ViewPhoto';
		this.nextLink = 'NextLink';
		this.captionBox = 'CaptionContainer';
		this.caption = 'Caption';
		this.counter = 'Counter';
	}
	
Slideshow.prototype.setSrc = function(element,src) {
 $('#'+element).attr("src",src);
}

Slideshow.prototype.setHref = function(element,href) {
 $('#'+element).attr("href",splitURL[0]+href);
}

Slideshow.prototype.setInnerHTML = function(element,content) {
 $('#'+element).html(content);
}

	
 Slideshow.prototype.getCurrentSize = function() {
		// Get current height and width
		this.wCur = $('#'+this.photoBox).width();
		this.hCur = $('#'+this.photoBox).height();
		this.wOutCur = $('#'+this.outBox).width();
		this.hOutCur = $('#'+this.outBox).height();
		this.wCapCur = $('#'+this.outBox).width();
		this.hCapCur = $('#'+this.captionBox).height();
	}
	
 Slideshow.prototype.getNewSize = function() {
		// Get current height and width
		this.wNew = photoArray[photoId][1];
		this.hNew = photoArray[photoId][2];
		this.wOutNew = (photoArray[photoId][1])-(-4);
		this.hOutNew = (photoArray[photoId][2])-(-4);
		this.wCapNew = (photoArray[photoId][1])-(-4);
	}
	
 Slideshow.prototype.getScaleFactor = function() {
		this.getCurrentSize();
		this.getNewSize();		
		// Scalars based on change from old to new
		this.xScale = (this.wNew / this.wCur) * 100;
		this.yScale = (this.hNew / this.hCur) * 100;
		this.xScale_out = (this.wOutNew / this.wOutCur) * 100;
		this.yScale_out = (this.hOutNew / this.hOutCur) * 100;
		this.xScale_cap = (this.wCapNew / this.wCapCur) * 100;
	}

 Slideshow.prototype.setNewPhotoParams = function() {
		// Set source of new image
		this.setSrc(this.photo,photoDir + photoArray[photoId][0]);
		// Set anchor for bookmarking
		this.setHref(this.prevLink, "#" + (photoId+1));
		this.setHref(this.nextLink, "#" + (photoId+1));
		$('#'+this.viewPhoto).attr("href",photoDir + photoArray[photoId][0]);
		$('#'+this.viewPhoto).attr("title",photoArray[photoId][3]);
	}
	
	Slideshow.prototype.setPhotoCaption = function() {
		// Add caption from gallery array
		this.setInnerHTML(this.caption,photoArray[photoId][3]);
		this.setInnerHTML(this.counter,((photoId+1)+'/'+photoNum));
	}
	
	Slideshow.prototype.setLinkSize = function() {
		$('#'+this.prevLink).width(Math.floor(((this.wNew) * 0.33)));
		$('#'+this.viewPhoto).width(Math.floor(((this.wNew) * 0.33)));
		$('#'+this.nextLink).width(Math.floor(((this.wNew) * 0.33)));
		$('#'+this.prevLink).height(this.hNew);
		$('#'+this.viewPhoto).height(this.hNew);
		$('#'+this.nextLink).height(this.hNew);
	}

	Slideshow.prototype.resizePhoto = function() {
		$('#'+this.photo).attr("width", photoArray[photoId][1]);
		$('#'+this.photo).attr("height", photoArray[photoId][2]);	
	}

	Slideshow.prototype.resizeOutBox = function() {
		this.getScaleFactor();
		
		$('#'+this.outBox).animate({width:this.wOutNew, height:this.hOutNew}, {duration:1000, queue:"global", scope:"expand"});
		$('#'+this.captionBox).animate({width:this.wCapNew, height:this.hCapCur}, {duration: 1000, queue:"global", scope:"expand"});
		$('#'+this.photoBox).animate({width:this.wNew, height: this.hNew}, {duration: 1000, queue:"global", scope:"expand"});

	}
	
	Slideshow.prototype.showPhoto = function(){
		$('#'+this.photo).fadeIn({duration: 500, queue:"global", scope:"box"});
		$('#'+this.counter).fadeIn({duration: 500, queue:"global", scope:"box"});
		$('#'+this.caption).fadeIn({duration: 500, queue:"global", scope:"box"});
	}
	
	Slideshow.prototype.nextPhoto = function(){
		// Figure out which photo is next
		(photoId == (photoArray.length - 1)) ? photoId = 0 : photoId++;
		this.initSwap();
	}
	Slideshow.prototype.prevPhoto = function(){
		// Figure out which photo is previous
		(photoId == 0) ? photoId = photoArray.length - 1 : photoId--;
		this.initSwap();
	}

 Slideshow.prototype.initSwap = function() {
		// Begin by hiding main elements
		$('#'+this.photo).hide();
		$('#'+this.caption).hide();
		$('#'+this.counter).hide();
		// Set new dimensions and source, then resize
		this.setNewPhotoParams();	
		this.setPhotoCaption();
		this.resizeOutBox();
		this.resizePhoto();
		this.showLinks();
	}
	
	 Slideshow.prototype.showLinks = function(){
		this.setLinkSize();
		$('#'+this.prevLink).show();
		$('#'+this.viewPhoto).show();
		$('#'+this.nextLink).show();
	}
	
	Slideshow.prototype.autoplay = function() {
		if (autoplay) {
			timeout = setTimeout("var myPhoto = new Slideshow(photoId);myPhoto.nextPhoto();", autoplay_dur);
		}
	}	


/*--------------------------------------------------------------------------*/

// Establish CSS-driven events via Behaviour script
var myrules = {
	'#Photo' : function(element){
		element.onload = function(){
			var myPhoto = new Slideshow(photoId);
			myPhoto.showPhoto();
			myPhoto.autoplay();					
		}
	},
	'#PrevLink' : function(element){
		element.onmouseover = function(){
		}
		element.onclick = function(){
			clearTimeout(timeout);
			var myPhoto = new Slideshow(photoId);
			myPhoto.prevPhoto();
		}
	},
	'#ViewPhoto' : function(element){
		element.onclick = function(){
			clearTimeout(timeout);
			var myPhoto = new Slideshow(photoId);
			myPhoto.getNewSize();
			myPhoto.showLinks(); 
		}
	},
	'#NextLink' : function(element){
		element.onmouseover = function(){
		}
		element.onclick = function(){
			clearTimeout(timeout);
			var myPhoto = new Slideshow(photoId);
			myPhoto.nextPhoto();
		}
	},
	a : function(element){
		element.onfocus = function(){
			this.blur();
		}
	}
};

// Add window.onload event to initialize
Behaviour.addLoadEvent(init);
Behaviour.apply();
function init() {
	var myPhoto = new Slideshow(photoId);
 myPhoto.initSwap();
}
