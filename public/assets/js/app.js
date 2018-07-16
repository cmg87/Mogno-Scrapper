$(".preview").on('click', function (event) {
    let link = {"link": $(this).attr('data')};
    $('.modal-title').html($(this).attr('data-title'))
    $.post("/", link, function (data) {
        $('#modal-summary').html(data);

    })
})