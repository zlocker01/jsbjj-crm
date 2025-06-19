export function generateContactEmailHtml(values: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}) {
  return `
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>Nuevo mensaje desde tu sitio</h2>
          <p><strong>Nombre:</strong> ${values.nombre}</p>
          <p><strong>Email:</strong> ${values.email}</p>
          <p><strong>Asunto:</strong> ${values.asunto}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 6px;">
            ${values.mensaje}
          </div>
          <hr />
          <p style="font-size: 12px; color: #999;">Este mensaje fue enviado desde el formulario de tu sitio web.</p>
        </body>
      </html>
    `;
}
