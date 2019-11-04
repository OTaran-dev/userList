class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.username = data.username;
        this.email = data.email;
        this.phone = data.phone;
        this.website = data.website;
    }
}

class UserList extends Array {
    sortedByKey = '';
    sortOrder = '';

    sortBy(key, order) {
        this.sort((userA, userB) => {
            const varA = (typeof userA[key] === 'string') ?
                userA[key].toUpperCase() : userA[key];
            const varB = (typeof userB[key] === 'string') ?
                userB[key].toUpperCase() : userB[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ? (comparison * -1) : comparison
            );
        })
        this.sortedByKey = key;
        this.sortOrder = order;
    }

    renderTable() {
        const currentSortKey = this.sortedByKey;
        const currentSortOrder = this.sortOrder;
        const firstUser = this[0];
        const tempLineHead = Object.keys(firstUser).map(function (key) {
            const data = firstUser[key];
            if (typeof (data) !== 'object') {
                let sortIcon;
                if (key == currentSortKey) {
                    if (currentSortOrder == 'asc') sortIcon = '↑';
                    else sortIcon = '↓';
                }
                else sortIcon = '';
                let orderFlag = `<div class='order-flag'>${sortIcon}</div>`;
                let colName = `<div class='col-name'>${key}</div>`;
                return `<th scope="col">${orderFlag}${colName}</th>`;
            }
        }).join('');

        const tableBody = this.map(function (user) {
            const tempLine = Object.keys(user).map(function (key) {
                const data = user[key];
                if (typeof (data) !== 'object') {
                    return `<td>${user[key]}</td>`
                }
            }).join('');
            return `<tr>${tempLine}</tr>`;
        }).join('');

        return `<table class="table table-sm table-bordered table-hover">
        <thead class="thead-dark"><tr>${tempLineHead}</tr></thead><tbody>${tableBody}</tbody></table>`;
    }
}

let userList = new UserList();

let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            let data = stringToArray(xhr.responseText);

            data.forEach(element => {
                let user = new User(element);
                userList.push(user);
            });

            document.querySelector('.container-fluid').innerHTML = userList.renderTable();
            parseSearchParams();
        } else {
            document.querySelector('.table-title').innerText = xhr.status;
        }
    }
}


document.addEventListener('click', function (event) {
    if (event.target.tagName === 'TH') {
        let order;
        let sortKey = event.target.querySelector('.col-name').innerHTML;

        if (sortKey == userList.sortedByKey) {
            if (event.target.querySelector('.order-flag').innerHTML == '↑' && userList.sortOrder == 'asc') {
                order = 'desc';
            }
            else {
                order = 'asc';
            }
        }
        else order = 'asc';
        userList.sortBy(sortKey, order);
        document.querySelector('.container-fluid').innerHTML = userList.renderTable();
        updateSearchParams();
    }
});

function updateSearchParams() {
    let searchString = '?' + 'sortBy=' + userList.sortedByKey + '&order=' + userList.sortOrder;
    location.search = searchString;
}

function parseSearchParams() {
    const searchString = location.search.split('?').pop();
    let tmp = searchString.split('&');
    let searchParams = {};

    tmp.forEach(function (p) {
        p = p.split('=');
        searchParams[p[0]] = p[1];
    });

    if (searchParams.sortBy) {
        let order;
        if (searchParams.order) order = searchParams.order;
        else order = 'asc';
        userList.sortBy(searchParams.sortBy, order);
        document.querySelector('.container-fluid').innerHTML = userList.renderTable();
    }
}

function stringToArray(str) {
    let tmpObject = JSON.parse(str);
    let array = [];
    for (var i in tmpObject) {
        array.push(tmpObject[i]);
    }
    return array;
}
