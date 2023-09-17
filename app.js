const inputToDo = document.getElementById("inputToDo");
const textDragDrop = document.getElementById("dragDrop");
const list = document.getElementById("list")
const options = document.getElementById("options")
const allOption = document.querySelectorAll(".option")
const dragDrop = document.getElementById("dragDrop")
const clearCompleted = document.getElementById("clear")
const mode = document.getElementById("mode")
const body = document.querySelector("body")
const newToDo = document.querySelector(".newToDo")

let itemCount = 0; // Variable para rastrear la cantidad de elementos
let todoItems = []; // Array para almacenar los elementos agregados

let draggedItem = null;

// Agregar eventos de arrastrar y soltar a los elementos de la lista
list.addEventListener("dragstart", (e) => {
    draggedItem = e.target;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.innerHTML);
    e.target.style.opacity = "0.1";
});

list.addEventListener("dragover", (e) => {
    e.preventDefault();
});

list.addEventListener("dragenter", (e) => {
    if (e.target.classList.contains("item")) {
        e.target.style.backgroundColor = "var(--BrightBlue)"; // Cambia el color de fondo para indicar el lugar de destino
    }
});

list.addEventListener("dragleave", (e) => {
    if (e.target.classList.contains("item")) {
        e.target.style.backgroundColor = ""; // Restaura el color de fondo
    }
});

list.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("item")) {
        e.target.style.backgroundColor = ""; // Restaura el color de fondo

        // Intercambiar el contenido de los elementos al soltar
        draggedItem.innerHTML = e.target.innerHTML;
        e.target.innerHTML = e.dataTransfer.getData("text/html");

        // Actualizar el orden en el array
        const draggedIndex = todoItems.indexOf(draggedItem);
        const targetIndex = todoItems.indexOf(e.target);
        [todoItems[draggedIndex], todoItems[targetIndex]] = [todoItems[targetIndex], todoItems[draggedIndex]];
    }
});

list.addEventListener("dragend", () => {
    draggedItem = null;
    list.querySelectorAll(".item").forEach((item) => {
        item.style.opacity = 1;
    });
});

// Agregar atributo draggable a los elementos de la lista
todoItems.forEach((item) => {
    item.setAttribute("draggable", true);
});

allOption.forEach(option => {
    option.addEventListener("click", () => {
        allOption.forEach(op => {
            op.classList.remove("selected");
        });
        option.classList.add("selected");
        updateList()
    });
});



function showAllItems() {
    todoItems.forEach(item => {
        item.classList.add("dp-flex")
    });
}

function showActiveItems() {
    // Mostrar solo elementos que no tienen la clase "check"
    todoItems.forEach(item => {
        const circle = item.querySelector('.circle');
        if (!circle.classList.contains("check")) {
            item.classList.add("dp-flex")
            item.classList.remove("dp-none")
        } else {
            item.classList.remove("dp-flex")
            item.classList.add("dp-none")
        }
    });
}

function showCompletedItems() {
    // Mostrar solo elementos que tienen la clase "check"
    todoItems.forEach(item => {
        const circle = item.querySelector('.circle');
        if (circle.classList.contains("check")) {
            item.classList.add("dp-flex")
            item.classList.remove("dp-none")
        } else {
            item.classList.remove("dp-flex")
            item.classList.add("dp-none")
        }
    });
}

clearCompleted.addEventListener("click", () => {
    todoItems = todoItems.filter(item => {
        const circle = item.querySelector('.circle');
        if (circle.classList.contains("check")) {
            item.remove();
            itemCount--;
            return false; // No se incluirá en la nueva lista todoItems
        }
        return true; // Se incluirá en la nueva lista todoItems
    });

    updateItemCount()
    updateList()
    if (todoItems.length == 0) {
        setDisplayList();
    }
})

inputToDo.addEventListener("keydown", function (ev1) {
    if (ev1.key === "Enter") {
        const todoContent = inputToDo.value.trim();
        if (todoContent !== "") {
            createElement(todoContent)
        }
    }
});

list.addEventListener("click", function (ev2) {
    const target = ev2.target;

    if (target.classList.contains("delete")) {
        // El clic se hizo en un botón de eliminación
        const todoItem = target.closest(".item");

        if (todoItem) {
            // Remover el elemento de la lista
            todoItem.remove();

            // Decrementar la cantidad de elementos
            itemCount--;
            // Eliminar el elemento del array
            const index = todoItems.indexOf(todoItem);
            if (index !== -1) {
                todoItems.splice(index, 1);
            }

            // Actualizar el contador de elementos
            updateItemCount();
        }
    } else if (target.classList.contains("circle")) {
        // El clic se hizo en el círculo
        const todoItem = target.closest(".item");

        if (todoItem) {
            // Agregar o quitar la clase "check" en el círculo
            todoItem.querySelector(".circle").classList.toggle("check");
            todoItem.querySelector(".text").classList.toggle("crossOut")
            // Actualizar el contador de elementos
            updateItemCount();
        }
    }
});

// Función para actualizar el contador de elementos
function updateItemCount() {
    setDisplayList()
    const itemsLeft = todoItems.filter((todoItem) => !todoItem.querySelector(".circle").classList.contains("check")).length;
    document.getElementById("amount").textContent = itemsLeft;
}

function setDisplayList() {
    if (itemCount == 0) {
        list.classList.add("dp-none")
        options.classList.add("dp-none")
        dragDrop.classList.add("dp-none")
    } else {
        list.classList.remove("dp-none")
        options.classList.remove("dp-none")
        dragDrop.classList.remove("dp-none")
    }
}

