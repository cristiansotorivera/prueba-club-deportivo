// When the document is ready, execute the getData function
$(document).ready(function () {
    getData()
})

// Function to fetch data from the server and populate the table
function getData() {
    // Clear the existing content of the table body
    $('#cuerpo').html('')
    // Make a GET request to fetch sports data from the server
    axios.get('/deportes').then((data) => {
        // Extract the array of sports from the response data
        let deportes = data.data.deportes
        // Loop through each sport in the array
        deportes.forEach((d, i) => {
            // Append a table row for each sport to the table body
            $('#cuerpo').append(`
        <tr>
          <th scope="row">${i + 1}</th>
          <td>${d.nombre}</td>
          <td>${d.precio}</td>
          <td>
            <!-- Button to trigger editing of the sport -->
            <button class="btn btn-warning" onclick='preEdit("${d.nombre}","${d.precio}")' data-toggle="modal" data-target="#exampleModal">Editar</button>
            <!-- Button to delete the sport -->
            <button class="btn btn-danger" onclick='eliminar("${d.nombre}")'>Eliminar</button>
          </td>
        </tr>
        `)
        })
    })
}

// Function to populate the modal with data for editing
function preEdit(nombre, precio) {
    $('#nombreModal').val(nombre)
    $('#precioModal').val(precio)
}

// Function to add a new sport
function agregar() {
    // Get the name and price of the new sport from input fields
    let nombre = $('#nombre').val()
    let precio = $('#precio').val()
    // Make a GET request to add the new sport
    axios.get(`/agregar?nombre=${nombre}&precio=${precio}`).then((data) => {
        // Display a success message
        alert( nombre + ' fue agregado a la tabla de deportes registrados.' )
        // Refresh the data displayed in the table
        getData()
    })
    // Hide the modal after adding the sport
    $('#exampleModal').modal('hide')
}

// Function to edit the price of a sport
function edit() {
    // Get the name, current price, and new price of the sport from input fields
    let nombre = $('#nombreModal').val()
    let precio = $('#precioModal').val()
    let precioNuevo = $('#precioNuevoModal').val()
    // Make a PUT request to update the price of the sport
    axios.put(`/editar?nombre=${nombre}&precio=${precio}&precioNuevo=${precioNuevo}`).then((data) => {
        // Display a success message with the old and new prices
        alert( nombre + '  ha sido modificado de $' + precio + '  Nuevo precio es $ ' + precioNuevo)
        // Refresh the data displayed in the table
        getData()
    })
    // Hide the modal after editing the sport
    $('#exampleModal').modal('hide')
}

// Function to delete a sport
function eliminar(nombre) {
    // Make a GET request to delete the sport
    axios.get(`/eliminar?nombre=${nombre}`).then((data) => {
        // Display a success message
        alert(nombre + ' ha sido eliminado' )
        // Refresh the data displayed in the table
        getData()
    })
    // Hide the modal after deleting the sport
    $('#exampleModal').modal('hide')
}
