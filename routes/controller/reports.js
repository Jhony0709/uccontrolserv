const { pool } = require('../../dbconfig');

const getByStudent = async (req, res) => {
    const { id } = req.query;
    const report = await pool.query(`
        SELECT
            DATE(fecha_asistencia),
            e.dimension,
            e.descripcion as event_desc,
            st.nombre,
            st.apellido,
            ti.descripcion as tipo_doc,
            st.num_identificacion,
            sx.descripcion as sexo,
            pr.descripcion as programa
        FROM eventos_estudiante AS ee
        JOIN eventos AS e
            ON ee.id_evento = e.id
        JOIN tipo_evento AS te
            ON e.tipo_evento = te.id
        JOIN estudiantes AS st
            ON ee.id_estudiante = st.id
        JOIN tipo_identificacion AS ti
            ON st.tipo_identificacion = ti.id
        JOIN sexo AS sx
            ON st.sexo_id = sx.id
        JOIN programas AS pr
            ON st.programa_id = pr.id
        WHERE st.num_identificacion = $1
        ORDER BY fecha_asistencia DESC`, [id]);
    const hoursCount = await pool.query(`
        SELECT SUM(e.horas_otorgadas) AS total
            FROM eventos_estudiante AS ee
            JOIN eventos AS e
            ON ee.id_evento = e.id
            JOIN estudiantes AS st
            ON ee.id_estudiante = st.id
            WHERE st.num_identificacion = $1`, [id]);
    res.send({
        report: report.rows,
        hours: hoursCount.rows[0].total
    });
};

const getByEvent = async (req, res) => {
    const { id } = req.query;
    const report = await pool.query(`
        SELECT
            DATE(fecha_asistencia),
            e.dimension,
            e.descripcion as event_desc,
            st.nombre,
            st.apellido,
            ti.descripcion as tipo_doc,
            st.num_identificacion,
            sx.descripcion as sexo,
            pr.descripcion as programa
        FROM eventos_estudiante AS ee
        JOIN eventos AS e
            ON ee.id_evento = e.id
        JOIN tipo_evento AS te
            ON e.tipo_evento = te.id
        JOIN estudiantes AS st
            ON ee.id_estudiante = st.id
        JOIN tipo_identificacion AS ti
            ON st.tipo_identificacion = ti.id
        JOIN sexo AS sx
            ON st.sexo_id = sx.id
        JOIN programas AS pr
            ON st.programa_id = pr.id
        WHERE e.id = $1
        ORDER BY fecha_asistencia DESC`, [id]);
    res.send(report.rows);
};

module.exports = {
    getByEvent,
    getByStudent,
};
