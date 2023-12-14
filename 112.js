let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

// get total
function getTotal() {
   if (price.value != '') {
    let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
    total.innerHTML = result;
    total.style.background = "#00ff11";
} else {
    total.innerHTML = "";
    total.style.background = "red";
}
}

// Create Product
let dataPro = [];
let mood = "create";
let temp;

if (localStorage.getItem("products"))
    dataPro = JSON.parse(localStorage.getItem("products"));

getDataFromLocal();


submit.onclick = function() {
    if (title.value != '' && price.value != '' && category.value != '' && count.value < 100) {
        addProductToArray(title.value.toLowerCase(), price.value, taxes.value, ads.value, discount.value, total.innerHTML, category.value.toLowerCase(), count.value);
        clearInput();
        window.location.reload();
    }
}

function addProductToArray(title, price, taxes, ads, discount, total, category, count) {
    if (count > 1) {
        for(let i = 0; i < count; i++) {
            const product = {
                id: Math.floor(Math.random() * 32423754),
                title: title,
                price: price,
                taxes: taxes,
                ads: ads,
                discount: discount,
                total: total,
                count: count,
                category: category,
            }
            dataPro.push(product);
        }
    } else {
        const product = {
            id: Math.floor(Math.random() * 32423754),
            title: title,
            price: price,
            taxes: taxes,
            ads: ads,
            discount: discount,
            total: total,
            count: count,
            category: category,
        }
        if (mood === "create") {
            dataPro.push(product);
        } else {
            dataPro[temp] = product;
            mood = "create";
        }
    }
    addProductLocal(dataPro);
    addProductToPage(dataPro);
}

function addProductLocal(dataPro) {
    localStorage.setItem('products', JSON.stringify(dataPro));
}
function addProductToPage(dataPro) {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    let id = 1;
    let i = 0;
    dataPro.forEach((product) => {
        let tr = document.createElement("tr");
        tr.setAttribute("product-id", product.id);
        let tdId = document.createElement("td");
        tdId.textContent = id;
        id++;
        let title = document.createElement("td");
        title.id = "tdTitle";
        title.innerHTML = product.title;
        let price = document.createElement("td");
        price.innerHTML = product.price;
        let taxes = document.createElement("td");
        taxes.innerHTML = product.taxes;
        let ads = document.createElement("td");
        ads.innerHTML = product.ads;
        let discount = document.createElement("td");
        discount.innerHTML = product.discount;
        if (discount.innerHTML === '') {
            discount.innerHTML = "0";
        }
        let total = document.createElement("td");
        total.innerHTML = product.total;
        let category = document.createElement("td");
        category.id = "tdCategory";
        category.innerHTML = product.category;
        let update = document.createElement("td");
        update.innerHTML = `
        <button id="update" onclick="updateProduct(${i})" >update</button>`;
        i++;
        let tdDelete = document.createElement("td");
        let btnDelete = document.createElement("button");
        btnDelete.innerHTML = "delete";
        btnDelete.id = "delete";
        btnDelete.addEventListener("click", (e) => {
            deleteProductFromLocal(e.target.parentElement.parentElement.getAttribute("product-id"));
            e.target.parentElement.parentElement.remove();
        })
        tdDelete.append(btnDelete);
        tr.append(tdId);
        tr.append(title);
        tr.append(price);
        tr.append(taxes);
        tr.append(ads);
        tr.append(discount);
        tr.append(total);
        tr.append(category);
        tr.append(update);
        tr.append(tdDelete);
        tbody.append(tr);
    })
}

function getDataFromLocal() {
    let data = localStorage.getItem("products");
    if (data) {
        let products = JSON.parse(data);
        addProductToPage(products)
    }
}


function deleteProductFromLocal(productId) {
    dataPro = dataPro.filter((product) => product.id != productId);
    addProductLocal(dataPro);
    window.location.reload();
}

function clearInput() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
    total.innerHTML = '';
    total.style.background = "red";
}


let clear = document.createElement("button");
clear.innerHTML = `delete All(${dataPro.length})`;
document.querySelector(".search-container").after(clear);
clear.addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
})
if (dataPro.length <= 0) {
    clear.remove();
}

function updateProduct(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = "Update";
    getTotal();
    mood = "update";
    temp = i;
    scroll({
        top: 0,
        behavior: "smooth",
    })
}

// Search
let moodSearch = "title";

function getSearchMood(id) {
    let search = document.getElementById("search");
    if (id === "searchTitle") {
        moodSearch = "title";
    } else {
        moodSearch = "category";
    }
    search.placeholder = "Search By "+moodSearch; 
    search.focus();
    search.value = '';
    addProductToPage(dataPro);
}

function search(value) {
        document.querySelectorAll("#tdTitle").forEach((product) => {
            if (product.innerHTML.toLowerCase().includes(value.toLowerCase())) {
                product.parentElement.style.display = "";
            } else {
                product.parentElement.style.display = "none";
            }
        }) 
    if (moodSearch === "category") {
        document.querySelectorAll("#tdCategory").forEach((product) => {
            if (product.innerHTML.toLowerCase().includes(value.toLowerCase())) {
                product.parentElement.style.display = "";
            } else {
                product.parentElement.style.display = "none";
            }
        }) 
    }
}