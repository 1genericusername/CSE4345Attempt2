 // /static/custom.js

$(document).ready(function() {
    $('#classes-table').DataTable({
        "bSortCellsTop": true,
        "bAutoWidth": false,
        "bFilter": true,
        "columns": [
            { "width": "8%" },

            { "width": "8%" },

            { "width": "30%" },
            { "width": "18%",
              "orderable": false },

            { "width": "18%",
              "orderable": false,
              "searchable": false },

            { "width": "18%",
              "orderable": false,
              "searchable": false }
        ],
        initComplete: function () {
            this.api().columns([0, 1, 2]).every( function () {
                var column = this;
                var columnIndex = this.index();
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(".filter th:eq("+columnIndex+")").empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        },
    } );
    $('#classes-table_wrapper .row:nth-of-type(2)').addClass('mx-auto');
});

$(document).ready(function(){
    $("#filter-input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#filter-table tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$.datetimepicker.setDateFormatter({
    parseDate: function (date, format) {
        var d = moment(date, format);
        return d.isValid() ? d.toDate() : false;
    },
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
});

$('.datetime').datetimepicker({
    format:'DD-MM-YYYY hh:mm A',
    formatTime:'hh:mm A',
    formatDate:'DD-MM-YYYY',
    useCurrent: false,
});

// Initialize Pusher
const pusher = new Pusher('989251a250c4490baf73', {
    cluster: 'us2',
    encrypted: true
});

// Subscribe to table channel
var channel = pusher.subscribe('table');

channel.bind('new-class', (data) => {
   $('#classes-table').append(`
        <tr id="${data.data.id}">
            <th scope="row"> ${data.data.dept} </th>
            <td> ${data.data.number} </td>
            <td> ${data.data.class_name} </td>
            <td> ${data.data.desc} </td>
            <td> <a class="btn btn-primary" role="button" href="/edit/${data.data.id}">Edit</a> </td>
            <td> <button class="btn btn-danger" data-toggle="modal" data-target="#confirmation-modal" data-id="${data.data.id}" data-dept="${data.data.dept}" data-number="${data.data.number}">Remove Class</button> </td>
        </tr>
   `)
});

$("#form-class-add").ajaxForm({
    success: function() {
        successMessage('Successfully Added Class...');
        $("#form-class-add").trigger("reset");
    },
    error: function(error) {
        errorMessage('Failed Adding Class...');
    }
});

channel.bind('update-class', (data) => {

    $(`#${data.data.id}`).empty()

    $(`#${data.data.id}`).html(`
        <th scope="row"> ${data.data.dept} </th>
        <td> ${data.data.number} </td>
        <td> ${data.data.class_name} </td>
        <td> ${data.data.desc} </td>
        <td> <a class="btn btn-primary" role="button" href="/edit/${data.data.id}">Edit</a> </td>
        <td> <button class="btn btn-danger" data-toggle="modal" data-target="#confirmation-modal" data-id="${data.data.id}" data-dept="${data.data.dept}" data-number="${data.data.number}">Remove Class</button> </td>

    `)
});

channel.bind('remove-class', (data) => {
    $(`#${data.id}`).empty()
});

$('#confirmation-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var data_removal_id = button.data('id');
    var data_removal_dept = button.data('dept');
    var data_removal_number = button.data('number');

    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find('.modal-title').text('Deleting ' + data_removal_dept + ' ' + data_removal_number);
    $("#confirm-remove-class-btn").click(function(){ removeSavedClass(data_removal_id); });
})

function removeSavedClass(id) {
    $(function() {
        $.ajax({
            url: "/remove/"+id,
            type: 'DELETE',
            success: function(response) {
                successMessage('Removed Class...');
            },
            error: function(error) {
                errorMessage('Failed Removing Class...');
            }
        });
    });
};

function successMessage(successText) {
    $('.main-content').prepend('<div class="alert alert-success alert-dismissible fade show fixed-top col-6 mx-auto mt-2" role="alert">'
                    + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                    + '<span aria-hidden="true">&times;</span> </button>'
                    + '<strong>Success!</strong> '
                    + successText + '</div>');
}

function errorMessage(errorText) {
    $('.main-content').prepend('<div class="alert alert-success alert-dismissible fade show fixed-top col-6 mx-auto mt-2" role="alert">'
                    + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                    + '<span aria-hidden="true">&times;</span> </button>'
                    + '<strong>Error!</strong> '
                    + errorText + '</div>');
}