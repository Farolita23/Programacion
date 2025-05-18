package com.dragonball.services;

import com.dragonball.models.Personaje;
import com.dragonball.models.Saga;
import com.dragonball.models.Tecnica;
import com.dragonball.models.Transformacion;

import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class DragonBallService {

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // === Conexión a la base de datos === //
    private String dbUrl = "jdbc:mysql://localhost:3306/";
    private String dbName = "dragon_ball_db";
    private String dbUser = "salmon";
    private String dbUserPassword = "salmon";
    private Connection conn;
    
    private void startDatabaseConnection() throws Exception {
        conn = DriverManager.getConnection(dbUrl + dbName, dbUser, dbUserPassword);
    }
    
    private void closeDatabaseConnection() throws Exception {
        conn.close();
    }
    
    // === Métodos para personajes === //
    
    public List<Personaje> buscarPersonajes(String nombre, String raza, Boolean esHeroe) throws SQLException {
        try {
            startDatabaseConnection();
            
            String query = "SELECT * FROM personajes WHERE nombre LIKE ? AND raza LIKE ?";
            if (esHeroe != null) {
                query += " AND es_heroe = ?";
            }
            
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, "%" + nombre + "%");
            ps.setString(2, "%" + raza + "%");
            if (esHeroe != null) {
                ps.setBoolean(3, esHeroe);
            }
            
            ResultSet rs = ps.executeQuery();
            List<Personaje> personajes = new ArrayList<>();
            
            while (rs.next()) {
                Personaje personaje = new Personaje(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("raza"),
                    rs.getDouble("nivel_poder"),
                    rs.getBoolean("es_heroe"),
                    rs.getDate("fecha_nacimiento"),
                    rs.getString("biografia"),
                    rs.getString("imagen_url")
                );
                personajes.add(personaje);
            }
            
            rs.close();
            ps.close();
            
            return personajes;
        } catch (Exception e) {
            throw new SQLException("Error al buscar personajes: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Personaje obtenerPersonajePorId(Long id) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM personajes WHERE id = ?");
            ps.setLong(1, id);
            
            ResultSet rs = ps.executeQuery();
            Personaje personaje = null;
            
            if (rs.next()) {
                personaje = new Personaje(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("raza"),
                    rs.getDouble("nivel_poder"),
                    rs.getBoolean("es_heroe"),
                    rs.getDate("fecha_nacimiento"),
                    rs.getString("biografia"),
                    rs.getString("imagen_url")
                );
            }
            
            rs.close();
            ps.close();
            
            return personaje;
        } catch (Exception e) {
            throw new SQLException("Error al obtener personaje: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Personaje crearPersonaje(Personaje personaje) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO personajes (nombre, raza, nivel_poder, es_heroe, fecha_nacimiento, biografia, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            
            ps.setString(1, personaje.getNombre());
            ps.setString(2, personaje.getRaza());
            ps.setDouble(3, personaje.getNivelPoder());
            ps.setBoolean(4, personaje.getEsHeroe());
            ps.setDate(5, new java.sql.Date(personaje.getFechaNacimiento().getTime()));
            ps.setString(6, personaje.getBiografia());
            ps.setString(7, personaje.getImagenUrl());
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La creación de personaje falló, no se insertó ninguna fila.");
            }
            
            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    personaje.setId(generatedKeys.getLong(1));
                } else {
                    throw new SQLException("La creación de personaje falló, no se obtuvo el ID.");
                }
            }
            
            ps.close();
            
            return personaje;
        } catch (Exception e) {
            throw new SQLException("Error al crear personaje: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Personaje actualizarPersonaje(Personaje personaje) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement(
                "UPDATE personajes SET nombre = ?, raza = ?, nivel_poder = ?, es_heroe = ?, fecha_nacimiento = ?, biografia = ?, imagen_url = ? WHERE id = ?"
            );
            
            ps.setString(1, personaje.getNombre());
            ps.setString(2, personaje.getRaza());
            ps.setDouble(3, personaje.getNivelPoder());
            ps.setBoolean(4, personaje.getEsHeroe());
            ps.setDate(5, new java.sql.Date(personaje.getFechaNacimiento().getTime()));
            ps.setString(6, personaje.getBiografia());
            ps.setString(7, personaje.getImagenUrl());
            ps.setLong(8, personaje.getId());
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La actualización de personaje falló, no se actualizó ninguna fila.");
            }
            
            ps.close();
            
            return personaje;
        } catch (Exception e) {
            throw new SQLException("Error al actualizar personaje: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public void eliminarPersonaje(Long id) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("DELETE FROM personajes WHERE id = ?");
            ps.setLong(1, id);
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La eliminación de personaje falló, no se eliminó ninguna fila.");
            }
            
            ps.close();
        } catch (Exception e) {
            throw new SQLException("Error al eliminar personaje: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    // === Métodos para transformaciones === //
    
    public List<Transformacion> obtenerTransformacionesPorPersonaje(Long personajeId) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM transformaciones WHERE personaje_id = ?");
            ps.setLong(1, personajeId);
            
            ResultSet rs = ps.executeQuery();
            List<Transformacion> transformaciones = new ArrayList<>();
            
            while (rs.next()) {
                Transformacion transformacion = new Transformacion(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getDouble("multiplicador_poder"),
                    rs.getLong("personaje_id")
                );
                transformaciones.add(transformacion);
            }
            
            rs.close();
            ps.close();
            
            return transformaciones;
        } catch (Exception e) {
            throw new SQLException("Error al obtener transformaciones: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    // === Métodos para técnicas === //
    
    public List<Tecnica> buscarTecnicas(String nombre) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM tecnicas WHERE nombre LIKE ?");
            ps.setString(1, "%" + nombre + "%");
            
            ResultSet rs = ps.executeQuery();
            List<Tecnica> tecnicas = new ArrayList<>();
            
            while (rs.next()) {
                Tecnica tecnica = new Tecnica(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getInt("nivel_dano")
                );
                tecnicas.add(tecnica);
            }
            
            rs.close();
            ps.close();
            
            return tecnicas;
        } catch (Exception e) {
            throw new SQLException("Error al buscar técnicas: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Tecnica obtenerTecnicaPorId(Long id) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM tecnicas WHERE id = ?");
            ps.setLong(1, id);
            
            ResultSet rs = ps.executeQuery();
            Tecnica tecnica = null;
            
            if (rs.next()) {
                tecnica = new Tecnica(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getInt("nivel_dano")
                );
            }
            
            rs.close();
            ps.close();
            
            return tecnica;
        } catch (Exception e) {
            throw new SQLException("Error al obtener técnica: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Tecnica crearTecnica(Tecnica tecnica) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO tecnicas (nombre, descripcion, nivel_dano) VALUES (?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            
            ps.setString(1, tecnica.getNombre());
            ps.setString(2, tecnica.getDescripcion());
            ps.setInt(3, tecnica.getNivelDano());
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La creación de técnica falló, no se insertó ninguna fila.");
            }
            
            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    tecnica.setId(generatedKeys.getLong(1));
                } else {
                    throw new SQLException("La creación de técnica falló, no se obtuvo el ID.");
                }
            }
            
            ps.close();
            
            return tecnica;
        } catch (Exception e) {
            throw new SQLException("Error al crear técnica: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Tecnica actualizarTecnica(Tecnica tecnica) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement(
                "UPDATE tecnicas SET nombre = ?, descripcion = ?, nivel_dano = ? WHERE id = ?"
            );
            
            ps.setString(1, tecnica.getNombre());
            ps.setString(2, tecnica.getDescripcion());
            ps.setInt(3, tecnica.getNivelDano());
            ps.setLong(4, tecnica.getId());
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La actualización de técnica falló, no se actualizó ninguna fila.");
            }
            
            ps.close();
            
            return tecnica;
        } catch (Exception e) {
            throw new SQLException("Error al actualizar técnica: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public void eliminarTecnica(Long id) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("DELETE FROM tecnicas WHERE id = ?");
            ps.setLong(1, id);
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La eliminación de técnica falló, no se eliminó ninguna fila.");
            }
            
            ps.close();
        } catch (Exception e) {
            throw new SQLException("Error al eliminar técnica: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public List<Tecnica> obtenerTecnicasPorPersonaje(Long personajeId) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement(
                "SELECT t.* FROM tecnicas t " +
                "JOIN personaje_tecnicas pt ON t.id = pt.tecnica_id " +
                "WHERE pt.personaje_id = ?"
            );
            ps.setLong(1, personajeId);
            
            ResultSet rs = ps.executeQuery();
            List<Tecnica> tecnicas = new ArrayList<>();
            
            while (rs.next()) {
                Tecnica tecnica = new Tecnica(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getInt("nivel_dano")
                );
                tecnicas.add(tecnica);
            }
            
            rs.close();
            ps.close();
            
            return tecnicas;
        } catch (Exception e) {
            throw new SQLException("Error al obtener técnicas por personaje: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    // === Métodos para sagas === //
    
    public List<Saga> buscarSagas(String nombre) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM sagas WHERE nombre LIKE ?");
            ps.setString(1, "%" + nombre + "%");
            
            ResultSet rs = ps.executeQuery();
            List<Saga> sagas = new ArrayList<>();
            
            while (rs.next()) {
                Saga saga = new Saga(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getInt("ano_lanzamiento")
                );
                sagas.add(saga);
            }
            
            rs.close();
            ps.close();
            
            return sagas;
        } catch (Exception e) {
            throw new SQLException("Error al buscar sagas: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Saga obtenerSagaPorId(Long id) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM sagas WHERE id = ?");
            ps.setLong(1, id);
            
            ResultSet rs = ps.executeQuery();
            Saga saga = null;
            
            if (rs.next()) {
                saga = new Saga(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getInt("ano_lanzamiento")
                );
            }
            
            rs.close();
            ps.close();
            
            return saga;
        } catch (Exception e) {
            throw new SQLException("Error al obtener saga: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Saga crearSaga(Saga saga) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO sagas (nombre, descripcion, ano_lanzamiento) VALUES (?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS
            );
            
            ps.setString(1, saga.getNombre());
            ps.setString(2, saga.getDescripcion());
            ps.setInt(3, saga.getAnoLanzamiento());
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La creación de saga falló, no se insertó ninguna fila.");
            }
            
            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    saga.setId(generatedKeys.getLong(1));
                } else {
                    throw new SQLException("La creación de saga falló, no se obtuvo el ID.");
                }
            }
            
            ps.close();
            
            return saga;
        } catch (Exception e) {
            throw new SQLException("Error al crear saga: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public Saga actualizarSaga(Saga saga) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement(
                "UPDATE sagas SET nombre = ?, descripcion = ?, ano_lanzamiento = ? WHERE id = ?"
            );
            
            ps.setString(1, saga.getNombre());
            ps.setString(2, saga.getDescripcion());
            ps.setInt(3, saga.getAnoLanzamiento());
            ps.setLong(4, saga.getId());
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La actualización de saga falló, no se actualizó ninguna fila.");
            }
            
            ps.close();
            
            return saga;
        } catch (Exception e) {
            throw new SQLException("Error al actualizar saga: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public void eliminarSaga(Long id) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement("DELETE FROM sagas WHERE id = ?");
            ps.setLong(1, id);
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("La eliminación de saga falló, no se eliminó ninguna fila.");
            }
            
            ps.close();
        } catch (Exception e) {
            throw new SQLException("Error al eliminar saga: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    public List<Saga> obtenerSagasPorPersonaje(Long personajeId) throws SQLException {
        try {
            startDatabaseConnection();
            
            PreparedStatement ps = conn.prepareStatement(
                "SELECT s.* FROM sagas s " +
                "JOIN personaje_sagas ps ON s.id = ps.saga_id " +
                "WHERE ps.personaje_id = ?"
            );
            ps.setLong(1, personajeId);
            
            ResultSet rs = ps.executeQuery();
            List<Saga> sagas = new ArrayList<>();
            
            while (rs.next()) {
                Saga saga = new Saga(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getInt("ano_lanzamiento")
                );
                sagas.add(saga);
            }
            
            rs.close();
            ps.close();
            
            return sagas;
        } catch (Exception e) {
            throw new SQLException("Error al obtener sagas por personaje: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    // Método para obtener todos los personajes (útil para cargar listas)
    public List<Personaje> obtenerTodosPersonajes() throws SQLException {
        try {
            startDatabaseConnection();
            
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM personajes");
            List<Personaje> personajes = new ArrayList<>();
            
            while (rs.next()) {
                Personaje personaje = new Personaje(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("raza"),
                    rs.getDouble("nivel_poder"),
                    rs.getBoolean("es_heroe"),
                    rs.getDate("fecha_nacimiento"),
                    rs.getString("biografia"),
                    rs.getString("imagen_url")
                );
                personajes.add(personaje);
            }
            
            rs.close();
            stmt.close();
            
            return personajes;
        } catch (Exception e) {
            throw new SQLException("Error al obtener todos los personajes: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    // Método para obtener todas las técnicas (útil para cargar listas)
    public List<Tecnica> obtenerTodasTecnicas() throws SQLException {
        try {
            startDatabaseConnection();
            
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM tecnicas");
            List<Tecnica> tecnicas = new ArrayList<>();
            
            while (rs.next()) {
                Tecnica tecnica = new Tecnica(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getInt("nivel_dano")
                );
                tecnicas.add(tecnica);
            }
            
            rs.close();
            stmt.close();
            
            return tecnicas;
        } catch (Exception e) {
            throw new SQLException("Error al obtener todas las técnicas: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    // Método para obtener todas las sagas (útil para cargar listas)
    public List<Saga> obtenerTodasSagas() throws SQLException {
        try {
            startDatabaseConnection();
            
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM sagas");
            List<Saga> sagas = new ArrayList<>();
            
            while (rs.next()) {
                Saga saga = new Saga(
                    rs.getLong("id"),
                    rs.getString("nombre"),
                    rs.getString("descripcion"),
                    rs.getInt("ano_lanzamiento")
                );
                sagas.add(saga);
            }
            
            rs.close();
            stmt.close();
            
            return sagas;
        } catch (Exception e) {
            throw new SQLException("Error al obtener todas las sagas: " + e.getMessage());
        } finally {
            try {
                closeDatabaseConnection();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}