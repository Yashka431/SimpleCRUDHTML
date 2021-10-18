
let api_url = ''
let count = 1
function get_radio(value) {
    const rad = document.getElementsByName('radio');
    for (let i = 0; i < rad.length; i++) {
        if (rad[i].checked) {
            switch (i+1){
                case 1:
                    api_url = 'http://127.0.0.1:3000/groups/';
                    count = getAllData(value)
                    break;
                case 2:
                    api_url = 'http://127.0.0.1:3000/students/';
                    count = getAllData(value)
                    break;
                case 3:
                    api_url = 'http://127.0.0.1:3000/teachers/';
                    count = getAllData(value)
                    break;
                case 4:
                    api_url = 'http://127.0.0.1:3000/subjects/';
                    count = getAllData(value)
                    break;
                default:
                    api_url = 'http://127.0.0.1:3000/';
                    break;
            }
        }
    }
}

console.log(api_url)
async function getAllData(value){
    let number = document.getElementById('number')
    const response = await fetch(api_url);
    const data = await response.json();
    console.log(data);
    return Object.keys(data).length;
}
