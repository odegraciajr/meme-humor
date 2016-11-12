var is_loading_home = false;
var stickme = null;
if ($.browser.webkit) {
	$("#social_bar #email_social").css("display","none");
}
$(".main_login_pop a,a#facebook_login").click(function(){
	PopupCenter(site_url + "/auth/facebook","Pinoy Humors",680,450);
	return false;
});
$(document).on("click", "#social_bar .social, .custom #main .post-home .share-like a.social, .custom #main .cs3 .btn.t-social, .custom #main .cs3 .btn.t-vote", function(){
//$().click(function(){
	var id = this.id;
	var share_link = $(this).attr("data-share-url");
	switch(id){
	
		case 'fb_social':
			PopupCenter(share_link,"Pinoy Humors",680,450);
			return false;
		break;
		case 'tweet_social':
			PopupCenter(share_link,"Pinoy Humors",680,450);
			return false;
		break;
		case 'gplus_social':
			PopupCenter(share_link,"Pinoy Humors",680,450);
			return false;
		break;
		case 'pin_social':
			PopupCenter(share_link,"Pinoy Humors",680,450);
			return false;
		break;
		case 'like_social':
			like_post( $(this).attr("data-postid") );
			$(this).addClass("disabled");
			return false;
		break;
		case 'unlike_social':
			unlike_post( $(this).attr("data-postid") );
			$(this).addClass("disabled");
			return false;
		break;
	}
});
function like_post( id ){
	$.post("/like/" + id);
}
function unlike_post( id ){
	$.post("/unlike/" + id);
}
if ( $('#home-post-content').length ) {
	$(document).bind('scroll', onScroll);
}
function onScroll(event){
	var closeToBottom = ($(window).scrollTop() + $(window).height() > ( $(document).height() / 2) );
	if( closeToBottom && !is_loading_home ){
		loadmore_home();
		is_loading_home = true;
	}
	//console.log($(window).scrollTop());
}

function loadmore_home(){
	var page = $("#home-post-content").attr("data-page");
	var order = $("#home-post-content").attr("data-order");

	$.post("/jqxhr_request", { action: "home_update", page: parseInt( page ) + 1, order: order, token: get_rand_token() },
		function(obj){
			
			if(obj != null && obj.status == true ){
				$("#home-post-content").append( obj.posts );
				$("#home-post-content").attr("data-page", parseInt( page ) + 1);
				is_loading_home = false;
			}
		}
	);
}
$(".custom #main .post-content .headline .nextprev_navs a.nav.disabled").click(function(){
	return false;
});
$(function(){
 
  if (!!$('.sticky').offset()) {
 
    var stickyTop = $('.sticky').offset().top;
 
    $(window).scroll(function(){
 
      var windowTop = $(window).scrollTop() + 55;
 
      if (stickyTop < windowTop){
        $('.sticky').css({ position: 'fixed', top: 0, 'padding-top': 55 });
      }
      else {
        $('.sticky').css({position:'static','padding-top': 0});
      }

    });
 
  }
 
});