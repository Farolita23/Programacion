// sagas.js
document.addEventListener("DOMContentLoaded", function() {
    // Variables globales
    const API_URL = "http://localhost:9999/api";
    const contenedorSagas = document.getElementById("contenedorSagas");
    const btnBuscarSaga = document.getElementById("btnBuscarSaga");
    const btnCrearSaga = document.getElementById("btnCrearSaga");
    const modalSaga = document.getElementById("modalSaga");
    const formSaga = document.getElementById("formSaga");
    const btnCancelarSaga = document.getElementById("btnCancelarSaga");
    const btnAgregarPersonaje = document.getElementById("btnAgregarPersonaje");
    
    // Nueva variable para almacenar los personajes seleccionados
    let personajesSeleccionados = [];
    
    // Elemento para cerrar el modal
    const cerrarModal = document.querySelector("#modalSaga .modal-close");
    
    // Cargar sagas al iniciar la página
    cargarSagas();
    
    // Event Listeners
    btnBuscarSaga.addEventListener("click", buscarSagas);
    btnCrearSaga.addEventListener("click", abrirModalCrearSaga);
    btnCancelarSaga.addEventListener("click", cerrarModalSaga);
    formSaga.addEventListener("submit", guardarSaga);
    
    // Evento para agregar personajes
    btnAgregarPersonaje.addEventListener("click", agregarPersonaje);
    
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
    
    // Función para reintentar fetch con un número máximo de intentos
    async function fetchConReintentos(url, opciones = {}, maxIntentos = 3) {
        let error;
        for (let intento = 1; intento <= maxIntentos; intento++) {
            try {
                const respuesta = await fetch(url, opciones);
                if (!respuesta.ok) {
                    throw new Error(`Error en la solicitud: ${respuesta.status} ${respuesta.statusText}`);
                }
                return await respuesta.json();
            } catch (err) {
                console.warn(`Intento ${intento} fallido para ${url}:`, err);
                error = err;
                // Pequeña pausa antes del siguiente intento
                if (intento < maxIntentos) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms de espera
                }
            }
        }
        throw error; // Si llegamos aquí, todos los intentos fallaron
    }
    
    // Cargar todas las sagas
    function cargarSagas() {
        fetchConReintentos(`${API_URL}/sagas/todas`)
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
        
        fetchConReintentos(`${API_URL}/sagas?nombre=${encodeURIComponent(nombre)}`)
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
                    <div class="personajes-saga">
                        <h4>Personajes</h4>
                        <div class="personajes-lista" id="personajesSaga-${saga.id}">
                            <p class="loading-text">Cargando personajes...</p>
                        </div>
                    </div>
                    <div class="saga-actions">
                        <button class="btn btn-action btn-edit" data-id="${saga.id}">Editar</button>
                        <button class="btn btn-action btn-delete" data-id="${saga.id}">Eliminar</button>
                    </div>
                </div>
            `;
            
            contenedorSagas.appendChild(sagaCard);
            
            // Cargar personajes de esta saga
            cargarPersonajesParaMostrar(saga.id);
            
            // Event listeners para los botones de acciones
            const btnEditar = sagaCard.querySelector(".btn-edit");
            const btnEliminar = sagaCard.querySelector(".btn-delete");
            
            btnEditar.addEventListener("click", () => editarSaga(saga.id));
            btnEliminar.addEventListener("click", () => eliminarSaga(saga.id));
        });
    }
    
    // Nueva función mejorada: Cargar personajes para mostrar en la tarjeta de saga
    function cargarPersonajesParaMostrar(sagaId) {
        const contenedorPersonajes = document.getElementById(`personajesSaga-${sagaId}`);
        if (!contenedorPersonajes) {
            console.error(`No se encontró el contenedor para la saga ${sagaId}`);
            return;
        }
        
        contenedorPersonajes.innerHTML = '<p class="loading-text">Cargando personajes...</p>';
        
        // Usar la función de reintentos
        fetchConReintentos(`${API_URL}/sagas/${sagaId}/personajes`)
            .then(personajes => {
                contenedorPersonajes.innerHTML = "";
                
                if (!personajes || personajes.length === 0) {
                    contenedorPersonajes.innerHTML = `<p class="no-personajes">No hay personajes en esta saga</p>`;
                    return;
                }
                
                const ul = document.createElement("ul");
                ul.className = "personajes-chips";
                
                personajes.forEach(personaje => {
                    const li = document.createElement("li");
                    li.className = "personaje-chip";
                    li.innerHTML = `
                        <img src="${getImageUrl(personaje.imagenUrl)}" alt="${personaje.nombre}" class="personaje-mini-img">
                        <span>${personaje.nombre}</span>
                    `;
                    ul.appendChild(li);
                });
                
                contenedorPersonajes.appendChild(ul);
            })
            .catch(error => {
                console.error(`Error al cargar personajes de la saga ${sagaId}:`, error);
                contenedorPersonajes.innerHTML = `<p class="error-text">Error al cargar personajes: ${error.message}</p>`;
            });
    }
    
    // Función auxiliar para manejar URLs de imágenes
    function getImageUrl(url) {
        // Comprobar si es una URL externa
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            return url;
        } else if (url) {
            // Es una ruta local
            return `images/${url}`;
        } else {
            // URL no proporcionada, usar imagen por defecto
            return 'images/default-personaje.png';
        }
    }
    
    // Nueva función mejorada: Cargar personajes para el selector
    function cargarPersonajesParaSelect() {
        fetchConReintentos(`${API_URL}/personajes/todos`)
            .then(data => {
                const select = document.getElementById("selectPersonajes");
                // Limpiar opciones existentes excepto la primera
                while (select.options.length > 1) {
                    select.remove(1);
                }
                
                // Agregar personajes como opciones
                data.forEach(personaje => {
                    const option = document.createElement("option");
                    option.value = personaje.id;
                    option.textContent = personaje.nombre;
                    select.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Error al cargar personajes para el selector:", error);
                mostrarMensaje("Error al cargar la lista de personajes: " + error.message, "error");
            });
    }
    
    // Nueva función: Agregar personaje a la lista de seleccionados
    function agregarPersonaje() {
        const select = document.getElementById("selectPersonajes");
        const personajeId = parseInt(select.value);
        
        if (!personajeId) {
            mostrarMensaje("Selecciona un personaje primero", "error");
            return; // No hay personaje seleccionado
        }
        
        // Verificar que no esté ya en la lista
        if (personajesSeleccionados.some(p => p.id === personajeId)) {
            mostrarMensaje("Este personaje ya está en la lista", "error");
            return;
        }
        
        // Mostrar mensaje de carga
        mostrarMensaje("Agregando personaje...", "info");
        
        // Obtener detalles del personaje con reintentos
        fetchConReintentos(`${API_URL}/personajes/${personajeId}`)
            .then(personaje => {
                // Agregar a la lista de seleccionados
                personajesSeleccionados.push({
                    id: personaje.id,
                    nombre: personaje.nombre,
                    imagenUrl: personaje.imagenUrl
                });
                
                // Actualizar la lista visual
                actualizarListaPersonajesSeleccionados();
                
                // Mostrar mensaje de éxito
                mostrarMensaje(`Personaje ${personaje.nombre} agregado`, "success");
                
                // Resetear selector
                select.value = "";
            })
            .catch(error => {
                console.error("Error al obtener detalles del personaje:", error);
                mostrarMensaje("Error al agregar el personaje: " + error.message, "error");
            });
    }
    
    // Nueva función: Actualizar la lista visual de personajes seleccionados
    function actualizarListaPersonajesSeleccionados() {
        const lista = document.getElementById("selectedPersonajesList");
        if (!lista) {
            console.error("No se encontró el elemento selectedPersonajesList");
            return;
        }
        
        lista.innerHTML = "";
        
        if (personajesSeleccionados.length === 0) {
            lista.innerHTML = `<li class="no-personajes-mensaje">No hay personajes seleccionados</li>`;
            return;
        }
        
        personajesSeleccionados.forEach(personaje => {
            const li = document.createElement("li");
            li.className = "selected-personaje-item";
            li.innerHTML = `
                <div class="personaje-info">
                    <img src="${getImageUrl(personaje.imagenUrl)}" class="personaje-mini-img" alt="${personaje.nombre}">
                    <span>${personaje.nombre}</span>
                </div>
                <button type="button" class="btn-quitar-personaje" data-id="${personaje.id}">&times;</button>
            `;
            lista.appendChild(li);
            
            // Agregar event listener al botón de quitar
            li.querySelector(".btn-quitar-personaje").addEventListener("click", function() {
                const id = parseInt(this.getAttribute("data-id"));
                quitarPersonajeSeleccionado(id);
            });
        });
    }
    
    // Nueva función: Quitar personaje de la lista de seleccionados
    function quitarPersonajeSeleccionado(id) {
        personajesSeleccionados = personajesSeleccionados.filter(p => p.id !== id);
        actualizarListaPersonajesSeleccionados();
        mostrarMensaje("Personaje eliminado de la lista", "info");
    }
    
    // Abrir modal para crear una nueva saga
    function abrirModalCrearSaga() {
        document.getElementById("modalTituloSaga").textContent = "Crear Saga";
        document.getElementById("sagaId").value = "";
        formSaga.reset();
        personajesSeleccionados = []; // Resetear lista de personajes
        actualizarListaPersonajesSeleccionados();
        
        // Mostrar mensaje de carga
        mostrarMensaje("Cargando lista de personajes...", "info");
        
        cargarPersonajesParaSelect(); // Cargar opciones del selector
        modalSaga.style.display = "block";
    }
    
    // Abrir modal para editar una saga existente con reintentos
    function editarSaga(id) {
        console.log("Editando saga con ID:", id);
        
        // Mostrar un mensaje de carga
        mostrarMensaje("Cargando datos de la saga...", "info");
        
        // Establecer un timeout más largo para las solicitudes fetch
        const controlador = new AbortController();
        const timeoutId = setTimeout(() => controlador.abort(), 10000); // 10 segundos de timeout
        const opciones = { signal: controlador.signal };
        
        // Cargar datos de la saga y sus personajes con reintentos
        Promise.all([
            fetchConReintentos(`${API_URL}/sagas/${id}`, opciones),
            fetchConReintentos(`${API_URL}/sagas/${id}/personajes`, opciones),
            fetchConReintentos(`${API_URL}/personajes/todos`, opciones)
        ])
        .then(([saga, personajesSaga, todosPersonajes]) => {
            clearTimeout(timeoutId); // Limpiar el timeout
            
            console.log("Saga:", saga);
            console.log("Personajes de la saga:", personajesSaga);
            
            // Configurar el formulario con los datos de la saga
            document.getElementById("modalTituloSaga").textContent = "Editar Saga";
            document.getElementById("sagaId").value = saga.id;
            document.getElementById("inputNombreSaga").value = saga.nombre;
            document.getElementById("inputDescripcionSaga").value = saga.descripcion;
            document.getElementById("inputAnoLanzamiento").value = saga.anoLanzamiento;
            
            // Limpiar y cargar selector de personajes
            const select = document.getElementById("selectPersonajes");
            select.innerHTML = '<option value="">-- Seleccionar personaje --</option>';
            
            todosPersonajes.forEach(personaje => {
                const option = document.createElement("option");
                option.value = personaje.id;
                option.textContent = personaje.nombre;
                select.appendChild(option);
            });
            
            // Cargar personajes asociados a la saga (usar un array vacío si es null)
            personajesSeleccionados = (personajesSaga || []).map(p => ({
                id: p.id,
                nombre: p.nombre,
                imagenUrl: p.imagenUrl
            }));
            
            // Actualizar lista visual de personajes seleccionados
            actualizarListaPersonajesSeleccionados();
            
            // Mostrar modal
            modalSaga.style.display = "block";
            
            // Mostrar mensaje de éxito
            mostrarMensaje("Saga cargada correctamente", "success");
        })
        .catch(error => {
            clearTimeout(timeoutId); // Limpiar el timeout
            console.error("Error al cargar saga para editar:", error);
            mostrarMensaje("Error al cargar los datos de la saga: " + error.message, "error");
            
            // Auto-reintento después de un breve retraso
            setTimeout(() => {
                console.log("Reintentando automáticamente...");
                editarSaga(id);
            }, 1000);
        });
    }
    
    // Función mejorada para guardar (crear o actualizar) una saga con mejor manejo de errores
function guardarSaga(event) {
    event.preventDefault();
    
    // Mostrar mensaje de carga
    mostrarMensaje("Guardando saga...", "info");
    
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
    
    // Variable para guardar el ID de la saga (sea nueva o existente)
    let idSagaFinal;
    
    // Primero guardar la información básica de la saga
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(saga)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || `Error ${response.status}: ${response.statusText}`);
            });
        }
        return response.json();
    })
    .then(sagaGuardada => {
        // Guardar el ID para usarlo en el siguiente paso
        idSagaFinal = sagaGuardada.id || sagaId;
        
        // Preparar los IDs de los personajes
        const personajesIds = personajesSeleccionados.map(p => p.id);
        
        console.log("Guardando personajes para la saga:", idSagaFinal);
        console.log("IDs de personajes:", personajesIds);
        
        // Ahora guardar la relación con los personajes
        return fetch(`${API_URL}/sagas/${idSagaFinal}/personajes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personajesIds)
        });
    })
    .then(response => {
        // Verificar si hubo un error en la asignación de personajes
        if (!response.ok) {
            // Aquí capturamos el error pero NO lo lanzamos como excepción
            // ya que es posible que la saga se haya guardado correctamente
            console.warn(`Error al asignar personajes: ${response.status} ${response.statusText}`);
            
            // Verificar qué ocurrió consultando la saga nuevamente
            return fetch(`${API_URL}/sagas/${idSagaFinal}/personajes`)
                .then(checkResponse => {
                    if (!checkResponse.ok) {
                        // Error en la verificación, considerar una advertencia
                        return { 
                            success: true, 
                            warning: "Se guardó la saga pero hubo un problema al asignar personajes" 
                        };
                    }
                    return checkResponse.json().then(personajes => {
                        // Comparar si los personajes guardados coinciden con los seleccionados
                        const guardadosIds = new Set(personajes.map(p => p.id));
                        const seleccionadosIds = new Set(personajesSeleccionados.map(p => p.id));
                        
                        // Si al menos algunos personajes se guardaron, consideramos éxito parcial
                        if (guardadosIds.size > 0) {
                            return { 
                                success: true, 
                                warning: "Algunos personajes pueden no haberse asignado correctamente" 
                            };
                        }
                        
                        // Si no hay personajes guardados, pero deberíamos tener algunos
                        if (seleccionadosIds.size > 0) {
                            return { 
                                success: true, 
                                warning: "Se guardó la saga pero los personajes no se asignaron" 
                            };
                        }
                        
                        // Si no teníamos personajes seleccionados, todo está bien
                        return { success: true };
                    });
                })
                .catch(checkError => {
                    // Error al verificar, consideramos que algo salió mal
                    // pero la saga principal debería estar guardada
                    return { 
                        success: true,
                        warning: "La saga se guardó pero hubo un problema al verificar personajes" 
                    };
                });
        }
        
        // Si la respuesta de asignación de personajes fue exitosa
        return { success: true };
    })
    .then(result => {
        cerrarModalSaga();
        
        if (result.warning) {
            // Si hay una advertencia, mostrarla pero consideramos la operación exitosa
            mostrarMensaje(`Saga ${esEdicion ? "actualizada" : "creada"} con advertencia: ${result.warning}`, "warning");
        } else {
            // Todo perfecto
            mostrarMensaje(`Saga ${esEdicion ? "actualizada" : "creada"} correctamente`, "success");
        }
        
        // Dar un pequeño tiempo antes de recargar las sagas
        setTimeout(() => {
            cargarSagas(); // Recargar todas las sagas para mostrar los cambios
        }, 500);
    })
    .catch(error => {
        console.error("Error al guardar saga:", error);
        
        // A pesar del error, verificamos si la saga se guardó
        const idAVerificar = idSagaFinal || sagaId;
        
        if (idAVerificar) {
            fetch(`${API_URL}/sagas/${idAVerificar}`)
                .then(checkResponse => {
                    if (checkResponse.ok) {
                        // La saga existe, así que algo se guardó correctamente
                        cerrarModalSaga();
                        mostrarMensaje(`Saga guardada pero hubo un error de comunicación. Se recargarán los datos.`, "warning");
                        setTimeout(() => {
                            cargarSagas();
                        }, 500);
                    } else {
                        // La saga no existe, mostrar el error normal
                        mostrarMensaje(`Error al ${esEdicion ? "actualizar" : "crear"} la saga: ${error.message}`, "error");
                    }
                })
                .catch(checkError => {
                    // Error al verificar, asumimos que algo salió mal
                    mostrarMensaje(`Error al ${esEdicion ? "actualizar" : "crear"} la saga: ${error.message}`, "error");
                });
        } else {
            // No tenemos un ID para verificar, mostrar error normal
            mostrarMensaje(`Error al ${esEdicion ? "actualizar" : "crear"} la saga: ${error.message}`, "error");
        }
    });
}
    
    // Función mejorada para eliminar una saga con mejor manejo de errores
