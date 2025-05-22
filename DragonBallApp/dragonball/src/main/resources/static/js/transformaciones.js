// transformaciones.js
document.addEventListener("DOMContentLoaded", function() {
    // Variables globales
    const API_URL = "http://localhost:9999/api";
    const contenedorTransformaciones = document.getElementById("contenedorTransformaciones");
    const btnBuscarTransformacion = document.getElementById("btnBuscarTransformacion");
    const btnCrearTransformacion = document.getElementById("btnCrearTransformacion");
    const modalTransformacion = document.getElementById("modalTransformacion");
    const formTransformacion = document.getElementById("formTransformacion");
    const btnCancelarTransformacion = document.getElementById("btnCancelarTransformacion");
    
    // Elemento para cerrar el modal
    const cerrarModal = document.querySelector("#modalTransformacion .modal-close");
    
    // Cargar transformaciones al iniciar la página
    cargarTransformaciones();
    
    // Event Listeners
    btnBuscarTransformacion.addEventListener("click", buscarTransformaciones);
    btnCrearTransformacion.addEventListener("click", abrirModalCrearTransformacion);
    btnCancelarTransformacion.addEventListener("click", cerrarModalTransformacion);
    formTransformacion.addEventListener("submit", guardarTransformacion);
    
    // Cerrar modal con el botón de cerrar
    cerrarModal.addEventListener("click", function() {
        modalTransformacion.style.display = "none";
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", function(event) {
        if (event.target === modalTransformacion) {
            modalTransformacion.style.display = "none";
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
        // Animación para todas las transformaciones
        const transformacionesCards = contenedorTransformaciones.querySelectorAll(".transformacion-card");
        transformacionesCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add("power-up-animation");
                setTimeout(() => {
                    card.classList.remove("power-up-animation");
                }, 1000);
            }, index * 100);
        });
    });
    
    // Funciones
    
    // Función mejorada para reintentar fetch con mejor manejo de errores
    async function fetchConReintentos(url, opciones = {}, maxIntentos = 3) {
        let ultimoError;
        
        for (let intento = 1; intento <= maxIntentos; intento++) {
            try {
                const respuesta = await fetch(url, opciones);
                
                // Manejo especial para DELETE con error 500
                if (!respuesta.ok && opciones.method === "DELETE" && respuesta.status === 500) {
                    try {
                        const checkResponse = await fetch(url, { method: "GET" });
                        if (checkResponse.status === 404) {
                            console.log("El recurso fue eliminado correctamente a pesar del error 500");
                            return { eliminadoConExito: true };
                        }
                    } catch (checkError) {
                        console.warn("Error al verificar si el recurso aún existe:", checkError);
                    }
                }
                
                if (!respuesta.ok) {
                    let mensajeError;
                    try {
                        const errorData = await respuesta.text();
                        try {
                            const jsonError = JSON.parse(errorData);
                            mensajeError = jsonError.message || jsonError || errorData;
                        } catch (jsonParseError) {
                            mensajeError = errorData;
                        }
                    } catch (textError) {
                        mensajeError = `Error ${respuesta.status}: ${respuesta.statusText}`;
                    }
                    throw new Error(mensajeError);
                }
                
                if (respuesta.headers.get("content-length") !== "0" && 
                    respuesta.headers.get("content-type")?.includes("application/json")) {
                    return await respuesta.json();
                }
                
                return { success: true };
                
            } catch (err) {
                console.warn(`Intento ${intento} fallido para ${url}:`, err);
                ultimoError = err;
                
                if (intento < maxIntentos) {
                    await new Promise(resolve => setTimeout(resolve, 500 * intento));
                }
            }
        }
        
        throw ultimoError;
    }
    
    // Cargar todas las transformaciones
    function cargarTransformaciones() {
        mostrarMensaje("Cargando transformaciones...", "info");
        
        fetchConReintentos(`${API_URL}/transformaciones/todas`)
            .then(data => {
                mostrarTransformacionesEnGrid(data);
            })
            .catch(error => {
                console.error("Error al cargar transformaciones:", error);
                mostrarMensaje("Error al cargar las transformaciones. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Buscar transformaciones con los criterios de búsqueda
    function buscarTransformaciones() {
        const nombre = document.getElementById("nombreTransformacion").value;
        
        mostrarMensaje("Buscando transformaciones...", "info");
        
        fetchConReintentos(`${API_URL}/transformaciones?nombre=${encodeURIComponent(nombre)}`)
            .then(data => {
                mostrarTransformacionesEnGrid(data);
                mostrarMensaje(`Se encontraron ${data.length} transformaciones`, "success");
            })
            .catch(error => {
                console.error("Error al buscar transformaciones:", error);
                mostrarMensaje("Error al buscar transformaciones. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Mostrar transformaciones en el grid
    function mostrarTransformacionesEnGrid(transformaciones) {
        contenedorTransformaciones.innerHTML = "";
        
        if (transformaciones.length === 0) {
            contenedorTransformaciones.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron transformaciones</p>
                </div>
            `;
            return;
        }
        
        transformaciones.forEach(transformacion => {
            const transformacionCard = document.createElement("div");
            transformacionCard.classList.add("transformacion-card");
            
            // Colores diferentes según el multiplicador de poder
            let poderClase = "bajo";
            if (transformacion.multiplicadorPoder >= 50) {
                poderClase = "extremo";
            } else if (transformacion.multiplicadorPoder >= 10) {
                poderClase = "alto";
            } else if (transformacion.multiplicadorPoder >= 5) {
                poderClase = "medio";
            }
            
            transformacionCard.innerHTML = `
                <div class="transformacion-header poder-${poderClase}">
                    <div class="transformacion-nombre">${transformacion.nombre}</div>
                    <div class="transformacion-multiplicador">x${transformacion.multiplicadorPoder}</div>
                </div>
                <div class="transformacion-body">
                    <p class="transformacion-descripcion">${transformacion.descripcion}</p>
                    <div class="personaje-info">
                        <h4>Personaje</h4>
                        <div class="personaje-nombre" id="personajeTransformacion-${transformacion.id}">
                            <p class="loading-text">Cargando...</p>
                        </div>
                    </div>
                    <div class="transformacion-actions">
                        <button class="btn btn-action btn-edit" data-id="${transformacion.id}">Editar</button>
                        <button class="btn btn-action btn-delete" data-id="${transformacion.id}">Eliminar</button>
                    </div>
                </div>
            `;
            
            contenedorTransformaciones.appendChild(transformacionCard);
            
            // Cargar información del personaje
            cargarPersonajeDeTransformacion(transformacion.personajeId, transformacion.id);
            
            // Event listeners para los botones de acciones
            const btnEditar = transformacionCard.querySelector(".btn-edit");
            const btnEliminar = transformacionCard.querySelector(".btn-delete");
            
            btnEditar.addEventListener("click", () => editarTransformacion(transformacion.id));
            btnEliminar.addEventListener("click", () => eliminarTransformacion(transformacion.id));
        });
    }
    
    // Cargar información del personaje para mostrar en la transformación
    function cargarPersonajeDeTransformacion(personajeId, transformacionId) {
        const contenedorPersonaje = document.getElementById(`personajeTransformacion-${transformacionId}`);
        if (!contenedorPersonaje) {
            console.error(`No se encontró el contenedor para la transformación ${transformacionId}`);
            return;
        }
        
        fetchConReintentos(`${API_URL}/personajes/${personajeId}`)
            .then(personaje => {
                contenedorPersonaje.innerHTML = `
                    <div class="personaje-chip">
                        <img src="${getImageUrl(personaje.imagenUrl)}" alt="${personaje.nombre}" class="personaje-mini-img">
                        <span>${personaje.nombre}</span>
                    </div>
                `;
            })
            .catch(error => {
                console.error(`Error al cargar personaje de la transformación ${transformacionId}:`, error);
                contenedorPersonaje.innerHTML = `<p class="error-text">Error al cargar personaje</p>`;
            });
    }
    
    // Función auxiliar para manejar URLs de imágenes
    function getImageUrl(url) {
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            return url;
        } else if (url) {
            return `images/${url}`;
        } else {
            return 'images/default-personaje.png';
        }
    }
    
    // Cargar personajes para el selector
    function cargarPersonajesParaSelect() {
        fetchConReintentos(`${API_URL}/personajes/todos`)
            .then(data => {
                const select = document.getElementById("selectPersonajeTransformacion");
                select.innerHTML = '<option value="">-- Seleccionar personaje --</option>';
                
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
    
    // Abrir modal para crear una nueva transformación
    function abrirModalCrearTransformacion() {
        document.getElementById("modalTituloTransformacion").textContent = "Crear Transformación";
        document.getElementById("transformacionId").value = "";
        formTransformacion.reset();
        
        mostrarMensaje("Cargando lista de personajes...", "info");
        cargarPersonajesParaSelect();
        modalTransformacion.style.display = "block";
    }
    
    // Abrir modal para editar una transformación existente
    function editarTransformacion(id) {
        console.log("Editando transformación con ID:", id);
        
        mostrarMensaje("Cargando datos de la transformación...", "info");
        
        Promise.all([
            fetchConReintentos(`${API_URL}/transformaciones/${id}`),
            fetchConReintentos(`${API_URL}/personajes/todos`)
        ])
        .then(([transformacion, todosPersonajes]) => {
            console.log("Transformación:", transformacion);
            
            // Configurar el formulario con los datos de la transformación
            document.getElementById("modalTituloTransformacion").textContent = "Editar Transformación";
            document.getElementById("transformacionId").value = transformacion.id;
            document.getElementById("inputNombreTransformacion").value = transformacion.nombre;
            document.getElementById("inputDescripcionTransformacion").value = transformacion.descripcion;
            document.getElementById("inputMultiplicadorPoder").value = transformacion.multiplicadorPoder;
            
            // Cargar selector de personajes
            const select = document.getElementById("selectPersonajeTransformacion");
            select.innerHTML = '<option value="">-- Seleccionar personaje --</option>';
            
            todosPersonajes.forEach(personaje => {
                const option = document.createElement("option");
                option.value = personaje.id;
                option.textContent = personaje.nombre;
                if (personaje.id === transformacion.personajeId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
            
            modalTransformacion.style.display = "block";
            mostrarMensaje("Transformación cargada correctamente", "success");
        })
        .catch(error => {
            console.error("Error al cargar transformación para editar:", error);
            mostrarMensaje("Error al cargar los datos de la transformación: " + error.message, "error");
        });
    }
    
    // Guardar (crear o actualizar) una transformación
    function guardarTransformacion(event) {
        event.preventDefault();
        
        mostrarMensaje("Guardando transformación...", "info");
        
        const transformacionId = document.getElementById("transformacionId").value;
        const esEdicion = transformacionId !== "";
        
        const transformacion = {
            nombre: document.getElementById("inputNombreTransformacion").value,
            descripcion: document.getElementById("inputDescripcionTransformacion").value,
            multiplicadorPoder: parseFloat(document.getElementById("inputMultiplicadorPoder").value),
            personajeId: parseInt(document.getElementById("selectPersonajeTransformacion").value)
        };
        
        if (esEdicion) {
            transformacion.id = parseInt(transformacionId);
        }
        
        const url = esEdicion ? `${API_URL}/transformaciones/${transformacionId}` : `${API_URL}/transformaciones`;
        const method = esEdicion ? "PUT" : "POST";
        
        fetchConReintentos(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transformacion)
        })
        .then(data => {
            cerrarModalTransformacion();
            mostrarMensaje(`Transformación ${esEdicion ? "actualizada" : "creada"} correctamente`, "success");
            
            setTimeout(() => {
                cargarTransformaciones();
            }, 500);
        })
        .catch(error => {
            console.error("Error al guardar transformación:", error);
            mostrarMensaje(`Error al ${esEdicion ? "actualizar" : "crear"} la transformación: ${error.message}`, "error");
        });
    }
    
    // Eliminar una transformación
    function eliminarTransformacion(id) {
        if (confirm("¿Estás seguro de que quieres eliminar esta transformación? Esta acción no se puede deshacer.")) {
            mostrarMensaje("Eliminando transformación...", "info");
            
            fetchConReintentos(`${API_URL}/transformaciones/${id}`, {
                method: "DELETE"
            })
            .then(data => {
                mostrarMensaje("Transformación eliminada correctamente", "success");
                setTimeout(() => {
                    cargarTransformaciones();
                }, 500);
            })
            .catch(error => {
                console.error("Error al eliminar transformación:", error);
                
                // Verificar si la transformación sigue existiendo
                fetchConReintentos(`${API_URL}/transformaciones/${id}`, {}, 1)
                    .then(transformacion => {
                        mostrarMensaje("Error al eliminar la transformación: " + error.message, "error");
                    })
                    .catch(checkError => {
                        if (checkError.message.includes("404")) {
                            mostrarMensaje("Transformación eliminada correctamente", "success");
                            cargarTransformaciones();
                        } else {
                            mostrarMensaje("Error de comunicación al verificar el estado de la transformación", "warning");
                            cargarTransformaciones();
                        }
                    });
            });
        }
    }
    
    // Cerrar el modal de transformación
    function cerrarModalTransformacion() {
        modalTransformacion.style.display = "none";
        formTransformacion.reset();
    }
    
    // Mostrar mensaje de éxito o error
    function mostrarMensaje(mensaje, tipo) {
        const mensajeExistente = document.querySelector(".mensaje-flash");
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
        
        const mensajeElement = document.createElement("div");
        mensajeElement.classList.add("mensaje-flash", tipo);
        mensajeElement.textContent = mensaje;
        
        document.body.appendChild(mensajeElement);
        
        setTimeout(() => {
            mensajeElement.classList.add("mostrar");
        }, 10);
        
        let duracion = 3000;
        if (tipo === "error") {
            duracion = 5000;
        } else if (tipo === "info") {
            duracion = 2000;
        } else if (tipo === "warning") {
            duracion = 4000;
        }
        
        setTimeout(() => {
            mensajeElement.classList.remove("mostrar");
            setTimeout(() => {
                mensajeElement.remove();
            }, 300);
        }, duracion);
    }
});