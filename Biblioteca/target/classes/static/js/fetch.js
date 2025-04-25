const baseAPIUrl = `http://localhost:9999`;
/**
 * @param {String} url 
 * @description Ej: Si la variable "url"" es "buscarEmpleados", la peticion se haria a http://localhost:9999/api/buscarEmpleados
 */
async function requestAPI(url) {
	try {
		const response = await fetch(`${baseAPIUrl}/api${url}`);
		const json = await response.json();
		return json;
	} catch (error) {
		return error;
	}
}
