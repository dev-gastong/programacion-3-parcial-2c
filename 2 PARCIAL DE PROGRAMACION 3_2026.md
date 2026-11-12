# **2°PARCIAL – PROGRAMACIÓN III**

## **Ampliación del Sistema de Gestión de Turnos Médicos**

**Modalidad:** Individual o grupal (máximo 2 integrantes).  
**Fecha de entrega y presentación:** Viernes 13 de noviembre de 2026\.

### **1\. Objetivo**

Continuar trabajando sobre el Sistema de Gestión de Turnos Médicos desarrollado durante la cursada, incorporando mejoras que permitan completar y fortalecer su funcionamiento.

No se deberá comenzar un proyecto nuevo ni volver a desarrollar las funcionalidades que ya se encuentran implementadas. El trabajo consiste en ampliar el sistema existente, aplicando los contenidos y las herramientas trabajadas durante la cursada.

### **2\. Actividades a realizar**

Cada estudiante o equipo deberá realizar las siguientes actividades:

**A. Incorporar nuevas validaciones**

Agregar al menos **dos validaciones nuevas** que mejoren el funcionamiento del sistema.

Se pueden considerar, entre otras, las siguientes situaciones:

* Evitar que se asignen turnos en fechas anteriores a la actual.  
* Evitar que un médico tenga dos turnos en el mismo horario.  
* Evitar que un paciente tenga dos turnos superpuestos.  
* Impedir que se modifique un turno que ya fue cancelado.  
* Verificar que los datos obligatorios estén completos antes de guardar.  
* Controlar que el médico pueda realizar la práctica solicitada.

Las validaciones deberán implementarse en el backend y, cuando corresponda, reflejarse también en el frontend, informando al usuario cuando una operación no pueda realizarse.

**B. Gestión de perfiles y sesiones (obligatorio) y una mejora funcional**

Todos los estudiantes o equipos deberán revisar, completar y demostrar el funcionamiento del manejo de perfiles y sesiones del sistema.

Se deberá:

* Contar con los perfiles de administrador, médico y paciente.  
* Identificar al usuario que inició sesión.  
* Controlar que cada usuario pueda acceder únicamente a las funcionalidades que le corresponden según su rol.  
* Proteger las rutas del backend mediante los mecanismos de autenticación y autorización trabajados durante la cursada.  
* Adaptar el frontend para mostrar las opciones correspondientes al perfil que inició sesión.  
* Verificar que un usuario no pueda acceder a funcionalidades de otro perfil modificando directamente la dirección de una página o realizando una petición a la API.

Si estas funcionalidades ya se encuentran implementadas, se deberá revisar su funcionamiento y demostrar que los controles de acceso se cumplen correctamente.

Además, cada estudiante o equipo deberá seleccionar e implementar **una mejora funcional adicional**, entre las siguientes posibilidades:

* **Reprogramación de turnos:** permitir modificar la fecha y el horario de un turno, respetando las reglas del sistema.  
* **Cancelación de turnos:** permitir cancelar un turno y actualizar su estado.  
* **Confirmación de turnos:** permitir confirmar un turno reservado.  
* **Búsqueda y filtros:** permitir consultar turnos por fecha, médico, paciente o estado.  
* **Gestión de pacientes o médicos:** completar o mejorar alguna operación CRUD.

También podrán proponer otra mejora, siempre que esté relacionada con el sistema y respete las reglas de negocio planteadas en el trabajo.

La mejora seleccionada deberá funcionar de manera integrada:

* **Frontend:** incorporar los formularios, botones o elementos necesarios para que el usuario pueda realizar la operación.  
* **Backend:** implementar la ruta, el controlador, la lógica y las validaciones necesarias.  
* **Base de datos:** realizar las consultas necesarias para recuperar, insertar, modificar o actualizar la información.

No será necesario modificar todas las capas si la mejora elegida no lo requiere, pero sí deberá existir una integración correcta entre los componentes que intervienen en la operación.

### **3\. Condiciones de implementación**

Las modificaciones deberán integrarse al proyecto existente, respetando la organización del código y los componentes utilizados durante la cursada:

* Rutas y controladores.  
* Servicios y consultas a MySQL.  
* Validaciones y middlewares, cuando corresponda.  
* Integración entre frontend y backend.  
* Manejo de respuestas y errores.

No se deberán incorporar tecnologías ni contenidos que no hayan sido trabajados durante la cursada.

### **4\. Pruebas**

Se deberán realizar pruebas de las modificaciones implementadas, verificando:

* Que las operaciones funcionen correctamente cuando los datos son válidos.  
* Que el sistema impida las operaciones que no cumplen las reglas establecidas.  
* Que el frontend muestre los mensajes correspondientes ante errores o situaciones no permitidas.  
* Que los cambios realizados se reflejen correctamente en la base de datos.  
* Que los permisos de acceso se respeten según el perfil del usuario.

Se podrán utilizar Thunder Client y la interfaz del sistema para comprobar su funcionamiento.

### **5\. Entrega y presentación**

El viernes 13 de noviembre cada estudiante o equipo deberá:

* Presentar el proyecto actualizado.  
* Mostrar las modificaciones realizadas.  
* Demostrar el funcionamiento de las nuevas validaciones.  
* Demostrar el manejo de perfiles, sesiones y permisos.  
* Presentar y demostrar la mejora funcional implementada.  
* Explicar brevemente qué modificó y cómo integró los cambios en el sistema.

**Evaluación individual:** aunque el trabajo pueda realizarse en equipo, durante la presentación ambos integrantes deberán demostrar que comprenden el código desarrollado y las decisiones tomadas. Se podrán realizar preguntas sobre las modificaciones implementadas y los contenidos trabajados durante la cursada.

### **6\. Entrega en Google Classroom**

Cada estudiante o equipo deberá realizar la entrega en la tarea de Google Classroom.

Se deberán presentar los siguientes elementos:

**1\. Enlace al repositorio de GitHub**

* Compartir el enlace al repositorio del proyecto actualizado.  
* Verificar que el repositorio sea accesible y que contenga los últimos cambios realizados.  
* El código deberá estar organizado y contar con los archivos necesarios para comprender el proyecto.  
* No subir archivos `.env` ni publicar contraseñas, credenciales o claves privadas.

**2\. Documento de modificaciones realizadas**

Presentar un documento breve en formato PDF (máximo 2 páginas) que incluya:

* Nombre y apellido de cada integrante.  
* Enlace al repositorio de GitHub.  
* Descripción de las dos validaciones incorporadas.  
* Descripción de la mejora funcional o modificación CRUD realizada.  
* Breve explicación de los archivos modificados.  
* Capturas de pantalla que permitan observar el funcionamiento de las modificaciones.

**Fecha límite de entrega:** viernes 13 de noviembre de 2026\.

**Importante:** si el trabajo se realiza en equipo, se deberá presentar una única entrega por grupo, incluyendo el enlace al repositorio y el documento PDF con los datos de ambos integrantes.

