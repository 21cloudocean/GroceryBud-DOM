// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** EVENT LISTENERS **********
//submit form
form.addEventListener("submit", addItem);
//clear items
clearBtn.addEventListener("click", clearItems);
//load items
window.addEventListener("DOMContentLoaded", setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  //用日期转换为string，得到的字符串unique
  const id = new Date().getTime().toString();
  //   if(value !== '' && editFlag === false){ }
  if (value && !editFlag) {
    //在list中创建item
    const element = document.createElement("article");
    //添加class
    element.classList.add("grocery-item");
    //添加id
    const attribute = document.createAttribute("data-id");
    attribute.value = id;
    element.setAttributeNode(attribute);
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
    //在这里access btns才有效。
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
    // append child（这一步用来display，只有放在HTML中才能看见）
    list.appendChild(element);
    //display alert
    displayAlert("Item added to the list", "success");
    //show container（添加解除hidden的class）
    container.classList.add("show-container");
    //add to local sotrge
    addToLocalStorage(id, value);
    //set back to default
    setBackToDefault();
  }
  //   else if(value !=='' && editFlag === true){}
  else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    //edit local sotrage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}
//display alert：text用来写显示内容，action用来控制class名，从而显示不同颜色
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  //让alert持续一段时间后自己关掉
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  //如果有item，则清空：清空办法，用forEach一个一个从parent中删除
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  //清空后没有了item，让container恢复没有提交任何item的状态，即hidden
  container.classList.remove("show-container");
  //alert提示删除成功
  displayAlert("empty list", "success");
  //操作页面初始化
  setBackToDefault();
  //将list从localStorage中删除
  localStorage.removeItem("list");
}
// delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  //如果删空了，隐藏container
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  //操作后用alert对用户进行提示
  displayAlert("item removed", "success");
  //初始化
  setBackToDefault();
  //remove from local storage
  removeFromLocalSotrage(id);
}
//edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //set edit item：指<p></p>
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}
//set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  // const grocery = {id:id,value:value};
  const grocery = { id, value };
  let items = getLocalStorage();
  console.log(items);
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalSotrage(id) {
  //从localStorage中读取现有array，凭ID将要删除的item筛掉，返回新array
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  //将新array存入localStorage
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  //editID和建立item时存入的data-id是一样的
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    //创建list中的item
    items.forEach(function (item) {
      const element = document.createElement("article");
      //添加class
      element.classList.add("grocery-item");
      //添加id
      const attribute = document.createAttribute("data-id");
      attribute.value = item.id;
      element.setAttributeNode(attribute);
      element.innerHTML = `<p class="title">${item.value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
      //在这里access btns才有效。
      const deleteBtn = element.querySelector(".delete-btn");
      const editBtn = element.querySelector(".edit-btn");
      deleteBtn.addEventListener("click", deleteItem);
      editBtn.addEventListener("click", editItem);
      // append child（这一步用来display，只有放在HTML中才能看见）
      list.appendChild(element);
      //show container（添加解除hidden的class）
      container.classList.add("show-container");
    });
  }
}
/***或将创建element单独做个function，哪里要用就在哪invoke***/
// function creatListItem(id,value){
//       const element = document.createElement("article");
//       //添加class
//       element.classList.add("grocery-item");
//       //添加id
//       const attribute = document.createAttribute("data-id");
//       attribute.value = id;
//       element.setAttributeNode(attribute);
//       element.innerHTML = `<p class="title">${value}</p>
//             <div class="btn-container">
//               <button type="button" class="edit-btn">
//                 <i class="fas fa-edit"></i>
//               </button>
//               <button type="button" class="delete-btn">
//                 <i class="fas fa-trash"></i>
//               </button>
//             </div>`;
//       //在这里access btns才有效。
//       const deleteBtn = element.querySelector(".delete-btn");
//       const editBtn = element.querySelector(".edit-btn");
//       deleteBtn.addEventListener("click", deleteItem);
//       editBtn.addEventListener("click", editItem);
//       // append child（这一步用来display，只有放在HTML中才能看见）
//       list.appendChild(element);
// }