function eliminarSaga(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta saga? Esta acción no se puede deshacer.")) {
        // Mostrar mensaje de carga
        mostrarMensaje("Eliminando saga...", "info");
        
        fetch(`${API_URL}/sagas/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                // Si tenemos un error 404, podría significar que ya se eliminó
                if (response.status === 404) {
                    return { success: true, message: "Saga no encontrada (posiblemente ya eliminada)" };
                }
                
                // Para otros errores, intentamos extraer el mensaje
                return response.text().then(text => {
                    throw new Error(text || `Error ${response.status}: ${response.statusText}`);
                });
            }
            return { success: true };
        })
        .then(result => {
            if (result.message) {
                mostrarMensaje(result.message, "warning");
            } else {
                mostrarMensaje("Saga eliminada correctamente", "success");
            }
            
            // Dar un pequeño tiempo antes de recargar las sagas
            setTimeout(() => {
                cargarSagas();
            }, 500);
        })
        .catch(error => {
            console.error("Error al eliminar saga:", error);
            
            // A pesar del error, verificamos si la saga sigue existiendo
            fetch(`${API_URL}/sagas/${id}`)
                .then(checkResponse => {
                    if (!checkResponse.ok && checkResponse.status === 404) {
                        // La saga ya no existe, así que probablemente se eliminó correctamente
                        mostrarMensaje("Saga eliminada correctamente", "success");
                        setTimeout(() => {
                            cargarSagas();
                        }, 500);
                    } else {
                        // La saga sigue existiendo, mostrar el error normal
                        mostrarMensaje("Error al eliminar la saga: " + error.message, "error");
                    }
                })
                .catch(checkError => {
                    // Error al verificar, asumimos que algo salió mal
                    // Pero aún así, actualizamos la lista para ver si realmente se eliminó
                    mostrarMensaje("Error al verificar el estado de la saga. Actualizando datos...", "warning");
                    setTimeout(() => {
                        cargarSagas();
                    }, 500);
                });
        });
    }
}
    
    // Cerrar el modal de saga
    function cerrarModalSaga() {
        modalSaga.style.display = "none";
        formSaga.reset();
        personajesSeleccionados = []; // Limpiar lista de personajes
    }
    
    // Función mejorada para mostrar mensajes con soporte para tipo "warning"
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
    
    // Determinar la duración del mensaje basado en su tipo
    let duracion = 3000; // 3 segundos por defecto
    if (tipo === "error") {
        duracion = 5000; // 5 segundos para errores
    } else if (tipo === "info") {
        duracion = 2000; // 2 segundos para info
    } else if (tipo === "warning") {
        duracion = 4000; // 4 segundos para advertencias
    }
    
    // Eliminar después del tiempo determinado
    setTimeout(() => {
        mensajeElement.classList.remove("mostrar");
        setTimeout(() => {
            mensajeElement.remove();
        }, 300);
    }, duracion);
}
});