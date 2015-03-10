(function(){
	hljs.initHighlightingOnLoad();

	$('#shell-source').hide().removeClass('hidden');

	$('#show-source').on('click', function() {
		$('#shell-source').show();
		$(this).hide();
	});

	$('#hide-source').on('click', function() {
		$('#show-source').show();
		$('#shell-source').hide();
	});

})();

