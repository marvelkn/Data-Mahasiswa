$(document).ready(function () {
    // Function to update table with new row
    function updateTable(nim, nama, alamat) {
        let newRow = `
            <tr>
                <td>${nim}</td>
                <td>${nama}</td>
                <td>${alamat}</td>
                <td>
                    <button type="button" class="btn btn-primary edit-btn" data-toggle="modal" data-target="#editModal" data-nim="${nim}" data-nama="${nama}" data-alamat="${alamat}">Edit</button>
                    <button type="button" class="btn btn-danger delete-btn" data-nim="${nim}">Delete</button>
                </td>
            </tr>
        `;
        $("#tableBody").append(newRow);
    }

    // Function to store data array in local storage
    function storeDataArray(dataArray) {
        localStorage.setItem("data", JSON.stringify(dataArray));
    }

    // Function to retrieve data array from local storage
    function retrieveDataArray() {
        let data = localStorage.getItem("data");
        return data ? JSON.parse(data) : [];
    }

    // Function to initialize local storage if empty
    function initializeLocalStorage() {
        let dataArray = retrieveDataArray();
        if (dataArray.length === 0) {
            storeDataArray([]);
        }
    }

    // Add data when submit button is clicked
    $("#addDataBtn").on("click", function () {
        // Retrieving input values
        let nim = $("#addNimInput").val();
        let nama = $("#addNamaInput").val();
        let alamat = $("#addAlamatInput").val();

        // Validating input values
        if (nim && nama && alamat) {
            // Retrieve existing data array or create a new one
            let dataArray = retrieveDataArray();
            // Push new entry to the data array
            dataArray.push({ nim: nim, nama: nama, alamat: alamat });
            // Store the updated data array in local storage
            storeDataArray(dataArray);

            updateTable(nim, nama, alamat);
            $("#addModal").modal("hide");
            $("#addForm")[0].reset();
            $("#addSuccess").modal("show");
        } else {
            $("#warning").modal("show");
        }
    });

    // Delete Data
    $(document).on("click", ".delete-btn", function () {
        $(this).parents("tr").remove();
        $("#deleteSuccess").modal("show");

        // Retrieve existing data array
        let dataArray = retrieveDataArray();
        // Find index of the entry to delete
        let index = dataArray.findIndex(item => item.nim === $(this).data("nim"));
        // Remove the entry from the array
        if (index !== -1) {
            dataArray.splice(index, 1);
            // Store the updated data array in local storage
            storeDataArray(dataArray);
        }
    });

    // Edit Data
    $("#editModal").on("show.bs.modal", function (event) {
        let button = $(event.relatedTarget);
        let nim = button.data("nim");
        let nama = button.data("nama");
        let alamat = button.data("alamat");

        // Populate input fields with data from local storage
        $("#editNim").val(nim);
        $("#editNama").val(nama);
        $("#editAlamat").val(alamat);

        $("#saveChangesBtn").off("click").on("click", function () {
            let newNim = $("#editNim").val();
            let newNama = $("#editNama").val();
            let newAlamat = $("#editAlamat").val();
            if (newNim && newNama && newAlamat) {
                let row = $(`tr:has(td:contains('${nim}'))`);
                row.find("td:nth-child(1)").text(newNim);
                row.find("td:nth-child(2)").text(newNama);
                row.find("td:nth-child(3)").text(newAlamat);
                $("#editModal").modal("hide");
                $("#editForm")[0].reset();
                $("#updateSuccess").modal("show");

                // Retrieve existing data array
                let dataArray = retrieveDataArray();
                // Find index of the entry to edit
                let index = dataArray.findIndex(item => item.nim === nim);
                // Update the entry in the array
                if (index !== -1) {
                    dataArray[index] = { nim: newNim, nama: newNama, alamat: newAlamat };
                    // Store the updated data array in local storage
                    storeDataArray(dataArray);
                }
            } else {
                $("#warning").modal("show");
            }
        });
    });

    // Initialize local storage if empty
    initializeLocalStorage();

    // Load data from local storage on page load
    let dataArray = retrieveDataArray();
    dataArray.forEach(entry => {
        updateTable(entry.nim, entry.nama, entry.alamat);
    });

    // vvvv Live Clock vvvv
    // Function to update the clock
    function updateClock() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        // Pad single digit minutes and seconds with leading zeros
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        // Display the time in HH:MM:SS format
        document.getElementById('clock').textContent = hours + ':' + minutes + ':' + seconds;
      }

      // Call updateClock function every second
      setInterval(updateClock, 1000);

      // Call updateClock once immediately to prevent delay in initial display
      updateClock();
});
