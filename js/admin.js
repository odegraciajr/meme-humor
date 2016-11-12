var $update_post_ajax = "/myadmin/updatepost/action/";

$("a.imgfullsize").click(function(){
	$("#myModal .modal-body").html("<img src='"+ $(this).attr( "data-img" ) +"'/>");
	$("#myModal .myModalLabel").html($(this).attr("data-title"));
	//$("#ph-lightbox").lightbox({ show:true, resizeToFit:false, pos:"absolute", top:80 });
	$('#myModal').modal('show');
	return false;
});

$("input.check_all").click(function(){
	$(".custom #main_admin .post_main .mod_tb").find(':checkbox').attr('checked', this.checked);
});

$("a.action-all").click(function(){
	var ids = [];
	var action = $(this).attr("data-action");
	var active_post_count = 0;
	//console.log(action);
	
	$(".custom #main_admin .post_main .mod_tb .moderate_check").each(function(){
		if( $(this).is(":checked") ){
			ids.push($(this).attr("data-postid"));
		}
		active_post_count++;
	});
	if(ids.length > 0){
		bootbox.confirm("Are you sure to " + action + " ("+  ids.length+ ") " + ( ids.length > 1 ? "posts?" : "post?" ), function(result) {
			if(result){
				sendrequest_ajax( $update_post_ajax + action, ids, active_post_count );
			}
		});
	}else{
		bootbox.alert("No Post selected!");
	}
});

$("button.action-single").click(function(){
	var ids = [$(this).attr("data-postid")];
	var action = $(this).attr("data-action");
	var active_post_count = $(".custom #main_admin .post_main .mod_tb .moderate_check").length;
	//console.log(ids);
	//console.log(action);
	//console.log(active_post_count);
	
	if(ids.length > 0){
		
		if(action == "delete"){
			bootbox.confirm("Are you sure you want to delete this post?" , function(result) {
				if(result){
					sendrequest_ajax( $update_post_ajax + action, ids, active_post_count );
				}
			});
		}else if(action == "edit"){
			location.href = "/myadmin/post/edit/" + $(this).attr("data-postid");			
		}else{
			sendrequest_ajax( $update_post_ajax + action, ids, active_post_count );
		}
		
	}else{
		bootbox.alert("No Post selected!");
	}
	
});
function sendrequest_ajax( $ajax_url, $ids, $active_post_count ){
	$.post( $ajax_url, { ids: $ids, token: get_rand_token() },
		function(obj){
			if( obj.status ){
				var post_count = obj.count;
				var post_elems = obj.elem;
				if( ( $active_post_count - parseInt( post_count )) > 0 ){
					$( post_elems ).fadeOut("slow",function(){
						$( post_elems ).remove();
					});
				}else{
					location.reload();
				}
			}
		}
	);
}