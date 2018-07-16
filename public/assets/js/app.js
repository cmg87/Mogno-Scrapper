$(".preview").on('click', function (event) {
    let link = {"link": $(this).attr('data')};
    $('.modal-title').html($(this).attr('data-title'))
    $.post("/", link, function (data) {
        $('#modal-summary').html(data);

    })
})

$(".save").on('click', function (event) {
    let update = {
        "state": $(this).attr('data-state'),
        "id": $(this).attr('data')
    }
    $.post('/saved', update, function (data) {
        alert('Saved!');
    })
})

$(".del").on('click', function (event) {
    let update = {
        "state": $(this).attr('data-state'),
        "id": $(this).attr('data')
    }
    $.post('/saved', update, function (data) {
        alert('Deleted!');
        location.reload();
    })
})