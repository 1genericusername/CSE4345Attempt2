 // /static/custom.js

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

channel.bind('new-record', (data) => {
    const last_session = moment(`${data.data.last_session}`, 'DD/MM/YYYY hh:mm a').format('YYYY-MM-DD hh:mm:ss a')

   $('#classes').append(`
        <tr id="${data.data.id} ">
            <th scope="row"> ${data.data.class_name} </th>
            <td> ${data.data.dept} </td>
            <td> ${data.data.number} </td>
            <td> ${last_session} </td>
            <td> ${data.data.desc} </td>
        </tr>
   `)
});

channel.bind('update-record', (data) => {
    const last_session = moment(`${data.data.last_session}`, 'DD/MM/YYYY hh:mm a').format('YYYY-MM-DD hh:mm:ss a')

    $(`#${data.data.id}`).empty()

    $(`#${data.data.id}`).html(`
        <th scope="row"> ${data.data.class_name} </th>
        <td> ${data.data.dept} </td>
        <td> ${data.data.number} </td>
        <td> ${last_session} </td>
        <td> ${data.data.desc} </td>
    `)
 });