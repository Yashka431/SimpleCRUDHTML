document.addEventListener('DOMContentLoaded', function() {

    const subjectContainer = document.querySelector('#subject-container')
    const subjectURL = `http://127.0.0.1:3000/subjects/`
    const subjectForm = document.querySelector('#subject-form')
    let allSubjects = []

    fetch(`${subjectURL}`)
        .then( response => response.json() )
        .then( subjectData => subjectData.forEach(function(subject) {
            allSubjects = subjectData
            subjectContainer.innerHTML += `
      <div id=subject-${subject.id}>
        <p>${subject.name_of_subject}</p>
        <button data-id=${subject.id} id="edit-${subject.id}" data-action="edit">Edit</button>
        <button data-id=${subject.id} id="delete-${subject.id}" data-action="delete">Delete</button>
      </div>
      <div id=edit-subject-${subject.id}>
      </div>`
        })) // end of group fetch


    subjectForm.addEventListener('submit', (e) => {
        event.preventDefault();

        const name_of_subjectInput = subjectForm.querySelector('#name_of_subject').value

        fetch(`${subjectURL}`, {
            method: 'POST',
            body: JSON.stringify({
                name_of_subject: name_of_subjectInput
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( response => response.json())
            .then( subject => {
                allSubjects.push(subject)
                subjectContainer.innerHTML += `
        <div id=subject-${subject.id}>
          <p>Name of subject: ${subject.name_of_subject}</p>
          <button data-id=${subject.id} id="edit-${subject.id}" data-action="edit">Edit</button>
          <button data-id=${subject.id} id="delete-${subject.id}" data-action="delete">Delete</button>
        </div>
        <div id=edit-subject-${subject.id}>
        </div>`
            })

    }) // end of eventListener for adding a group

    subjectContainer.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'edit') {

            const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
            editButton.disabled = true

            const subjectData = allSubjects.find((subject) => {
                return subject.id == e.target.dataset.id
            })

            const editForm = subjectContainer.querySelector(`#edit-subject-${e.target.dataset.id}`)
            editForm.innerHTML = `
        <form class='form' id='edit-subject' action='index.html' method='post'>
          <form id="subject-form">
            <input required id="edit-name_of_subject" placeholder="${subjectData.name_of_subject}">
            <input type="submit" value="Edit Subject">
        </form>`

            editForm.addEventListener("submit", (e) => {
                event.preventDefault()

                const name_of_subjectInput = document.querySelector("#edit-name_of_subject").value
                const editedSubject = document.querySelector(`#subject-${subjectData.id}`)


                fetch(`${subjectURL}/${subjectData.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        name_of_subject: name_of_subjectInput
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then( response => response.json() )
                    .then( subject => {
                        editedSubject.innerHTML = `
            <div id=subject-${subject.id}>
              <p>Name of subject: ${subject.name_of_subject}</p>
              <button data-id=${subject.id} id="edit-${subject.id}" data-action="edit">Edit</button>
              <button data-id=${subject.id} id="delete-${subject.id}" data-action="delete">Delete</button>
            </div>
            <div id=edit-subject-${subject.id}>
            </div>`
                        editForm.innerHTML = ""
                    })
            }) // end of this event Listener for edit submit

        } else if (e.target.dataset.action === 'delete') {
            document.querySelector(`#subject-${e.target.dataset.id}`).remove()
            fetch(`${subjectURL}/${e.target.dataset.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then( response => response.json())
        }

    }) // end of eventListener for editing and deleting a group

})