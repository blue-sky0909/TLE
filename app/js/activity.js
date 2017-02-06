$(document).ready(function(){
	$(document.body).delegate('#checkedActionStatus', 'change', function() {
		window.changedStatusActivity = $(this).val();
		//$("#checkedActionStatus").val(window.changedStatusActivity).change();
	});
});