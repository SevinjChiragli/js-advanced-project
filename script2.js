let bagItems = JSON.parse(localStorage.getItem("bag"));
let bagList = document.getElementById("bagList");
bagItems.forEach((item) => {
  let li = document.createElement("li");
  li.innerHTML = `
   <hr class="hr" />
    <div class="wishlist">
       <img class="picture" src="${item.url}" alt="" />
       <div>
          <p>${item.product_name}</p>
          <p class="definition">${item.product_description}</p>
          <p class="price">${item.product_price}</p>
            <div class="favoriteDelete">
              <button>Избранные</button>
              <button class='delete'>Удалить</button>
            </div>
      </div>
      <div class='count'> 
       <button class='plus'>+</button>
       <p class='amount'>${item.count || 1}</p>
       <button class='minus'>-</button>
      </div>
    </div>`;

  li.querySelector(".plus").addEventListener("click", () => {
    let amount = li.querySelector(".amount");
    let currentCount = amount.innerText;
    currentCount++;
    amount.innerText = currentCount;
    item.count = currentCount;
    localStorage.setItem("bag", JSON.stringify(bagItems));
    calculate();
  });

  li.querySelector(".minus").addEventListener("click", () => {
    let amount = li.querySelector(".amount");
    let currentCount = amount.innerText;
    if (currentCount > 1) {
      currentCount--;
    }
    amount.innerText = currentCount;
    item.count = currentCount;
    localStorage.setItem("bag", JSON.stringify(bagItems));
    calculate();
  });

  li.querySelector(".delete").addEventListener("click", () => {
    bagItems = bagItems.filter((item1) => {
      item1.product_name !== item.product_name;
    });
    localStorage.setItem("bag", JSON.stringify(bagItems));
    bagList.removeChild(li);
    calculate();
  });
  bagList.appendChild(li);
});
document.querySelector(".clear").addEventListener("click", () => {
  localStorage.removeItem(`bag`);
  li.remove();
  calculate();
});
const calculate = () => {
  let total = bagItems.reduce((sum, item) => {
    return sum + item.product_price * (item.count || 1);
  }, 0);
  let totalPrice = document.querySelector("#totalPrice");
  totalPrice.textContent = `${total}`;
  return total
};
calculate();
document.querySelector(".confirm").addEventListener("click", (ev) => {
  ev.preventDefault();
  let totalAmount = calculate();
  if(!totalAmount==0){
    async function sendOrder() {
      try {
        let res = await fetch(`http://localhost:5002/add-orders`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            fullName: document.getElementById("fullName").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            order: JSON.parse(localStorage.getItem("bag")),
          }),
        });
        let data = await res.json();
        console.log(data);
        let modal = document.querySelector(".modal");
        let modalContent = document.querySelector(".modalContent");
        let name = document.getElementById("fullName").value;
        let phone = document.getElementById("phone").value;
        let address = document.getElementById("address").value;
        let totalAmount = calculate();
        if (name && phone && address) {
          modalContent.innerHTML = `
          <p>Заказ был оформлен для ${name} на сумму ${totalAmount}</p>`;
          modal.style = `display:flex`;
        } else {
          alert("заполните все поля.");
        }
        modal.addEventListener("click", (event) => {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
    sendOrder();
  }

});

async function deleteitem() {
  try{
    const id = generateRandomId(8)
     let res =await fetch(`http://localhost:5002/delete-admin/${id}`,{
      method: 'DELETE'
     })
     let data=await res.json()
     console.log(data)
  }
  catch(err){
    console.log(err)
  }
}
deleteitem()