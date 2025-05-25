// personajes.js
    let transformacionesPersonajeActual = [];
document.addEventListener("DOMContentLoaded", function() {
    // Variables globales
    const API_URL = "http://localhost:9999/api";
    const tablaPersonajes = document.getElementById("cuerpoTablaPersonajes");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnCrear = document.getElementById("btnCrear");
    const modalPersonaje = document.getElementById("modalPersonaje");
    const formPersonaje = document.getElementById("formPersonaje");
    const btnCancelar = document.getElementById("btnCancelar");
    const modalDetalles = document.getElementById("modalDetalles");
    
    
    // Función mejorada para reintentar fetch con mejor manejo de errores
async function fetchConReintentos(url, opciones = {}, maxIntentos = 3) {
    let ultimoError;
    
    for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
            const respuesta = await fetch(url, opciones);
            
            // Si es una eliminación (DELETE) y recibimos un 500 pero el backend realmente
            // eliminó el registro, consideramos esto como un "falso error"
            if (!respuesta.ok && opciones.method === "DELETE" && respuesta.status === 500) {
                // Intentamos verificar si el recurso todavía existe
                try {
                    const checkUrl = url; // La misma URL que estamos eliminando
                    const checkResponse = await fetch(checkUrl, { method: "GET" });
                    
                    if (checkResponse.status === 404) {
                        // El recurso ya no existe, por lo que consideramos la eliminación como exitosa
                        // a pesar del error 500
                        console.log("El recurso fue eliminado correctamente a pesar del error 500");
                        return { eliminadoConExito: true };
                    }
                } catch (checkError) {
                    console.warn("Error al verificar si el recurso aún existe:", checkError);
                    // Continuamos con el flujo normal de manejo de errores
                }
            }
            
            // Para respuestas no exitosas
            if (!respuesta.ok) {
                // Intentar obtener un mensaje de error de la respuesta
                let mensajeError;
                try {
                    // Intentar parsear como JSON
                    const errorData = await respuesta.text();
                    try {
                        const jsonError = JSON.parse(errorData);
                        mensajeError = jsonError.message || jsonError || errorData;
                    } catch (jsonParseError) {
                        // Si no es JSON, usar el texto tal cual
                        mensajeError = errorData;
                    }
                } catch (textError) {
                    // Si no podemos obtener el texto, usar el status
                    mensajeError = `Error ${respuesta.status}: ${respuesta.statusText}`;
                }
                
                throw new Error(mensajeError);
            }
            
            // Intentar parsear la respuesta como JSON si tiene contenido
            if (respuesta.headers.get("content-length") !== "0" && 
                respuesta.headers.get("content-type")?.includes("application/json")) {
                return await respuesta.json();
            }
            
            // Para respuestas exitosas sin contenido (como DELETE exitosos)
            return { success: true };
            
        } catch (err) {
            console.warn(`Intento ${intento} fallido para ${url}:`, err);
            ultimoError = err;
            
            // Pequeña pausa antes del siguiente intento
            if (intento < maxIntentos) {
                await new Promise(resolve => setTimeout(resolve, 500 * intento)); // Espera progresiva
            }
        }
    }
    
    throw ultimoError; // Si llegamos aquí, todos los intentos fallaron
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
    
    // Actualizar el texto de ayuda en el formulario
    const labelImagenUrl = document.querySelector('label[for="inputImagenUrl"]');
    if (labelImagenUrl) {
        labelImagenUrl.innerHTML = 'URL de Imagen: <small>(URL completa de internet o nombre del archivo local)</small>';
    }
    
    // Elementos para cerrar los modales
    const cerrarModales = document.querySelectorAll(".modal-close");
    
    // Cargar personajes al iniciar la página
    cargarPersonajes();
    
    // Event Listeners
    btnBuscar.addEventListener("click", buscarPersonajes);
    btnCrear.addEventListener("click", abrirModalCrear);
    btnCancelar.addEventListener("click", cerrarModalPersonaje);
    formPersonaje.addEventListener("submit", guardarPersonaje);
    const btnAsignarTransformacion = document.getElementById("btnAsignarTransformacion");
if (btnAsignarTransformacion) {
    btnAsignarTransformacion.addEventListener("click", agregarTransformacionSeleccionada);
}
    
    // Cerrar modales con el botón de cerrar
    cerrarModales.forEach(btn => {
        btn.addEventListener("click", function() {
            modalPersonaje.style.display = "none";
            modalDetalles.style.display = "none";
        });
    });
    
    // Cerrar modales al hacer clic fuera del contenido
    window.addEventListener("click", function(event) {
        if (event.target === modalPersonaje) {
            modalPersonaje.style.display = "none";
        }
        if (event.target === modalDetalles) {
            modalDetalles.style.display = "none";
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
        // Animación para todos los personajes
        const filas = tablaPersonajes.querySelectorAll("tr");
        filas.forEach((fila, index) => {
            setTimeout(() => {
                fila.classList.add("power-up-animation");
                setTimeout(() => {
                    fila.classList.remove("power-up-animation");
                }, 1000);
            }, index * 100);
        });
    });
    
    // Funciones
    
    // Cargar todos los personajes
    function cargarPersonajes() {
        mostrarMensaje("Cargando personajes...", "info");
        
        fetchConReintentos(`${API_URL}/personajes/todos`)
            .then(data => {
                mostrarPersonajesEnTabla(data);
            })
            .catch(error => {
                console.error("Error al cargar personajes:", error);
                mostrarMensaje("Error al cargar los personajes. Por favor, inténtalo de nuevo más tarde.", "error");
                
                // Auto-reintento después de un breve retraso
                setTimeout(() => {
                    console.log("Reintentando cargar personajes automáticamente...");
                    cargarPersonajes();
                }, 2000);
            });
    }
    
    // Buscar personajes con los criterios de búsqueda
    function buscarPersonajes() {
        mostrarMensaje("Buscando personajes...", "info");
        
        const nombre = document.getElementById("nombre").value;
        const raza = document.getElementById("raza").value;
        const esHeroeCheckbox = document.getElementById("esHeroe");
        
        let url = `${API_URL}/personajes?nombre=${encodeURIComponent(nombre)}&raza=${encodeURIComponent(raza)}`;
        
        if (esHeroeCheckbox.checked) {
            url += `&esHeroe=true`;
        }
        
        fetchConReintentos(url)
            .then(data => {
                mostrarPersonajesEnTabla(data);
                mostrarMensaje(`Se encontraron ${data.length} personajes`, "success");
            })
            .catch(error => {
                console.error("Error al buscar personajes:", error);
                mostrarMensaje("Error al buscar personajes. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Mostrar personajes en la tabla
    function mostrarPersonajesEnTabla(personajes) {
        tablaPersonajes.innerHTML = "";
        
        if (personajes.length === 0) {
            tablaPersonajes.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center;">No se encontraron personajes</td>
                </tr>
            `;
            return;
        }
        
        personajes.forEach(personaje => {
            const fechaNacimiento = new Date(personaje.fechaNacimiento).toLocaleDateString();
            const esHeroe = personaje.esHeroe ? "Sí" : "No";
            
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${personaje.id}</td>
                <td><img src="${getImageUrl(personaje.imagenUrl)}" alt="${personaje.nombre}" class="personaje-img"></td>
                <td>${personaje.nombre}</td>
                <td>${personaje.raza}</td>
                <td class="power-level">${personaje.nivelPoder}</td>
                <td>${esHeroe}</td>
                <td>${fechaNacimiento}</td>
                <td>
                    <button class="btn btn-action btn-view" data-id="${personaje.id}">Ver</button>
                    <button class="btn btn-action btn-edit" data-id="${personaje.id}">Editar</button>
                    <button class="btn btn-action btn-delete" data-id="${personaje.id}">Eliminar</button>
                </td>
            `;
            
            tablaPersonajes.appendChild(fila);
            
            // Event listeners para los botones de acciones
            const btnVer = fila.querySelector(".btn-view");
            const btnEditar = fila.querySelector(".btn-edit");
            const btnEliminar = fila.querySelector(".btn-delete");
            
            btnVer.addEventListener("click", () => verPersonaje(personaje.id));
            btnEditar.addEventListener("click", () => editarPersonaje(personaje.id));
            btnEliminar.addEventListener("click", () => eliminarPersonaje(personaje.id));
        });
    }
    
    // Ver detalles de un personaje
    function verPersonaje(id) {
        mostrarMensaje("Cargando detalles del personaje...", "info");
        
        // Establecer un timeout más largo para las solicitudes fetch
        const controlador = new AbortController();
        const timeoutId = setTimeout(() => controlador.abort(), 10000); // 10 segundos de timeout
        const opciones = { signal: controlador.signal };
        
        // Primero cargar los datos básicos del personaje, transformaciones y técnicas
        Promise.all([
            fetchConReintentos(`${API_URL}/personajes/${id}`, opciones),
            fetchConReintentos(`${API_URL}/personajes/${id}/transformaciones`, opciones),
            fetchConReintentos(`${API_URL}/personajes/${id}/tecnicas`, opciones)
        ])
        .then(([personaje, transformaciones, tecnicas]) => {
            clearTimeout(timeoutId); // Limpiar el timeout
            
            // Mostrar datos del personaje
            document.getElementById("detallesTitulo").textContent = `Detalles de ${personaje.nombre}`;
            document.getElementById("detallesImagen").src = getImageUrl(personaje.imagenUrl);
            document.getElementById("detallesNombre").textContent = personaje.nombre;
            document.getElementById("detallesRaza").textContent = personaje.raza;
            document.getElementById("detallesNivelPoder").textContent = personaje.nivelPoder;
            document.getElementById("detallesTipo").textContent = personaje.esHeroe ? "Héroe" : "Villano";
            document.getElementById("detallesFechaNacimiento").textContent = new Date(personaje.fechaNacimiento).toLocaleDateString();
            document.getElementById("detallesBiografia").textContent = personaje.biografia;
            
            // Mostrar transformaciones
            const listaTransformaciones = document.getElementById("listaTransformaciones");
            listaTransformaciones.innerHTML = "";
            
            if (!transformaciones || transformaciones.length === 0) {
                listaTransformaciones.innerHTML = "<li>No tiene transformaciones registradas</li>";
            } else {
                transformaciones.forEach(trans => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <div class="transformacion-info">
                            <span class="transformacion-nombre">${trans.nombre}</span>
                            <span class="transformacion-multiplicador">x${trans.multiplicadorPoder}</span>
                        </div>
                    `;
                    listaTransformaciones.appendChild(li);
                });
            }
            
            // Mostrar técnicas
            const listaTecnicas = document.getElementById("listaTecnicas");
            listaTecnicas.innerHTML = "";
            
            if (!tecnicas || tecnicas.length === 0) {
                listaTecnicas.innerHTML = "<li>No tiene técnicas registradas</li>";
            } else {
                tecnicas.forEach(tec => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <div class="tecnica-info">
                            <span class="tecnica-nombre">${tec.nombre}</span>
                            <span class="tecnica-nivel">Nivel ${tec.nivelDano}</span>
                        </div>
                    `;
                    listaTecnicas.appendChild(li);
                });
            }
            
            // Cargar sagas por separado y mostrar el modal mientras tanto
            const listaSagas = document.getElementById("listaSagas");
            listaSagas.innerHTML = "<li>Cargando sagas...</li>";
            
            // Mostrar modal inmediatamente con la información disponible
            modalDetalles.style.display = "block";
            mostrarMensaje("Detalles cargados correctamente", "success");
            
            // Realizar una consulta separada para las sagas
            cargarSagasDePersonaje(id);
        })
        .catch(error => {
            clearTimeout(timeoutId); // Limpiar el timeout
            console.error("Error al cargar detalles del personaje:", error);
            mostrarMensaje("Error al cargar los detalles del personaje: " + error.message, "error");
            
            // Auto-reintento después de un breve retraso
            setTimeout(() => {
                console.log("Reintentando ver personaje automáticamente...");
                verPersonaje(id);
            }, 1000);
        });
    }
    
    // Función separada para cargar las sagas del personaje
    function cargarSagasDePersonaje(personajeId) {
        const listaSagas = document.getElementById("listaSagas");
        
        // Intentar hasta 5 veces con intervalos crecientes
        let intentos = 0;
        const maxIntentos = 5;
        const tiemposEspera = [500, 1000, 2000, 3000, 5000];
        
        function intentarCargarSagas() {
            fetchConReintentos(`${API_URL}/personajes/${personajeId}/sagas`)
                .then(sagasPersonaje => {
                    listaSagas.innerHTML = "";
                    
                    if (!sagasPersonaje || sagasPersonaje.length === 0) {
                        listaSagas.innerHTML = "<li>No aparece en ninguna saga</li>";
                    } else {
                        sagasPersonaje.forEach(saga => {
                            const li = document.createElement("li");
                            li.innerHTML = `
                                <div class="saga-info">
                                    <span class="saga-nombre">${saga.nombre}</span>
                                    <span class="saga-ano">${saga.anoLanzamiento}</span>
                                </div>
                            `;
                            listaSagas.appendChild(li);
                        });
                    }
                    
                    console.log("Sagas cargadas exitosamente:", sagasPersonaje);
                })
                .catch(error => {
                    console.error(`Error al cargar sagas (intento ${intentos + 1}/${maxIntentos}):`, error);
                    
                    if (intentos < maxIntentos - 1) {
                        // Mostrar mensaje de reintento
                        listaSagas.innerHTML = `<li>Reintentando cargar sagas... (${intentos + 1}/${maxIntentos})</li>`;
                        
                        // Incrementar contador e intentar de nuevo después de un tiempo
                        intentos++;
                        setTimeout(intentarCargarSagas, tiemposEspera[intentos - 1]);
                    } else {
                        // Último intento fallido
                        listaSagas.innerHTML = `<li class="error-text">No se pudieron cargar las sagas</li>`;
                        
                        // Ofrecer un botón para reintentar manualmente
                        const botonReintentar = document.createElement("button");
                        botonReintentar.textContent = "Reintentar cargar sagas";
                        botonReintentar.className = "btn btn-action";
                        botonReintentar.addEventListener("click", () => {
                            // Reiniciar intentos y comenzar de nuevo
                            intentos = 0;
                            listaSagas.innerHTML = "<li>Cargando sagas...</li>";
                            intentarCargarSagas();
                        });
                        
                        listaSagas.appendChild(botonReintentar);
                    }
                });
        }
        
        // Iniciar el proceso de carga
        intentarCargarSagas();
    }
    
    // Abrir modal para crear un nuevo personaje
    // Abrir modal para crear un nuevo personaje
function abrirModalCrear() {
    document.getElementById("modalTitulo").textContent = "Crear Personaje";
    document.getElementById("personajeId").value = "";
    formPersonaje.reset();
    
    // Limpiar transformaciones
    transformacionesPersonajeActual = [];
    actualizarListaTransformacionesPersonaje();
    
    // Ocultar sección de transformaciones para nuevos personajes
    const seccionTransformaciones = document.getElementById("seccionTransformaciones");
    if (seccionTransformaciones) {
        seccionTransformaciones.style.display = "none";
    }
    
    modalPersonaje.style.display = "block";
}
    
    // Abrir modal para editar un personaje existente
function editarPersonaje(id) {
    mostrarMensaje("Cargando datos del personaje...", "info");
    
    Promise.all([
        fetchConReintentos(`${API_URL}/personajes/${id}`),
        fetchConReintentos(`${API_URL}/personajes/${id}/transformaciones`)
    ])
    .then(([personaje, transformaciones]) => {
        document.getElementById("modalTitulo").textContent = "Editar Personaje";
        document.getElementById("personajeId").value = personaje.id;
        document.getElementById("inputNombre").value = personaje.nombre;
        document.getElementById("inputRaza").value = personaje.raza;
        document.getElementById("inputNivelPoder").value = personaje.nivelPoder;
        document.getElementById("inputEsHeroe").checked = personaje.esHeroe;
        
        // Formatear la fecha para el input date (YYYY-MM-DD)
        const fecha = new Date(personaje.fechaNacimiento);
        const fechaFormateada = fecha.toISOString().split('T')[0];
        document.getElementById("inputFechaNacimiento").value = fechaFormateada;
        
        document.getElementById("inputBiografia").value = personaje.biografia;
        document.getElementById("inputImagenUrl").value = personaje.imagenUrl;
        
        // Cargar transformaciones del personaje
        transformacionesPersonajeActual = transformaciones || [];
        actualizarListaTransformacionesPersonaje();
        
        // Mostrar sección de transformaciones para edición
        const seccionTransformaciones = document.getElementById("seccionTransformaciones");
        if (seccionTransformaciones) {
            seccionTransformaciones.style.display = "block";
        }
        
        modalPersonaje.style.display = "block";
        mostrarMensaje("Personaje cargado correctamente", "success");
        
        // *** AGREGAR ESTA LÍNEA ***
        cargarTransformacionesParaSelector();
    })
    .catch(error => {
        console.error("Error al cargar personaje para editar:", error);
        mostrarMensaje("Error al cargar los datos del personaje: " + error.message, "error");
        
        // Auto-reintento después de un breve retraso
        setTimeout(() => {
            console.log("Reintentando editar personaje automáticamente...");
            editarPersonaje(id);
        }, 1000);
    });
}
    
    // Guardar (crear o actualizar) un personaje
function guardarPersonaje(event) {
    event.preventDefault();
    
    mostrarMensaje("Guardando personaje...", "info");
    
    const personajeId = document.getElementById("personajeId").value;
    const esEdicion = personajeId !== "";
    
    const personaje = {
        nombre: document.getElementById("inputNombre").value,
        raza: document.getElementById("inputRaza").value,
        nivelPoder: parseFloat(document.getElementById("inputNivelPoder").value),
        esHeroe: document.getElementById("inputEsHeroe").checked,
        fechaNacimiento: document.getElementById("inputFechaNacimiento").value,
        biografia: document.getElementById("inputBiografia").value,
        imagenUrl: document.getElementById("inputImagenUrl").value
    };
    
    if (esEdicion) {
        personaje.id = parseInt(personajeId);
    }
    
    const url = esEdicion ? `${API_URL}/personajes/${personajeId}` : `${API_URL}/personajes`;
    const method = esEdicion ? "PUT" : "POST";
    
    // Primero guardar el personaje
    fetchConReintentos(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(personaje)
    })
    .then(data => {
        const personajeIdFinal = data.id || personajeId;
        
        // Si es edición, manejar asignaciones de transformaciones
        if (esEdicion) {
            return guardarAsignacionesTransformaciones(personajeIdFinal);
        }
        
        return Promise.resolve();
    })
    .then(() => {
        cerrarModalPersonaje();
        mostrarMensaje(`Personaje ${esEdicion ? "actualizado" : "creado"} correctamente`, "success");
        
        // Dar un pequeño tiempo antes de recargar
        setTimeout(() => {
            cargarPersonajes();
        }, 500);
    })
    .catch(error => {
        console.error("Error al guardar personaje:", error);
        mostrarMensaje(`Error al ${esEdicion ? "actualizar" : "crear"} el personaje: ${error.message}`, "error");
    });
}
    
    // Función mejorada para eliminar personaje
function eliminarPersonaje(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este personaje? Esta acción no se puede deshacer.")) {
        mostrarMensaje("Eliminando personaje...", "info");
        
        fetchConReintentos(`${API_URL}/personajes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(data => {
            // Si llegamos aquí, la eliminación fue exitosa (o detectamos un falso error)
            mostrarMensaje("Personaje eliminado correctamente", "success");
            
            // Actualizar la tabla sin recargar la página
            setTimeout(() => {
                cargarPersonajes();
            }, 500);
        })
        .catch(error => {
            console.error("Error al eliminar personaje:", error);
            
            // Verificar nuevamente si el personaje existe, por si fue un error de comunicación
            fetchConReintentos(`${API_URL}/personajes/${id}`, {}, 1) // Solo 1 intento para verificar
                .then(personaje => {
                    // Si llegamos aquí, el personaje sigue existiendo
                    mostrarMensaje("Error al eliminar el personaje: " + error.message, "error");
                })
                .catch(checkError => {
                    if (checkError.message.includes("404")) {
                        // El personaje no existe, así que probablemente fue eliminado
                        mostrarMensaje("Personaje eliminado correctamente", "success");
                        cargarPersonajes();
                    } else {
                        // Error de comunicación general
                        mostrarMensaje("Error de comunicación al verificar el estado del personaje", "warning");
                        // Refrescar de todos modos por si acaso
                        cargarPersonajes();
                    }
                });
        });
    }
}
    
    // Cerrar el modal de personaje
    function cerrarModalPersonaje() {
        modalPersonaje.style.display = "none";
        formPersonaje.reset();
    }
    
    // Función mejorada para mostrar mensajes
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

// Funciones auxiliares para el formato de fechas
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}
function actualizarListaTransformacionesPersonaje() {
    const lista = document.getElementById("listaTransformacionesPersonaje");
    if (!lista) {
        console.error("No se encontró el elemento listaTransformacionesPersonaje");
        return;
    }
    
    lista.innerHTML = "";
    
    if (transformacionesPersonajeActual.length === 0) {
        lista.innerHTML = `<li class="transformaciones-vacio">No hay transformaciones asignadas</li>`;
        return;
    }
    
    transformacionesPersonajeActual.forEach((transformacion) => {
        const li = document.createElement("li");
        li.className = "transformacion-item";
        li.innerHTML = `
            <div class="transformacion-info">
                <div class="transformacion-nombre">${transformacion.nombre}</div>
                <div class="transformacion-multiplicador">Multiplicador: x${transformacion.multiplicadorPoder}</div>
                <div class="transformacion-descripcion">${transformacion.descripcion}</div>
            </div>
            <button type="button" class="btn-quitar-transformacion" data-id="${transformacion.id}" title="Quitar transformación">
                ✕
            </button>
        `;
        lista.appendChild(li);
        
        // Agregar event listener al botón de quitar
        li.querySelector(".btn-quitar-transformacion").addEventListener("click", function() {
            const id = parseInt(this.getAttribute("data-id"));
            quitarTransformacionDePersonaje(id);
        });
    });
}
// Cargar todas las transformaciones para el selector
async function cargarTransformacionesParaSelector() {
    console.log("Cargando transformaciones para el selector...");
    
    try {
        mostrarMensaje("Cargando transformaciones disponibles...", "info");
        const transformaciones = await fetchConReintentos(`${API_URL}/transformaciones/todas`);
        
        console.log("Transformaciones obtenidas:", transformaciones);
        
        const select = document.getElementById("selectTransformaciones");
        if (!select) {
            console.error("No se encontró el elemento selectTransformaciones");
            return;
        }
        
        // Limpiar el select
        select.innerHTML = '<option value="">-- Seleccionar transformación --</option>';
        
        if (!transformaciones || transformaciones.length === 0) {
            select.innerHTML = '<option value="">-- No hay transformaciones disponibles --</option>';
            mostrarMensaje("No hay transformaciones disponibles en el sistema", "warning");
            return;
        }
        
        // Obtener el ID del personaje actual
        const personajeActualId = parseInt(document.getElementById("personajeId").value);
        
        // Agregar TODAS las transformaciones al select
        transformaciones.forEach(transformacion => {
            const option = document.createElement("option");
            option.value = transformacion.id;
            
            // Construir el texto de la opción
            let textoOpcion = `${transformacion.nombre} (x${transformacion.multiplicadorPoder})`;
            
            // Indicar si está asignada a otro personaje
            if (transformacion.personajeId && transformacion.personajeId !== personajeActualId) {
                textoOpcion += ` - [Asignada a otro personaje]`;
                option.style.color = '#999'; // Gris para indicar que está asignada
            } else if (transformacion.personajeId === personajeActualId) {
                textoOpcion += ` - [Ya asignada a este personaje]`;
                option.style.color = '#28a745'; // Verde para indicar que ya está asignada a este personaje
                option.disabled = true; // Deshabilitar si ya está asignada al personaje actual
            }
            
            option.textContent = textoOpcion;
            select.appendChild(option);
        });
        
        console.log(`Se cargaron ${transformaciones.length} transformaciones`);
        
    } catch (error) {
        console.error("Error al cargar transformaciones:", error);
        mostrarMensaje("Error al cargar las transformaciones disponibles: " + error.message, "error");
        
        const select = document.getElementById("selectTransformaciones");
        if (select) {
            select.innerHTML = '<option value="">-- Error al cargar --</option>';
        }
    }
}

// Agregar transformación seleccionada al personaje
function agregarTransformacionSeleccionada() {
    const select = document.getElementById("selectTransformaciones");
    const transformacionId = parseInt(select.value);
    
    if (!transformacionId) {
        mostrarMensaje("Selecciona una transformación primero", "error");
        return;
    }
    
    // Verificar que no esté ya en la lista
    if (transformacionesPersonajeActual.some(t => t.id === transformacionId)) {
        mostrarMensaje("Esta transformación ya está asignada", "error");
        return;
    }
    
    // Obtener los detalles de la transformación
    fetchConReintentos(`${API_URL}/transformaciones/${transformacionId}`)
        .then(transformacion => {
            transformacionesPersonajeActual.push(transformacion);
            actualizarListaTransformacionesPersonaje();
            mostrarMensaje(`Transformación "${transformacion.nombre}" agregada`, "success");
            select.value = "";
        })
        .catch(error => {
            console.error("Error al obtener detalles de la transformación:", error);
            mostrarMensaje("Error al agregar la transformación", "error");
        });
}

// Quitar transformación del personaje
function quitarTransformacionDePersonaje(transformacionId) {
    const transformacion = transformacionesPersonajeActual.find(t => t.id === transformacionId);
    if (transformacion && confirm(`¿Quitar la transformación "${transformacion.nombre}"?`)) {
        transformacionesPersonajeActual = transformacionesPersonajeActual.filter(t => t.id !== transformacionId);
        actualizarListaTransformacionesPersonaje();
        mostrarMensaje("Transformación quitada de la lista", "info");
    }
}

// Nueva función para guardar las asignaciones de transformaciones
async function guardarAsignacionesTransformaciones(personajeId) {
    try {
        // Obtener transformaciones actuales del personaje
        const transformacionesOriginales = await fetchConReintentos(`${API_URL}/personajes/${personajeId}/transformaciones`);
        
        // Identificar transformaciones a eliminar (que estaban antes pero ya no están)
        for (const transOriginal of transformacionesOriginales) {
            const sigueAsignada = transformacionesPersonajeActual.some(t => t.id === transOriginal.id);
            if (!sigueAsignada) {
                // Actualizar la transformación para quitarle el personaje
                await fetchConReintentos(`${API_URL}/transformaciones/${transOriginal.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...transOriginal,
                        personajeId: null
                    })
                });
            }
        }
        
        // Asignar las nuevas transformaciones
        for (const transformacion of transformacionesPersonajeActual) {
            if (!transformacionesOriginales.some(t => t.id === transformacion.id)) {
                await fetchConReintentos(`${API_URL}/transformaciones/${transformacion.id}`, {
                    method: "PUT", 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...transformacion,
                        personajeId: parseInt(personajeId)
                    })
                });
            }
        }
        
        console.log("Asignaciones de transformaciones guardadas correctamente");
    } catch (error) {
        console.error("Error al guardar asignaciones de transformaciones:", error);
        mostrarMensaje("Personaje guardado, pero hubo problemas con las transformaciones", "warning");
    }
}