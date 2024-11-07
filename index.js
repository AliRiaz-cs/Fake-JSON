function validationForms() {
    const name = document.getElementById('fname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('houseaddress').value;

    if (!name || !email || !phone || !address) {
        alert('All fields are required');
        return false;
    }

    return true;
}

async function showData() {
    try {
        const response = await fetch('http://localhost:3000/form');
        const employeeList = await response.json();

        let html = "";
        employeeList.forEach((item) => {
            html += "<tr>";
            html += "<td>" + item.id + "</td>";
            html += "<td>" + item.name + "</td>";
            html += "<td>" + item.email + "</td>";
            html += "<td>" + item.phone + "</td>";
            html += "<td>" + item.address + "</td>";
            html += `<td>
                <button class="bg-blue-500 w-16 m-1 rounded-md " onclick="loadUpdateData(${item.id})">Edit</button>
                <button class="bg-red-500 w-16 m-1 rounded-md " onclick="deleteData(${item.id})">Delete</button>
            </td>`;
            html += "</tr>";
        });

        document.querySelector('tbody').innerHTML = html;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

window.addEventListener('DOMContentLoaded', showData);


function generateUUID() {
    return Math.floor(Math.random() * 900) + 100
}



async function add() {
    if (validationForms()) {
        const name = document.getElementById('fname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('houseaddress').value;

        try {

            const response = await fetch('http://localhost:3000/form');
            const data = await response.json();

            // Find the maximum id in the current data
            // const maxId = data.reduce((max, item) => item.id > max ? item.id : max, 0);
            // const maxId = data.reduce((max, item) => {
            //     const currentId = parseInt(item.id, 10);
            //     return currentId > max ? currentId : max;
            // }, 0);

            const uuid = generateUUID();
     
            const newEmployee = {
                id: (uuid).toString(),
                name: name,
                email: email,
                phone: phone,
                address: address
            };

            await fetch('http://localhost:3000/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEmployee)
            });

            showData();

            document.getElementById('fname').value = "";
            document.getElementById('email').value = "";
            document.getElementById('phone').value = "";
            document.getElementById('houseaddress').value = "";
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }
}

async function deleteData(id) {
    // console.log(id)
    // debugger
    try {
        await fetch(`http://localhost:3000/form/${id}`, {
            method: 'DELETE'
        });

        showData();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

async function loadUpdateData(id) {
    document.getElementById("submit").classList.add('hidden');
    document.getElementById("update").classList.remove('hidden');

    try {

        const response = await fetch(`http://localhost:3000/form/${id}`);
        
        // Check if the response is OK (status code in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const employee = await response.json();

        document.getElementById("fname").value = employee.name;
        document.getElementById("email").value = employee.email;
        document.getElementById("phone").value = employee.phone;
        document.getElementById("houseaddress").value = employee.address;

        document.querySelector("#update").onclick = function () {
            updateEmployee(id);
        };
    } catch (error) {
        console.error('Error fetching data for update:', error);
        // Display an alert or a message on the page to inform the user
        alert('Failed to load employee data. Please try again.');
    }
}

async function updateEmployee(id) {
    if (validationForms()) {
        const updatedEmployee = {
            name: document.getElementById("fname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("houseaddress").value
        };

        try {
            await fetch(`http://localhost:3000/form/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedEmployee)
            });

            showData();

            document.getElementById("submit").classList.remove('hidden');
            document.getElementById("update").classList.add('hidden');
            document.getElementById("fname").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("houseaddress").value = "";
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }
}