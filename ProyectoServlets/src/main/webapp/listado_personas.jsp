<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	
<%@ page import="java.util.*, com.daw.Persona"%>

<html>

<body>

	<style>
		table {
			width: 100%;
			border: 1px solid #000;
		}
		
		th, td {
			text-align: left;
			vertical-align: top;
			border: 1px solid #000;
		}
	</style>

	<div id="listado">
		<table>
			<thead>
				<tr>
					<td>Id</td>
					<td>Nombre</td>
					<td>Primer Apellido</td>
					<td>Segundo Apellido</td>
					<td>Fecha Nacimiento</td>
				</tr>
			</thead>
			<tbody>

			<% 
				List<Persona> personas = (List<Persona>) request.getAttribute("listaPersonas");
			
				for(Persona p: personas) {
					String tr = "<tr>" +
						"<td>" + p.getId() + "</td>" +
						"<td>" + p.getNombre() + "</td>" +
						"<td>" + p.getPrimerApellido() + "</td>" +
						"<td>" + p.getSegundoApellido() + "</td>" +
						"<td>" + p.getFechaNacimiento() + "</td>" +
						"</tr>";
					out.print(tr);
				}
			%>

			</tbody>

		</table>
	</div>
</body>
</html>