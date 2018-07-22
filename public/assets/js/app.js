$(".preview").on('click', function (event) {
    let link = {"link": $(this).attr('data')};
    $('.modal-title1').html($(this).attr('data-title'))
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

    })
})

$(".del").on('click', function (event) {
    let update = {
        "state": $(this).attr('data-state'),
        "id": $(this).attr('data')
    }
    $.post('/saved', update, function (data) {
        location.reload();
    })
})


$('.scrape').on('click', function (event) {
    $.get('/scrape',function (data) {
        if(data){
            $('#complete').modal('toggle');
            setTimeout(function () {
                location.reload()
            },1000)
        }
    })
})


$('.notes').on('click', function (event) {
    $('#notes-posted').empty();
    let id = $(this).attr('data');
    $('.submit').attr('data', id);
    $.get('/post-note/'+id, function (data) {
        for(let x in data){
            for(let i in data[x].notes){
                let div = $('<div>');
                div.append(`${data[x].notes[i].note}: ${data[x].notes[i].body} <button class="delete" data="${data[x].notes[i]._id}">X</button>`)
                $('#notes-posted').append(div)
            }
        }
    })
})

$('.submit').on('click',function (event) {
    let id = $(this).attr('data');
    let data = {
        id : id,
        note: $('#note-title').val(),
        body: $('#note-body').val(),
    }
    $.post('/notesaver',data, function (result) {

    })


    //clear values
    $('#note-title').val('');
    $('#note-body').val('');

})


$('body').on('click', ".delete", function (event) {
    console.log(event);
    let id = {
        article : $('.submit').attr('data'),
        note: $(this).attr('data'),
    }
    $.post('/delete-note', id, function (data) {
        location.reload();
    })
})



//todo
//finish delete-note route for deleting notes where it is the id yada yada ya