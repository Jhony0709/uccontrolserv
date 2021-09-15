const { pool } = require('../../dbconfig');

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
        VALUES (${type}, '${nombre}', '${dateFrom}', '${dateTo}', ${dimension}, ${horas});`
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
        const response = await pool.query(`INSERT INTO public.eventos_estudiante(id_estudiante, id_evento) VALUES (${id_estudiante}, ${id_evento});`);
        // TO-DO: Email notification
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
