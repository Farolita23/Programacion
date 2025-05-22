-- Socio
INSERT INTO socio (nombre, apellidos, email, dni, telefono, fecha_nacimiento) VALUES 
('Carlos', 'Martínez', 'carlos.martinez@example.com', '12345678A', '600111111', '1980-05-20'),
('Laura', 'Gómez', 'laura.gomez@example.com', '23456789B', '600222222', '1992-08-15'),
('Andrés', 'López', 'andres.lopez@example.com', '34567890C', '600333333', '1975-11-30');

-- Barco
INSERT INTO barco (matricula, nombre, numero_amarre, cuota, socio_id) VALUES 
('ABC123456', 'El Velero Azul', 10, 120.50, 1),
('XYZ987654', 'La Sirena', 12, 95.75, 1),
('DEF456789', 'El Corsario', 14, 150.00, 2),
('GHI111222', 'Tempestad', 16, 180.25, 3);

-- Patrón
INSERT INTO patron (nombre, apellidos, email, dni, telefono, fecha_nacimiento) VALUES 
('Marina', 'Sánchez', 'marina.sanchez@example.com', '87654321X', '611111111', '1985-04-10'),
('Jorge', 'Ramírez', 'jorge.ramirez@example.com', '76543210Y', '622222222', '1978-09-25'),
('Elena', 'Torres', 'elena.torres@example.com', '65432109Z', '633333333', '1990-03-05');

-- Salida
INSERT INTO salida (fecha_hora_salida, destino, barco_id, patron_id) VALUES 
('2025-06-01 09:00:00', 'Isla Bonita', 1, 1),
('2025-06-02 10:30:00', 'Cala Blanca', 2, 2),
('2025-06-03 08:15:00', 'Puerto Azul', 3, 3),
('2025-06-04 11:00:00', 'Bahía Serena', 4, 1);