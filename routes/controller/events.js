const nodemailer = require("nodemailer");
const { pool } = require('../../dbconfig');

const sendMail = async (mail, horas, evento) => {
    /// Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"UCC Control" <control@ucc.com>', // sender address
    to: mail, // list of receivers
    subject: "Horas registradas", // Subject line
    text: `Se registró ${horas} hora/s para el evento ${evento}`, // plain text body
    html: "", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const getEvents = async (req, res) => {
    const response = await pool.query("SELECT * FROM eventos");
    res.send(response.rows.length ? response.rows : response);
};

const newEvent = async (req, res) => {
    const {
        nombre,
        type,
        dateFrom,
        dateTo,
        dimension,
        horas,
    } = req.body;
    const response = await pool.query(
      `INSERT INTO eventos(
        tipo_evento, descripcion, hora_inicio, hora_fin, dimension, horas_otorgadas)
        VALUES (${type}, '${nombre}', '${dateFrom || new Date().toUTCString()}', '${dateTo || new Date().toUTCString()}', ${dimension}, ${horas});`
    );
    res.send(response.rows);
};

const editEvent = async (req, res) => {
    const {
        id,
        nombre,
        type,
        dateFrom,
        dateTo,
        dimension,
        horas,
    } = req.body;
    
    const response = await pool.query(
      `UPDATE eventos
        SET tipo_evento = $1, descripcion = $2, hora_inicio = $3, hora_fin = $4, dimension = $5, horas_otorgadas = $6
      WHERE id = $7`, [
          type,
          nombre,
          dateFrom,
          dateTo,
          dimension,
          horas,
          id
      ]
    );
    res.send(response);
}

const deleteEvent = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM eventos WHERE id = $1', [id]);

    res.json(`Evento eliminado`);
}

const getEventTypes = async (req, res) => {
    const response = await pool.query("SELECT * FROM tipo_evento");
    res.send(response.rows.length ? response.rows : response);
};

const regEstEvent = async (req, res) => {
    const {
        id_estudiante,
        id_evento
    } = req.body;

    const validateDate = await pool.query(`SELECT * FROM eventos_estudiante WHERE DATE(fecha_asistencia) = $1 AND id_estudiante = $2 AND id_evento = $3;`, [
        formatDate(new Date()),
        id_estudiante,
        id_evento
    ]);

    if (validateDate.rows.length === 0) {
        const response = await pool.query(`INSERT INTO public.eventos_estudiante(id_estudiante, id_evento, fecha_asistencia) VALUES (${id_estudiante}, ${id_evento}, '${formatDate(new Date())}');`);
        const getEventEst = await pool.query(`
            SELECT st.email, ev.descripcion, ev.horas_otorgadas
            FROM estudiantes AS st
            JOIN eventos_estudiante AS ee
                ON ee.id_estudiante = st.id
            JOIN eventos AS ev
                ON ee.id_evento = ev.id
            WHERE st.id = ${id_estudiante}
            AND ev.id = ${id_evento};
        `);
        const datos = getEventEst.rows[0];
        sendMail(datos.email, datos.horas_otorgadas, datos.descripcion);
        res.send(response.rows);
    } else {
        res.status(500).send({message: 'No es posible registrar dos veces el mismo evento para el mismo día'});
    }
};

module.exports = {
    getEvents,
    newEvent,
    getEventTypes,
    regEstEvent,
    editEvent,
    deleteEvent,
};
