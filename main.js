let plus = document.getElementById("plus");
let foodList = [
  { name: "همبرگرمعمولی", price: 8000, img: "hamburger.png" },
  { name: "همبرگرمعمولی با قارچ و پنیر", price: 10000, img: "hamburger.png" },
  { name: "سیب زمینی سرخ کرده ویژه", price: 25000, img: "french_fries.png" },
  { name: "نوشابه رژیمی ", price: 6000, img: "soda.png" },
  { name: "سالاد فصل", price: 6000, img: "salad.png" },
  { name: "همبرگرمخصوص", price: 10000, img: "hamburger.png" },
  { name: "همبرگر مخصوص با قارچ و پنیر", price: 20000, img: "hamburger.png" },
  { name: "سیب زمینی سرخ کرده", price: 10000, img: "french_fries.png" },
  { name: "نوشابه", price: 5000, img: "soda.png" },
  { name: "سالاد سزار", price: 25000, img: "ceasar.png" },
];
/////////////////////////////////////////////////////////////////////////////////////////////
function generateRow(food, index) {
  return `
    <div class="col-12 col-lg-6 ">
      <div class="card" data-index="${index}">
        <img src="${food.img}" class="imgfood" />
        <div class="text">
          <b>${food.name}</b>
          <p>${food.price} تومان</p>
          <div class="parentspaan">
            <div class="span">
              <p class="red1" data-action="increase">+</p>
              <p id="quantity-${index}" class="gray">0</p>
              <p class="red2" data-action="decrease">-</p>
            </div>
            <div class="front">
              <p id="item-total-${index}">0 تومان</p>
            </div>
          </div>
        </div>
      </div>
  </div>`;
}
//////////////////////////////////////////////////////////////////////////////////////////////
let foodsHTML = foodList.map((el, index) => generateRow(el, index));
plus.innerHTML = foodsHTML.join("");

let savedQuantities = JSON.parse(localStorage.getItem("quantities")) || {};

let totalAmount = 0;
let totalFee = 0;
let service = 400;
let totalPayable = 0;

function updateDisplay() {
  foodList.forEach((food, index) => {
    const quantity = savedQuantities[index] || 0;
    document.getElementById(`quantity-${index}`).innerText = quantity;
    const itemTotal = quantity * food.price;
    document.getElementById(
      `item-total-${index}`
    ).innerText = `${itemTotal} تومان`;
  });
  updateTotalAmount();
  addFee();
  amountPayable();
}

updateDisplay();

document.getElementById("catch").addEventListener("click", (event) => {
  const target = event.target;
  console.log(target);
  console.dir(target);
  const action = target.getAttribute("data-action");
  const card = target.closest(".card");

  if (card && action) {
    const index = card.getAttribute("data-index");
    const quantityElement = document.getElementById(`quantity-${index}`);
    const itemTotalElement = document.getElementById(`item-total-${index}`);
    let quantity = parseInt(quantityElement.innerText);

    if (action === "increase") {
      quantity++;
    } else if (action === "decrease" && quantity > 0) {
      quantity--;
    }

    quantityElement.innerText = quantity;
    const itemTotal = quantity * foodList[index].price;
    itemTotalElement.innerText = `${itemTotal} تومان`;

    savedQuantities[index] = quantity;
    localStorage.setItem("quantities", JSON.stringify(savedQuantities));

    updateTotalAmount();
    addFee();
    amountPayable();
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////
function updateTotalAmount() {
  amountPayable;
  totalAmount = foodList.reduce((sum, food, index) => {
    const quantity = parseInt(
      document.getElementById(`quantity-${index}`).innerText
    );
    return sum + quantity * food.price;
  }, 0);

  document.getElementById("Total-orders").innerText = `${totalAmount} تومان`;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
function addFee() {
  totalFee = foodList.reduce((sum, food, index) => {
    const quantity = parseInt(
      document.getElementById(`quantity-${index}`).innerText
    );
    return sum + quantity * service;
  }, 0);
  document.getElementById("service").innerText = `${totalFee} تومان`;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function amountPayable() {
  totalPayable = totalFee + totalAmount;
  document.getElementById("amount-payable").innerText = `${totalPayable} تومان`;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
let registration = document.getElementById("registration");
let modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
let btnmodal = document.querySelector(".modalbtn");
btnmodal.onclick = function () {
  modal.style.display = "none";
};
span.onclick = function () {
  modal.style.display = "none";
};
registration.addEventListener("click", submitOrder);
function submitOrder() {
  modal.style.display = "block";
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
let listDiscount = [
  { name: "gold", discount: "30 درصد" },
  { name: "silver", discount: "20 درصد" },
  { name: "bronze", discount: "10 درصد" },
];
let codeDiscount = document.getElementById("code-discount");
let discount = document.getElementById("discount");

let usedDiscounts = JSON.parse(localStorage.getItem("usedDiscounts")) || [];

discount.addEventListener("click", submitDiscount);
function submitDiscount() {
  let input = document.querySelector(".input").value;

  if (usedDiscounts.includes(input)) {
    codeDiscount.innerText = "این کد تخفیف قبلاً استفاده شده است.";
    return;
  }

  let validDiscount = listDiscount.find((el) => el.name === input);
  if (validDiscount) {
    codeDiscount.innerText = validDiscount.discount;
    let price = +validDiscount.discount.split("درصد")[0];
    let discountAmount = (totalPayable * price) / 100;
    totalPayable = totalPayable - discountAmount;
    document.getElementById(
      "amount-payable"
    ).innerText = `${totalPayable} تومان`;

    usedDiscounts.push(input);
    localStorage.setItem("usedDiscounts", JSON.stringify(usedDiscounts));

    localStorage.setItem("totalPayable", totalPayable);
  } else {
    codeDiscount.innerText = "کد تخفیف وارد شده معتبر نیست.";
  }
}

let savedTotalPayable = localStorage.getItem("totalPayable");
if (savedTotalPayable) {
  totalPayable = parseInt(savedTotalPayable);
  document.getElementById("amount-payable").innerText = `${totalPayable} تومان`;
}

