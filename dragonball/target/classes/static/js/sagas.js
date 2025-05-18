// sagas.js
document.addEventListener("DOMContentLoaded", function() {
    // Variables globales
    const API_URL = "http://localhost:8080/api";
    const contenedorSagas = document.getElementById("contenedorSagas");
    const btnBuscarSaga = document.getElementById("btnBuscarSaga");
    const btnCrearSaga = document.getElementById("btnCrearSaga");
    const modalSaga = document.getElementById("modalSaga");
    const formSaga = document.getElementById("formSaga");
    const btnCancelarSaga = document.getElementById("btnCancelarSaga");
    
    // Elemento para cerrar el modal
    const cerrarModal = document.querySelector("#modalSaga .modal-close");
    
    // Cargar sagas al iniciar la página
    cargarSagas();
    
    // Event Listeners
    btnBuscarSaga.addEventListener("click", buscarSagas);
    btnCrearSaga.addEventListener("click", abrirModalCrearSaga);
    btnCancelarSaga.addEventListener("click", cerrarModalSaga);
    formSaga.addEventListener("submit", guardarSaga);
    
    // Cerrar modal con el botón de cerrar
    cerrarModal.addEventListener("click", function() {
        modalSaga.style.display = "none";
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", function(event) {
        if (event.target === modalSaga) {
            modalSaga.style.display = "none";
        }
    });

    // Agregar fondo temático de Dragon Ball
    const dragonBallBackground = document.createElement("div");
    dragonBallBackground.classList.add("dragon-ball-background");
    document.body.appendChild(dragonBallBackground);
    
    // Esfera del dragón (Easter egg)
    const esferaDragon = document.createElement("div");
    esferaDragon.classList.add("esfera-dragon");
    document.body.appendChild(esferaDragon);
    
    esferaDragon.addEventListener("click", function() {
        // Animación para todas las sagas
        const sagasCards = contenedorSagas.querySelectorAll(".saga-card");
        sagasCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add("power-up-animation");
                setTimeout(() => {
                    card.classList.remove("power-up-animation");
                }, 1000);
            }, index * 100);
        });
    });
    
    // Funciones
    
    // Cargar todas las sagas
    function cargarSagas() {
        fetch(`${API_URL}/sagas/todas`)
            .then(response => response.json())
            .then(data => {
                mostrarSagasEnGrid(data);
            })
            .catch(error => {
                console.error("Error al cargar sagas:", error);
                mostrarMensaje("Error al cargar las sagas. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Buscar sagas con los criterios de búsqueda
    function buscarSagas() {
        const nombre = document.getElementById("nombreSaga").value;
        
        fetch(`${API_URL}/sagas?nombre=${encodeURIComponent(nombre)}`)
            .then(response => response.json())
            .then(data => {
                mostrarSagasEnGrid(data);
            })
            .catch(error => {
                console.error("Error al buscar sagas:", error);
                mostrarMensaje("Error al buscar sagas. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Mostrar sagas en el grid
    function mostrarSagasEnGrid(sagas) {
        contenedorSagas.innerHTML = "";
        
        if (sagas.length === 0) {
            contenedorSagas.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron sagas</p>
                </div>
            `;
            return;
        }
        
        sagas.forEach(saga => {
            const sagaCard = document.createElement("div");
            sagaCard.classList.add("saga-card");
            
            // Colores diferentes según la época de lanzamiento
            let epocaClase = "clasica";
            if (saga.anoLanzamiento >= 2010) {
                epocaClase = "moderna";
            } else if (saga.anoLanzamiento >= 1995) {
                epocaClase = "reciente";
            }
            
            sagaCard.innerHTML = `
                <div class="saga-header epoca-${epocaClase}">
                    <div class="saga-nombre">${saga.nombre}</div>
                    <div class="saga-ano">${saga.anoLanzamiento}</div>
                </div>
                <div class="saga-body">
                    <p class="saga-descripcion">${saga.descripcion}</p>
                    <div class="saga-actions">
                        <button class="btn btn-action btn-edit" data-id="${saga.id}">Editar</button>
                        <button class="btn btn-action btn-delete" data-id="${saga.id}">Eliminar</button>
                    </div>
                </div>
            `;
            
            contenedorSagas.appendChild(sagaCard);
            
            // Event listeners para los botones de acciones
            const btnEditar = sagaCard.querySelector(".btn-edit");
            const btnEliminar = sagaCard.querySelector(".btn-delete");
            
            btnEditar.addEventListener("click", () => editarSaga(saga.id));
            btnEliminar.addEventListener("click", () => eliminarSaga(saga.id));
        });
    }
    
    // Abrir modal para crear una nueva saga
    function abrirModalCrearSaga() {
        document.getElementById("modalTituloSaga").textContent = "Crear Saga";
        document.getElementById("sagaId").value = "";
        formSaga.reset();
        modalSaga.style.display = "block";
    }
    
    // Abrir modal para editar una saga existente
    function editarSaga(id) {
        fetch(`${API_URL}/sagas/${id}`)
            .then(response => response.json())
            .then(saga => {
                document.getElementById("modalTituloSaga").textContent = "Editar Saga";
                document.getElementById("sagaId").value = saga.id;
                document.getElementById("inputNombreSaga").value = saga.nombre;
                document.getElementById("inputDescripcionSaga").value = saga.descripcion;
                document.getElementById("inputAnoLanzamiento").value = saga.anoLanzamiento;
                
                modalSaga.style.display = "block";
            })
            .catch(error => {
                console.error("Error al cargar saga para editar:", error);
                mostrarMensaje("Error al cargar los datos de la saga.", "error");
            });
    }
    
    // Guardar (crear o actualizar) una saga
    function guardarSaga(event) {
        event.preventDefault();
        
        const sagaId = document.getElementById("sagaId").value;
        const esEdicion = sagaId !== "";
        
        const saga = {
            nombre: document.getElementById("inputNombreSaga").value,
            descripcion: document.getElementById("inputDescripcionSaga").value,
            anoLanzamiento: parseInt(document.getElementById("inputAnoLanzamiento").value)
        };
        
        if (esEdicion) {
            saga.id = parseInt(sagaId);
        }
        
        const url = esEdicion ? `${API_URL}/sagas/${sagaId}` : `${API_URL}/sagas`;
        const method = esEdicion ? "PUT" : "POST";
        
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(saga)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al guardar la saga");
            }
            return response.json();
        })
        .then(data => {
            cerrarModalSaga();
            mostrarMensaje(`Saga ${esEdicion ? "actualizada" : "creada"} correctamente`, "success");
            cargarSagas();
        })
        .catch(error => {
            console.error("Error al guardar saga:", error);
            mostrarMensaje(`Error al ${esEdicion ? "actualizar" : "crear"} la saga.`, "error");
        });
    }
    
    // Eliminar una saga
    function eliminarSaga(id) {
        if (confirm("¿Estás seguro de que quieres eliminar esta saga? Esta acción no se puede deshacer.")) {
            fetch(`${API_URL}/sagas/${id}`, {
                method: "DELETE"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al eliminar la saga");
                }
                return response.text();
            })
            .then(data => {
                mostrarMensaje("Saga eliminada correctamente", "success");
                cargarSagas();
            })
            .catch(error => {
                console.error("Error al eliminar saga:", error);
                mostrarMensaje("Error al eliminar la saga.", "error");
            });
        }
    }
    
    // Cerrar el modal de saga
    function cerrarModalSaga() {
        modalSaga.style.display = "none";
        formSaga.reset();
    }
    
    // Mostrar mensaje de éxito o error
    function mostrarMensaje(mensaje, tipo) {
        // Comprobar si ya existe un mensaje y eliminarlo
        const mensajeExistente = document.querySelector(".mensaje-flash");
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
        
        // Crear elemento de mensaje
        const mensajeElement = document.createElement("div");
        mensajeElement.classList.add("mensaje-flash", tipo);
        mensajeElement.textContent = mensaje;
        
        // Añadir al DOM
        document.body.appendChild(mensajeElement);
        
        // Mostrar con animación
        setTimeout(() => {
            mensajeElement.classList.add("mostrar");
        }, 10);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            mensajeElement.classList.remove("mostrar");
            setTimeout(() => {
                mensajeElement.remove();
            }, 300);
        }, 3000);
    }
});