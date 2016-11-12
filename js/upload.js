var manualuploader = new qq.FineUploader({
	element: $('#photo_uploader')[0],
	request: {
		endpoint: '/photo_upload'
	},
	validation: {
		allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
		sizeLimit: 2097152
	},
	text:{
		uploadButton: '<i class="icon-upload icon-white"></i> Photo Uploader'
	},
	template: '<div class="qq-uploader">' +
				'<pre class="qq-upload-drop-area"><span>{dragZoneText}</span></pre>' +
				'<div id="uploader_btn" class="qq-upload-button btn btn-primary biggie">{uploadButtonText}</div>' +
				'<span class="qq-drop-processing"><span></span><span class="qq-drop-processing-spinner"></span></span>' +
				'<ul class="qq-upload-list"></ul>' +
				'</div>',
	callbacks: {
		onSubmit: function(id, fileName){
			$("#photo_url").val(fileName).addClass("disabled");
			$("#photoupload_type").val("uploader");
			$("#photo_url_valid").val("valid");
		},
		onComplete: function(id, fileName, responseJSON){
			if(responseJSON.success){
				upload_via_uploader(responseJSON.filename);
			}else{
				//show_modal_error( "Error uploading", "Something went wrong. Please try again." );
			}
		}
	},
	autoUpload: false,
	multiple: false,
	debug:false,
});

$("#add_entry").click(function(){
	var photoupload_type = $("#photoupload_type").val();
	var photo_url = $("#photo_url").val();
	var title = $.trim( $("#title").val() );
	var photo_url_valid = $("#photo_url_valid").val();
	
	if( photo_url.length == 0 || photo_url_valid == "invalid"){
		$("#upload_errors").html('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button>You need to add a valid photo. Please check your photo URL.</div>');
		$("#photo_url").focus();
		return false;
	}
	
	if( title.length > 0){
		$("#btns_add").hide();
		$("#progbar").show();
		
		if( photoupload_type == "url" ){
			upload_via_photourl();
		}else{
			manualuploader.uploadStoredFiles();
		}
	}else{
		$("#upload_errors").html('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button>Title is required!</div>');
		$("#title").focus();
	}
	return false;
});
$("#photo_url").click(function(){
	if( $("#photoupload_type").val() == "uploader" ){
		$("#photo_url").removeClass("disabled").val("");
		$("#photoupload_type").val("url");
		$("#photo_url_valid").val("invalid");
		manualuploader.clearStoredFiles();
	}
});
$("#photo_url").blur(function(){
	var rawurl = $.trim( $(this).val() );
	if( $("#photoupload_type").val() == "url" && rawurl.length > 0){
		$.ajax({
			url: '/ajaxvalidateupload',
			type: "POST",
			data: { action: "photo_valid", url: rawurl },
			success: function(obj) {
				if( obj.success == true ){
					$("#photo_url_valid").val( "valid" );
					$("#photo_url").val(obj.clean_url);
					manualuploader.clearStoredFiles();
				}else{
					$("#photo_url_valid").val("invalid");
				}
			}
		});
	}
});
function upload_via_photourl(){

	var source = $("#source").val();
	var fb_publish = $("#fb_publish").is(":checked");
	var nsfw = $("#nsfw").is(":checked");
	var photo_url = $("#photo_url").val();
	var title = $.trim( $("#title").val() );
	
	var param = "action=add_photo" + "&title=" + title + "&source=" + source + "&photourl=" + photo_url + "&fb_publish=" + fb_publish + "&nsfw=" + nsfw;
		param += "&photoupload_type=url";
	$.ajax({
		type: "POST",
		url: '/ajaxvalidateupload',
		data: param + "&tokenID=" + Math.random() * (Math.random() * 100000 * Math.random() ),
		success: function(obj) {
			if(obj.success){
				entry = obj.data;
				msg = "<p>Your <a href='/p/"+ entry.id +"'>entry</a> was successfully added. Thank you for uploading!</p>";
				msg += "<p><b>Title</b>: "+ entry.title +"</p>";
				show_modal_success("Thank you for uploading!", msg, "/p/" + entry.id );
			}else{
				show_modal_error( "Error uploading", obj.error );
			}
			$("#progbar").hide();
			$("#btns_add").show();
		}
	});
}
function upload_via_uploader( filename ){

	var source = $("#source").val();
	var fb_publish = $("#fb_publish").is(":checked");
	var nsfw = $("#nsfw").is(":checked");
	var photo_url = filename;
	var title = $.trim( $("#title").val() );
	
	var param = "action=add_photo" + "&title=" + title + "&source=" + source + "&photourl=" + photo_url + "&fb_publish=" + fb_publish + "&nsfw=" + nsfw;
		param += "&photoupload_type=uploader";
	$.ajax({
		type: "POST",
		url: '/ajaxvalidateupload',
		data: param + "&tokenID=" + Math.random() * (Math.random() * 100000 * Math.random() ),
		success: function(obj) {
			if(obj.success){
				entry = obj.data;
				msg = "<p>Your <a href='/p/"+ entry.id +"'>entry</a> was successfully added. Thank you for uploading!</p>";
				msg += "<p><b>Title</b>: "+ entry.title +"</p>";
				show_modal_success("Thank you for uploading!", msg, "/p/" + entry.id );
			}else{
				show_modal_error( "Error uploading", obj.error );
			}
			$("#progbar").hide();
			$("#btns_add").show();
		}
	});
}
$("#modaltest").click(function(){
	//show_modal_success("Upload error", "","/p/2333");
});
function show_basic_modal(){
	$('#upload_msg').modal({
		keyboard: true,
		backdrop: 'static'
	}).css({
		width: 470,
		'margin-left': function () {
			return -($(this).width() / 2);
		}
	});
}
function show_modal_success( title, body, link ){
	$('#upload_msg').removeClass("error").addClass("success");
	$("#myModalLabel").html(title);
	$("#upload_msg_body").html(body);
	$("#btn-upload-more,#btn-view-post").show();
	$("#btn-view-post").attr("href",link);
	$("#btn-upload-close").hide();
	show_basic_modal();
}
function show_modal_error( title, body ){
	$('#upload_msg').removeClass("success").addClass("error");
	$("#myModalLabel").html(title);
	$("#upload_msg_body").html(body);
	$("#btn-upload-more,#btn-view-post").hide();
	$("#btn-upload-close").show();
	show_basic_modal();
}
$('#upload_msg').on('hide', function () {
	upload_reset();
})
function upload_reset(){
	$("#photo_url, #title, #source").val('');
		
	$("#photoupload_type").val('url');
	$("#photo_url_valid").val('invalid');
	
	$("#fb_publish").attr("checked","checked");
	$("#upload_errors").html('');
	$("#photo_url").removeClass("disabled").attr("data-filename","");
	//if( manualuploader ){
	//	manualuploader.clearStoredFiles();
	//}
}
$(".upload_clear").click(function(){
	$('#upload_msg').modal('hide');
	upload_reset();
});