// Función para actualizar checkElements
function updateCheckElements() {
    checkElements = document.querySelectorAll('[id^="check"]');
}

let activeItems = []
let completedItems = []

// Función para agregar o quitar la clase "check" al elemento
function toggleCheck(circle, text) {
    const todoItem = circle.closest(".item");

    if (circle.classList.contains("check")) {
        text.classList.add("crossOut");
        circle.classList.add("check");
        // Mover el elemento de activeItems a completedItems
        if (activeItems.includes(todoItem)) {
            activeItems = activeItems.filter(item => item !== todoItem);
            completedItems.push(todoItem);
        }
    } else {
        text.classList.remove("crossOut");
        circle.classList.remove("check");

        // Mover el elemento de completedItems a activeItems
        if (completedItems.includes(todoItem)) {
            completedItems = completedItems.filter(item => item !== todoItem);
            activeItems.push(todoItem);
        }
    }

    updateItemCount();

    // Aquí puedes llamar a la función para actualizar la lista
    updateList();
}

updateList()

function updateList() {
    const selectedOption = document.querySelector(".option.selected");

    if (selectedOption.classList.contains("active")) {
        showActiveItems();
    } else if (selectedOption.classList.contains("completed")) {
        showCompletedItems();
    } else {
        showAllItems();
    }
}

// Agregar eventos de clic a todos los elementos con la clase "circle"
function addClickEventToCircleElements() {
    todoItems.forEach((todoItem) => {
        const circleElement = todoItem.querySelector('.circle');
        const textElement = todoItem.querySelector('.text')
        
        if (circleElement) {
            circleElement.addEventListener("click", () => {
                toggleCheck(circleElement, textElement);
                updateList()
                updateItemCount();
            });
        }
    });
}

addClickEventToCircleElements();

inputToDo.addEventListener("keydown", function (ev3) {
    if (ev3.key === "Enter") {
        // Resto de tu código para agregar elementos a la lista...

        // Actualizar checkElements después de agregar un elemento
        updateCheckElements();

        // Agregar eventos de clic a los nuevos elementos
        addClickEventToCircleElements();
    }
});

list.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("delete")) {
        // Resto de tu código para eliminar elementos de la lista...

        // Actualizar checkElements después de eliminar un elemento
        updateCheckElements();
    }
});

// Llamar a la función para agregar eventos de clic a los elementos existentes

setDisplayList()

function createElement(todoContent) {
    // Crear un nuevo elemento de lista con el contenido completo del input
    itemCount++; // Incrementar la cantidad de elementos
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.innerHTML = `
     <div class="left">
         <div class="circle"></div>
         <label class="text light-txt">${todoContent}</label>
     </div>
     <img src="/images/icon-cross.svg" alt="" class="delete">
 `;

    // Obtener el elemento .btm
    const btm = document.querySelector(".btm");

    // Insertar el nuevo elemento arriba de .btm
    list.insertBefore(newItem, btm);

    // Agregar el elemento al array
    todoItems.push(newItem);

    // Limpiar el campo de entrada
    inputToDo.value = "";

    if(boolDark){
        modeDark()
    }else{
        updateTextColors()
    }
    
    // Actualizar el contador de elementos
    updateItemCount();
}

function updateTextColors() {
    todoItems.forEach((item) => {
        const textElements = item.querySelectorAll('.text');
        textElements.forEach((textElement) => {
            if(boolDark){
                textElement.classList.remove('light-txt');
            }else{
                textElement.classList.add('light-txt');
            }
        });
    });
}

let boolDark = true

mode.addEventListener("click", () => {
    const currentSrc = mode.src;
    if (currentSrc.endsWith("/images/icon-sun.svg")) {
        mode.src = "/images/icon-moon.svg";
        boolDark = false
    } else {
        boolDark = true
        mode.src = "/images/icon-sun.svg";
    }
    modeDark();
});

function modeDark() {
    if(boolDark){
        body.classList.remove('bgLight-desk')
        body.classList.remove('light');
        newToDo.classList.remove('light-bg');
        list.classList.remove('light-bg');
        options.classList.remove('light-bg')
        allOption.forEach(op => {
            op.classList.remove('light-opy')
        })
    }else{
        body.classList.add('bgLight-desk')
        body.classList.add('light');
        newToDo.classList.add('light-bg');
        list.classList.add('light-bg');
        options.classList.add('light-bg')
        allOption.forEach(op => {
            op.classList.add('light-opy')
        })
    }
    updateTextColors();
}

// Función para mover elementos dentro de la clase btm
function moveOptionsInsideBtm() {
    const btm = document.getElementById('btm');
    const options = document.getElementById('options');
    btm.appendChild(options);
    btm.appendChild(clearCompleted)
}

// Función para restaurar la estructura original
function restoreOriginalStructure() {
    const main = document.getElementById('main');
    const options = document.getElementById('options');
    main.appendChild(options);
    main.appendChild(dragDrop)
}

// Verificar el ancho de la pantalla al cargar la página
window.addEventListener('load', () => {
    if (window.innerWidth >= 768) {
        options.classList.add('pad-tpbm')
        moveOptionsInsideBtm();
    }
});

// Verificar el ancho de la pantalla cuando cambia su tamaño
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        options.classList.add('pad-tpbm')
        moveOptionsInsideBtm();
    } else {
        options.classList.remove('pad-tpbm')
        restoreOriginalStructure();
    }
})