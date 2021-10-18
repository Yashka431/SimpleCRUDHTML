document.addEventListener('DOMContentLoaded', function() {

    const groupContainer = document.querySelector('#group-container')
    const groupURL = `http://127.0.0.1:3000/groups/`
    const groupForm = document.querySelector('#group-form')
    let allGroups = []

    fetch(`${groupURL}`)
        .then( response => response.json() )
        .then( groupData => groupData.forEach(function(group) {
            allGroups = groupData
            groupContainer.innerHTML += `
      <div id=group-${group.id}>
        <p>${group.name_of_group}</p>
        <p>Speciality: ${group.speciality}</p>
        <p>Faculty: ${group.faculty}</p>
        <button data-id=${group.id} id="edit-${group.id}" data-action="edit">Edit</button>
        <button data-id=${group.id} id="delete-${group.id}" data-action="delete">Delete</button>
      </div>
      <div id=edit-group-${group.id}>
      </div>`
        })) // end of group fetch


    groupForm.addEventListener('submit', (e) => {
        event.preventDefault();

        const name_of_groupInput = groupForm.querySelector('#name_of_group').value
        const specialityInput = groupForm.querySelector('#speciality').value
        const facultyInput = groupForm.querySelector('#faculty').value

        fetch(`${groupURL}`, {
            method: 'POST',
            body: JSON.stringify({
                name_of_group: name_of_groupInput,
                speciality: specialityInput,
                faculty: facultyInput
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( response => response.json())
            .then( group => {
                allGroups.push(group)
                groupContainer.innerHTML += `
        <div id=group-${group.id}>
          <p>${group.name_of_group}</p>
          <p>speciality: ${group.speciality}</p>
          <p>Faculty: ${group.faculty}</p>
          <button data-id=${group.id} id="edit-${group.id}" data-action="edit">Edit</button>
          <button data-id=${group.id} id="delete-${group.id}" data-action="delete">Delete</button>
        </div>
        <div id=edit-group-${group.id}>
        </div>`
            })

    }) // end of eventListener for adding a group

    groupContainer.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'edit') {

            const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
            editButton.disabled = true

            const groupData = allGroups.find((group) => {
                return group.id == e.target.dataset.id
            })

            const editForm = groupContainer.querySelector(`#edit-group-${e.target.dataset.id}`)
            editForm.innerHTML = `
        <form class='form' id='edit-group' action='index.html' method='post'>
          <form id="group-form">
            <input required id="edit-name_of_group" placeholder="${groupData.name_of_group}">
            <input required id="edit-speciality" placeholder="${groupData.speciality}">
            <input required id="edit-faculty" placeholder="${groupData.faculty}">
            <input type="submit" value="Edit Group">
        </form>`

            editForm.addEventListener("submit", (e) => {
                event.preventDefault()

                const name_of_groupInput = document.querySelector("#edit-name_of_group").value
                const specialityInput = document.querySelector("#edit-speciality").value
                const facultyInput = document.querySelector("#edit-faculty").value
                const editedGroup = document.querySelector(`#group-${groupData.id}`)

                fetch(`${groupURL}/${groupData.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        name_of_group: name_of_groupInput,
                        speciality: specialityInput,
                        faculty: facultyInput
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then( response => response.json() )
                    .then( group => {
                        editedGroup.innerHTML = `
            <div id=group-${group.id}>
              <p>${group.name_of_group}</p>
              <p>speciality: ${group.speciality}</p>
              <p>Faculty: ${group.faculty}</p>
              <button data-id=${group.id} id="edit-${group.id}" data-action="edit">Edit</button>
              <button data-id=${group.id} id="delete-${group.id}" data-action="delete">Delete</button>
            </div>
            <div id=edit-group-${group.id}>
            </div>`
                        editForm.innerHTML = ""
                    })
            }) // end of this event Listener for edit submit

        } else if (e.target.dataset.action === 'delete') {
            document.querySelector(`#group-${e.target.dataset.id}`).remove()
            fetch(`${groupURL}/${e.target.dataset.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then( response => response.json())
        }

    }) // end of eventListener for editing and deleting a group

})