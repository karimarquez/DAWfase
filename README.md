# Aesthetica — gestión de salón de belleza

Aplicación web para explorar servicios de belleza, reservar citas y administrar las reservas de un salón. La interfaz está construida con React y Vite.

## Enlaces

- **Aplicación desplegada:** [fase2daw.netlify.app](https://fase2daw.netlify.app/)
- **Repositorio:** [karimarquez/DAWfase](https://github.com/karimarquez/DAWfase)
- **Video de presentación:** [Ver video](https://drive.google.com/file/d/1Sq5DNyHT3w6Usxcg9uzepX4wsvYYJkvs/view?usp=drivesdk)
- **Mockups y documento de diseño (Figma):** [Abrir material de diseño del equipo](https://udbedu-my.sharepoint.com/:w:/g/personal/mo262840_alumno_udb_edu_sv/IQCt9hcC0QGIQZXCSpE2GnjmAZqz6gOaOb5JT3NFSpH5e4I?e=X2fSjv)

## Funcionalidades

- Catálogo de servicios, registro e inicio de sesión con cuentas de demostración.
- Reserva de citas con selección de servicio, especialista, fecha y horario.
- Consulta y cancelación de citas para clientes.
- Panel administrativo para gestionar servicios y estados de citas.
- Reporte anual con gráfica de citas confirmadas, pendientes y canceladas. La gráfica se calcula a partir de las reservas guardadas en el navegador.
- Consulta del clima de Soyapango mediante la API de [Open-Meteo](https://open-meteo.com/), con estados de carga, error y reintento.
- Mapa e indicaciones mediante OpenStreetMap y Google Maps.
- Diseño adaptable a móvil y escritorio.

## Tecnologías

- React 18, JavaScript y Vite
- Chart.js y react-chartjs-2
- SweetAlert2
- Open-Meteo y OpenStreetMap

## Requisitos y ejecución local

Se requiere Node.js 18 o posterior y npm.

```bash
npm ci
npm run dev
```

Vite muestra la dirección local en la terminal (por defecto, `http://localhost:5173`).

Para generar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@aesthetica.com` | `admin123` |
| Cliente | `cliente@aesthetica.com` | `cliente123` |

El pago en línea es una simulación académica: no se procesa ni se debe introducir una tarjeta real.

## Datos y limitaciones de la demo

Usuarios, servicios, sesión y citas se guardan en `localStorage`. Los reportes leen esas mismas citas, por lo que los datos son locales al navegador y no se comparten entre personas o dispositivos. La aplicación no tiene backend ni pasarela de pago real.

## Equipo

- Laureano Erasmo Barillas Valladares — BV253222
- Karen Lizeth Escalante Pérez — EP262414
- Karina Lisseth Márquez Ortiz — MO262840

## Colaboración

`main` es la rama de integración. Para esta entrega, la rama individual de Erasmo es `erasmo` (BV253222). Cada integrante debe trabajar con su propia cuenta y rama; no se atribuyen commits de un integrante a otro.

## Licencia

El código y la documentación originales de este proyecto se ofrecen bajo **Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**. Revisa [LICENSE](./LICENSE) y el [texto legal oficial](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode). Las dependencias y materiales externos conservan sus propias licencias y atribuciones.
