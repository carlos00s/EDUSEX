const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**

 * @param {string} nombre 
 * @param {string} apellido 
 * @param {string} correo
 * @param {string} telefono
 */
const saveTask = (nombre, apellido, correo, telefono) =>
  db.collection("tasks").doc().set({
    nombre,
    apellido,
    correo,
    telefono
  });

const getTasks = () => db.collection("tasks").get();

const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const getTask = (id) => db.collection("tasks").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
    <p class="h5">${task.nombre}</p>
    <p>${task.apellido}</p>
    <p>${task.correo}</p>
    <p>${task.telefono}</p>

    <div>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Delete
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
        🖉 Edit
      </button>
    </div>
  </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-nombre"].value = task.nombre;
          taskForm["task-apellido"].value = task.apellido;
          taskForm["task-correo"].value = task.correo;
          taskForm["task-telefono"].value = task.telefono;

          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = taskForm["task-nombre"];
  const apellido = taskForm["task-apellido"];
  const correo = taskForm["task-correo"];
  const telefono = taskForm["task-telefono"];
  try {
    if (!editStatus) {
      await saveTask(nombre.value, apellido.value, correo.value, telefono.value);
    } else {
      await updateTask(id, {
        nombre: nombre.value,
        apellido: apellido.value,
        correo: correo.value,
        telefono: telefono.value
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    nombre.focus();
  } catch (error) {
    console.log(error);
  }
});
