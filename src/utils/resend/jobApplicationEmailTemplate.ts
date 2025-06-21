export const sendJobApplicationEmail = async ({
  name,
  email,
  message,
  attachment,
}) => {
      from: "La Rochelle <onboarding@resend.dev>", 
      subject: `Nueva solicitud de trabajo de ${name}`,
      reply_to: email,
      html: `
        <h1>Nueva Solicitud de Trabajo</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message || "El candidato no dejó un mensaje."}</p>
      `,
      attachments: [
        {
          filename: attachment.filename,
          content: attachment.content,
        },
      ],
    });

    return data;
  } catch (error) {
    console.error("Error sending job application email:", error);
    throw new Error("Failed to send email.");
  }
};
