$('#showModal').on('click', function () {
	$('.modal-background').fadeIn(600);
	$('.modal-background').css('display', 'flex');
});

$('#close').on('click', function () {
	$('.modal-background').fadeOut(600);
	$('.modal-background').css('display', 'none');
});