document.addEventListener('DOMContentLoaded', function() {

    const teacherContainer = document.querySelector('#teacher-container')
    const teacherURL = `http://127.0.0.1:3000/teachers/`
    const teacherForm = document.querySelector('#teacher-form')
    let allTeachers = []

    fetch(`${teacherURL}`)
        .then( response => response.json() )
        .then( teacherData => teacherData.forEach(function(teacher) {
            allTeachers = teacherData
            teacherContainer.innerHTML += `
      <div id=teacher-${teacher.id}>
        <p>Name: ${teacher.name}</p>
        <p>Surname: ${teacher.surname}</p>
        <p>Patronymic: ${teacher.patronymic}</p>
        <p>Department: ${teacher.department}</p>
        <button data-id=${teacher.id} id="edit-${teacher.id}" data-action="edit">Edit</button>
        <button data-id=${teacher.id} id="delete-${teacher.id}" data-action="delete">Delete</button>
      </div>
      <div id=edit-teacher-${teacher.id}>
      </div>`
        })) // end of group fetch


    teacherForm.addEventListener('submit', (e) => {
        event.preventDefault();

        const nameInput = teacherForm.querySelector('#name_tch').value
        const surnameInput = teacherForm.querySelector('#surname_tch').value
        const patronymicInput = teacherForm.querySelector('#patronymic_tch').value
        const departmentInput = teacherForm.querySelector('#department').value

        fetch(`${teacherURL}`, {
            method: 'POST',
            body: JSON.stringify({
                name: nameInput,
                surname: surnameInput,
                patronymic: patronymicInput,
                department: departmentInput
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( response => response.json())
            .then( teacher => {
                allTeachers.push(teacher)
                teacherContainer.innerHTML += `
        <div id=teacher-${teacher.id}>
          <p>Name: ${teacher.name}</p>
          <p>Surname: ${teacher.surname}</p>
          <p>Patronymic: ${teacher.patronymic}</p>
          <p>Department: ${teacher.department}</p>    
          <button data-id=${teacher.id} id="edit-${teacher.id}" data-action="edit">Edit</button>
          <button data-id=${teacher.id} id="delete-${teacher.id}" data-action="delete">Delete</button>
        </div>
        <div id=edit-teacher-${teacher.id}>
        </div>`
            })

    }) // end of eventListener for adding a group

    teacherContainer.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'edit') {

            const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
            editButton.disabled = true

            const teacherData = allTeachers.find((teacher) => {
                return teacher.id == e.target.dataset.id
            })

            const editForm = teacherContainer.querySelector(`#edit-teacher-${e.target.dataset.id}`)
            editForm.innerHTML = `
        <form class='form' id='edit-teacher' action='index.html' method='post'>
          <form id="teacher-form">
            <input required id="edit-name_tch" placeholder="${teacherData.name}">
            <input required id="edit-surname_tch" placeholder="${teacherData.surname}">
            <input required id="edit-patronymic_tch" placeholder="${teacherData.patronymic}">
            <input required id="edit-department" placeholder="${teacherData.department}">
            <input type="submit" value="Edit Teacher">
        </form>`

            editForm.addEventListener("submit", (e) => {
                event.preventDefault()

                const nameInput = teacherForm.querySelector('#name_tch').value
                const surnameInput = teacherForm.querySelector('#surname_tch').value
                const patronymicInput = teacherForm.querySelector('#patronymic_tch').value
                const departmentInput = teacherForm.querySelector('#department').value
                const editedTeacher = document.querySelector(`#teacher-${teacherData.id}`)

                fetch(`${teacherURL}/${teacherData.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        name: nameInput,
                        surname: surnameInput,
                        patronymic: patronymicInput,
                        department: departmentInput
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then( response => response.json() )
                    .then( teacher => {
                        editedTeacher.innerHTML = `
            <div id=teacher-${teacher.id}>
              <p>Name: ${teacher.name}</p>
              <p>Surname: ${teacher.surname}</p>
              <p>Patronymic: ${teacher.patronymic}</p>
              <p>Department: ${teacher.department}</p>  
              <button data-id=${teacher.id} id="edit-${teacher.id}" data-action="edit">Edit</button>
              <button data-id=${teacher.id} id="delete-${teacher.id}" data-action="delete">Delete</button>
            </div>
            <div id=edit-teacher-${teacher.id}>
            </div>`
                        editForm.innerHTML = ""
                    })
            }) // end of this event Listener for edit submit

        } else if (e.target.dataset.action === 'delete') {
            document.querySelector(`#teacher-${e.target.dataset.id}`).remove()
            fetch(`${teacherURL}/${e.target.dataset.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then( response => response.json())
        }

    }) // end of eventListener for editing and deleting a group

})