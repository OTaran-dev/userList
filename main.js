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
    }

    getTableHtml() {
        const firstUser = this[0];
        const tempLineHead = Object.keys(firstUser).map(function (key) {
            const data = firstUser[key];
            if (typeof (data) !== 'object') {
                return `<th scope="col">${key}</th>`
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

const userList = new UserList();
data.forEach(element => {
    let user = new User(element);
    userList.push(user);
});

userList.sortBy('id', 'asc');
document.body.innerHTML = userList.getTableHtml();
parseSearchParams();

document.addEventListener('click', function (event) {
    if (event.target.tagName === 'TH') {
        userList.sortBy(event.target.innerHTML, 'asc');
        document.body.innerHTML = userList.getTableHtml();
    }
});

function parseSearchParams() {
    console.log(location);
    const searchString = location.search.substr(1);
    let tmp = searchString.split('&');
    let searchParams = {};

    tmp.forEach(function (p) {
        console.log(p);
        p = p.split('=');
        searchParams[p[0]] = p[1];
    });

    console.log(searchParams);
    if (searchParams.sortBy) {
        let order;
        if (searchParams.order) order = searchParams.order;
        else order = 'asc';
        userList.sortBy(searchParams.sortBy, order);
        document.body.innerHTML = userList.getTableHtml();
    }
}
