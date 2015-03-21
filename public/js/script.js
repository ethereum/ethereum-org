(function(){
	hljs.initHighlightingOnLoad();

	$('#shell-source').hide().removeClass('hidden');
	$('#install-info').hide().removeClass('hidden');
	$('#hide-source').hide().removeClass('hidden');

	$('#show-source').on('click', function() {
		$('#shell-source').show();
		$('#hide-source').show();
		$(this).hide();
	});

	$('#hide-source').on('click', function() {
		$('#show-source').show();
		$('#shell-source').hide();
		$(this).hide();
	});

	$('#understand').change(function() {
		$('#show-install').toggleClass('disabled', !$(this).prop( "checked" ));
	});

	$('#show-install').on('click', function() {
		$('#install-info').show();
		$('#install-terms').hide();
	});
})();

