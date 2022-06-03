document.addEventListener('DOMContentLoaded', function() {

    const studentContainer = document.querySelector('#student-container')
    const studentURL = `http://127.0.0.1:3000/students/`
    const studentForm = document.querySelector('#student-form')
    let allStudents = []

    fetch(`${studentURL}`)
        .then( response => response.json() )
        .then( studentData => studentData.forEach(function(student) {
            allStudents = studentData
            studentContainer.innerHTML += `
      <div class="card" id=student-${student.id}>
        <p>Name: ${student.name}</p>
        <p>Surname: ${student.surname}</p>
        <p>Patronymic: ${student.patronymic}</p>
        <p>Course: ${student.course}</p>
        <p>Group_id: ${student.group_id}</p>
        <button class="btn btn-outline-warning" data-id=${student.id} id="edit-${student.id}" data-action="edit">Edit</button>
        <button class="btn btn-outline-danger" data-id=${student.id} id="delete-${student.id}" data-action="delete">Delete</button>
      </div>
      <div id=edit-group-${student.id}>
      </div>`
        })) // end of group fetch


    studentForm.addEventListener('submit', (e) => {
        event.preventDefault();

        const nameInput = studentForm.querySelector('#name').value
        const surnameInput = studentForm.querySelector('#surname').value
        const patronymicInput = studentForm.querySelector('#patronymic').value
        const courseInput = studentForm.querySelector('#course').value
        const group_idInput = studentForm.querySelector('#group_id').value

        fetch(`${studentURL}`, {
            method: 'POST',
            body: JSON.stringify({
                name: nameInput,
                surname: surnameInput,
                patronymic: patronymicInput,
                course: courseInput,
                group_id: group_idInput
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( response => response.json())
            .then( student => {
                allStudents.push(student)
                studentContainer.innerHTML += `
        <div class="card" id=student-${student.id}>
            <p>Name: ${student.name}</p>
            <p>Surname: ${student.surname}</p>
            <p>Patronymic: ${student.patronymic}</p>
            <p>Course: ${student.course}</p>
            <p>Group_id: ${student.group_id}</p>
          <button class="btn btn-outline-warning" data-id=${student.id} id="edit-${student.id}" data-action="edit">Edit</button>
          <button class="btn btn-outline-danger" data-id=${student.id} id="delete-${student.id}" data-action="delete">Delete</button>
        </div>
        <div id=edit-student-${student.id}>
        </div>`
            })

    }) // end of eventListener for adding a group

    studentContainer.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'edit') {

            const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
            editButton.disabled = true

            const studentData = allStudents.find((student) => {
                return student.id == e.target.dataset.id
            })

            const editForm = studentContainer.querySelector(`#edit-student-${e.target.dataset.id}`)
            editForm.innerHTML = `
        <form class='form' id='edit-student' action='index.html' method='post'>
          <form class="card" id="student-form">
            <input required id="edit-name" placeholder="${studentData.name}">
            <input required id="edit-surname" placeholder="${studentData.surname}">
            <input required id="edit-patronymic" placeholder="${studentData.patronymic}">
            <input required id="edit-course" placeholder="${studentData.course}">
            <input required id="edit-group_id" placeholder="${studentData.group_id}">
            <input type="submit" value="Edit Student">
        </form>`

            editForm.addEventListener("submit", (e) => {
                event.preventDefault()

                const nameInput = document.querySelector("#edit-name").value
                const surnameInput = document.querySelector("#edit-surname").value
                const patronymicInput = document.querySelector("#edit-patronymic").value
                const courseInput = document.querySelector("#edit-course").value
                const group_idInput = document.querySelector("#edit-group_id").value
                const editedStudent = document.querySelector(`#student-${studentData.id}`)

                fetch(`${studentURL}/${studentData.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        name: nameInput,
                        surname: surnameInput,
                        patronymic: patronymicInput,
                        course: courseInput,
                        group_id: group_idInput
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then( response => response.json() )
                    .then( student => {
                        editedStudent.innerHTML = `
            <div class="card" id=student-${student.id}>
               <p>Name: ${student.name}</p>
               <p>Surname: ${student.surname}</p>
               <p>Patronymic: ${student.patronymic}</p>
               <p>Course: ${student.course}</p>
               <p>Group_id: ${student.group_id}</p>
              <button class="btn btn-outline-warning" data-id=${student.id} id="edit-${student.id}" data-action="edit">Edit</button>
              <button class="btn btn-outline-danger" data-id=${student.id} id="delete-${student.id}" data-action="delete">Delete</button>
            </div>
            <div id=edit-student-${student.id}>
            </div>`
                        editForm.innerHTML = ""
                    })
            }) // end of this event Listener for edit submit

        } else if (e.target.dataset.action === 'delete') {
            const deletion = confirm('really nigga?');
            if (deletion) {
                document.querySelector(`#student-${e.target.dataset.id}`).remove()
                fetch(`${studentURL}/${e.target.dataset.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then( response => response.json())
            }
        }

    }) // end of eventListener for editing and deleting a group

})