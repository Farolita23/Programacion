package com.daw;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Personas
 */
@WebServlet("/Personas")
public class Personas extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public Personas() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		try {

			String myDriver = "org.mariadb.jdbc.Driver";
			Class.forName(myDriver);
			Connection con = DriverManager
					.getConnection("jdbc:mariadb://localhost:3306/pruebas?user=usuario&password=usuario");

			Statement stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery(
					"SELECT id, nombre, primer_apellido, segundo_apellido, fecha_nacimiento FROM persona");

			ArrayList<Persona> personas = new ArrayList<>();
			while (rs.next()) {
				Persona p = new Persona();
				p.setId(rs.getInt("id"));
				p.setNombre(rs.getString("nombre"));
				p.setPrimerApellido(rs.getString("primer_apellido"));
				p.setSegundoApellido(rs.getString("segundo_apellido"));
				p.setFechaNacimiento(rs.getDate("fecha_nacimiento"));
				personas.add(p);
			}

			request.setAttribute("listaPersonas", personas);
			RequestDispatcher dispatcher = request.getRequestDispatcher("listado_personas.jsp");
			dispatcher.forward(request, response);

		} catch (SQLException e) {
			throw new ServletException("Error de base de datos", e);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
