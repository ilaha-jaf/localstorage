removeFromStorage = (storage, event) => {
    if (event.target.classList.contains('delete')) {
        if (confirm('Are you sure?') === false) { return; }
        const key = event.target.dataset.local;
        storage.removeItem(key);
        getLocalStorageItems();
    }
}

function handleFromStorage(event) {
    removeFromStorage(event.target.classList.contains('localList') ? localStorage : sessionStorage, event);
}

setStorage = (storage, list) => {
    for (let i = 0; i < storage.length; i++) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        const spanKey = document.createElement('b');
        spanKey.innerHTML = storage.key(i);

        const spanValue = document.createElement('span');
        spanValue.innerHTML = storage.getItem(storage.key(i));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end', 'delete', `${list.id}`);
        deleteButton.innerHTML = 'Delete';
        deleteButton.dataset.local = storage.key(i);

        const div = document.createElement('div');
        div.classList.add('form-check');

        const checkInput = document.createElement('input');
        checkInput.classList.add('form-check-input', `${list.id}Check`);
        checkInput.type = 'checkbox';
        checkInput.value = storage.key(i);
        checkInput.id = `${list.id}Check`;

        div.appendChild(checkInput);

        div.appendChild(spanKey);
        div.appendChild(document.createTextNode(' : '));
        div.appendChild(spanValue);
        div.appendChild(document.createTextNode(' '));
        div.appendChild(deleteButton);

        li.appendChild(div);
        list.appendChild(li);

        const deleteAllbtn = document.getElementById('delete-all');
        deleteAllbtn.style.display = 'none';

        checkInput.addEventListener('change', (event) => {
            if (event.target.checked) {
                deleteButton.style.display = 'none';
            } else {
                deleteButton.style.display = 'block';
            }
  updateDeleteAllButtonVisibility();
            updateMasterCheckbox(`${list.id}Check`, `${list.id.replace('List', '')}Check`);
                });
    }
}

getLocalStorageItems = () => {
    const list = document.getElementById('localList');
    const sessionList = document.getElementById('sessionList');

    document.querySelectorAll('ul')
        .forEach(ul => {
            ul.innerHTML = '';
            ul.classList.add('list-group', 'list-group-flush');
        });

    setStorage(localStorage, list);
    setStorage(sessionStorage, sessionList);
};

document.addEventListener('DOMContentLoaded', function () {
    getLocalStorageItems();

    const keyInput = document.getElementById('key');
    const valueInput = document.getElementById('value');
    const saveButton = document.getElementById('btn-save');
    const list = document.getElementById('localList');
    const sessionList = document.getElementById('sessionList');
    const deleteAllbtn = document.getElementById('delete-all');

    list.addEventListener('click', handleFromStorage);
    sessionList.addEventListener('click', handleFromStorage);

    saveButton.addEventListener('click', function () {
        const value = valueInput.value;
        const key = keyInput.value;

        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);

        getLocalStorageItems();
        document
            .querySelectorAll('input')
            .forEach(input => input.value = '');
    });

    function toggleCheckboxes(masterCheckboxId, checkboxClass) {
        const masterCheckbox = document.getElementById(masterCheckboxId);
                masterCheckbox.addEventListener('change', function () {
                    const deleteAllbtn = document.getElementById('delete-all');
        
                    const checked = masterCheckbox.checked;
                    document
                        .querySelectorAll(`.${checkboxClass}`)
                        .forEach(input => input.checked = checked);
        
                    document
                        .querySelectorAll(`.${checkboxClass.replace('Check', '')} .delete`)
                        .forEach(button => button.style.display = checked ? 'none' : 'block');
        
                    deleteAllbtn.style.display = checked ? 'block' : 'none';
                    updateDeleteAllButtonVisibility();
                });
    }

    toggleCheckboxes('localCheck', 'localListCheck');
    toggleCheckboxes('sessionCheck', 'sessionListCheck');

    const btn = document.getElementById('deneme');
    btn.addEventListener('click', function () {
        const count = Array.from(document.querySelectorAll(`.localListCheck`)).reduce((acc, input) => {
            if (input.checked) {
                acc.checkedCount++;
            } else {
                acc.unCheckedCount++;
            }
            return acc;
        }, { checkedCount: 0, unCheckedCount: 0 });
        console.log(count);
    });

    deleteAllbtn.addEventListener('click', function () {
        document.querySelectorAll('.localListCheck:checked').forEach(input => {
            const key = input.value;
            localStorage.removeItem(key);
        });

        document.querySelectorAll('.sessionListCheck:checked').forEach(input => {
            const key = input.value;
            sessionStorage.removeItem(key);
        });

        getLocalStorageItems();
        deleteAllbtn.style.display = 'none';
    });
});

function updateMasterCheckbox(checkboxClass, masterCheckboxId) {
    const checkboxes = document.querySelectorAll(`.${checkboxClass}`);
        const masterCheckbox = document.getElementById(masterCheckboxId);
        masterCheckbox.checked = Array.from(checkboxes).every(input => input.checked);
}
function updateDeleteAllButtonVisibility() {
    const deleteAllbtn = document.getElementById('delete-all');
    const anyChecked = document.querySelectorAll('.form-check-input:checked').length > 0;
    deleteAllbtn.style.display = anyChecked ? 'block' : 'none';
}
