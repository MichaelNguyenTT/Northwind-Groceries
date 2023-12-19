'use strict'

window.onload = function(){
    setTimeout(() => {
      document.getElementById("fadein").remove();
    },1000);
    const firstDropdownSelect = document.getElementById('category-select');
    const displayProducts = document.getElementById('displayProducts');
    const categoryNameDropdown = document.getElementById('categoryNames');
    categoryNameDropdown.style.display = 'none'

    loadUserSearch()
    firstDropdownSelect.onchange = () => {
      displayProducts.innerHTML = ''
      let firstDropdownValue = firstDropdownSelect.value;

      if (firstDropdownValue === 'categories') {
        categoryNameDropdown.style.display = 'block'
        onCategorySelect();
        displayProductsByCategory()
      } else if (firstDropdownValue === 'viewAll') {
        categoryNameDropdown.style.display = 'none'
        displayViewAllonSelect();
      } else {
        categoryNameDropdown.style.display = 'none'
      }
    }
  };

function loadUserSearch() {

  const selectCategory = document.getElementById('category-select');

  const search_by_category = new Option('Search by category', "categories")
  const viewAll = new Option('View All', 'viewAll');

  selectCategory.appendChild(search_by_category)
  selectCategory.appendChild(viewAll)
}

async function onCategorySelect() {
      try {
        const response = await fetch('http://localhost:8081/api/categories')
        const data = await response.json();
        console.log(data);

        const searchByCategory = document.getElementById('categoryNames')
        data.forEach(item => {
          const categoryOption = new Option(item.name, item.categoryId);
  
          searchByCategory.appendChild(categoryOption)
        })
      } catch (error) {
        console.log('Fetch Failed', error);
      }
  }

//TODO display products on selected category
function displayProductsByCategory() {
  const categories = document.getElementById('categoryNames');
  const displayProducts = document.getElementById('displayProducts');

  categories.onchange = async () => {
    displayProducts.innerHTML = ''
    const categoryValue = categories.value; // value = id;
    try {
      const response = await fetch('http://localhost:8081/api/products/')
      const data = await response.json();

      const filteredData = data.filter((item) => item.categoryId === categoryValue);
      console.log(filteredData);

      filteredData.forEach((item) => {
        const displayProducts = document.getElementById('displayProducts');
        const getProductCards = createCardDivs(item);
        displayProducts.appendChild(getProductCards)
      })
    } catch (error) {
      console.log('Fetch Failed', error);
    }
  } 
}
// //TODO if View All is selected will display all products
async function displayViewAllonSelect() {
      try {
        const response = await fetch('http://localhost:8081/api/products')
        const data = await response.json()
        console.log(data);
        data.forEach(item => {
          const displayProducts = document.getElementById('displayProducts');
          const getProductCards = createCardDivs(item);

        displayProducts.appendChild(getProductCards)
        })
      } catch (error) {
        console.log('Fetch Error', error);
      }
}

function createCardDivs(item) {
  const create_product_div = document.createElement('div');
  create_product_div.className = 'displayProductCards'
  create_product_div.innerHTML = `
  <div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${item.productName}</h5>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Price: ${item.unitPrice}</li>
    <li class="list-group-item">In Stock: ${item.unitsInStock}</li>
    <li class="list-group-item">Supplier: ${item.supplier}</li>
  </ul>
  <div class="card-body">
    <a href="#" class="card-link">See Details</a>
  </div>
</div>
`
  return create_product_div;
}