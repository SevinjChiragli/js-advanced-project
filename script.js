let list = document.getElementById("list");
if (localStorage.getItem("bag")) {
} else {
  localStorage.setItem("bag", "[]");
}

const showList = (arr) => {
  let container = document.createElement("div");
  container.className = "photoContainer";
  arr.forEach((item) => {
    let li = document.createElement("li");
    li.innerHTML = `
    <div>
     <img class="picture" src="${item.url}" alt="" />
        <div class="iconsTatran">
        <button id='addToWishList'><img src=".//icons/add to cart.png" alt="" /></button>
          <img src=".//icons/heart_outline.png" alt="" />
        </div>
    <p>${item.product_name}</p>
    <p class="definition">${item.product_description}</p>
    <p class="price">${item.product_price}</p>
    </div>`;
    li.querySelector("#addToWishList").addEventListener("click", () => {
      let jsbag = JSON.parse(localStorage.getItem("bag"));
      if (jsbag.some((item1) => item1.product_name == item.product_name)) {
        alert("данный товар находится в корзине");
      } else {
        jsbag.push(item);
      }
      localStorage.setItem("bag", JSON.stringify(jsbag));
    });
    container.appendChild(li);
  });
  list.appendChild(container);
};
fetch(`http://localhost:5002/goods`, {
  method: "GET",
})
  .then((res) => res.json())
  .then((data) => {
    showList(data);
    select.addEventListener("change", () => {
      list.innerHTML = "";
      const order = select.value;
      data.sort((a, b) => {
        if (order === "low") {
          return a.product_price - b.product_price;
        } else {
          return b.product_price - a.product_price;
        }
      });
      showList(data);
    });
  });
