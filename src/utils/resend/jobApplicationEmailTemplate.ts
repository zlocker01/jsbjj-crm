export function generateJobApplicationEmailHtml(values: {
  name: string;
  email: string;
  message: string;
  attachment: {
    filename: string;
    content: Buffer;
  };
}) {
  return `
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>Nuevo mensaje desde tu sitio</h2>
          <p><strong>Nombre:</strong> ${values.name}</p>
          <p><strong>Email:</strong> ${values.email}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 6px;">
            ${values.message}
          </div>
          <hr />
          <p style="font-size: 12px; color: #999;">Adjunto se encuentra el CV del candidato.</p>
          <a href="${values.attachment.content}">${values.attachment.filename}</a>
          <p style="font-size: 12px; color: #999;">Este correo fue enviado desde el formulario de empleo de La Rochelle.</p>
        </body>
      </html>
    `;
}
