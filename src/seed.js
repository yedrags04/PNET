/* EJECUTAR ESTE SCRIPT CON `npm run start` */
const { connectDb, getCollection } = require("@src/db");

const bancosEjemplo = [
    {
        nombre: "BANCO DE ASTURIAS",
        direccion: "C/ Mayor 1, Oviedo",
        dificultad: "facil",
        recompensa: 300,
        disponible: true,
        imagen: "assets/images/banco-asturias.avif",
    },
    {
        nombre: "BANCO DE BARCELONA",
        direccion: "Paseo 2, Barcelona",
        dificultad: "alta",
        recompensa: 800,
        disponible: true,
        imagen: "assets/images/Banco-barcelona.avif",
    },
    {
        nombre: "BANCO DE ESPANA",
        direccion: "C/ de Espana 1, Madrid",
        dificultad: "media",
        recompensa: 550,
        disponible: true,
        imagen: "assets/images/banco-de-españa.avif",
    },
    {
        nombre: "BANCO DE MADRID",
        direccion: "C/ de Madrid 1, Madrid",
        dificultad: "alta",
        recompensa: 900,
        disponible: true,
        imagen: "assets/images/Banco-madrid.avif",
    },
    {
        nombre: "BANCO BANKINTER",
        direccion: "C/ de Bankinter 1, Madrid",
        dificultad: "media",
        recompensa: 600,
        disponible: true,
        imagen: "assets/images/bankinter.avif",
    },
    {
        nombre: "BANCO BBVA",
        direccion: "C/ de BBVA 1, Madrid",
        dificultad: "alta",
        recompensa: 850,
        disponible: true,
        imagen: "assets/images/BBVA.avif",
    },
    {
        nombre: "CASA DE LA MONEDA BARCELONA",
        direccion: "C/ de la Moneda 1, Barcelona",
        dificultad: "media",
        recompensa: 650,
        disponible: true,
        imagen: "assets/images/Casa-de-la-moneda-barceona.avif",
    },
    {
        nombre: "CASA DE LA MONEDA PARIS",
        direccion: "C/ de la Moneda 1, Paris",
        dificultad: "alta",
        recompensa: 1000,
        disponible: true,
        imagen: "assets/images/casa-de-la-moneda-paris.avif",
    },
    {
        nombre: "CASA DE LA MONEDA SEGOVIA",
        direccion: "C/ de la Moneda 1, Segovia",
        dificultad: "media",
        recompensa: 500,
        disponible: true,
        imagen: "assets/images/casa-de-la-moneda-segobia.avif",
    },
    {
        nombre: "CASA DE LA MONEDA SEVILLA",
        direccion: "C/ de la Moneda 1, Sevilla",
        dificultad: "alta",
        recompensa: 750,
        disponible: true,
        imagen: "assets/images/Casa-de-la-moneda-sevilla.avif",
    },
    {
        nombre: "CASA DE LA MONEDA Y TIMBRE",
        direccion: "C/ de la Moneda 1, Y Timbre",
        dificultad: "media",
        recompensa: 590,
        disponible: true,
        imagen: "assets/images/Casa-de-la-moneda-y-timbre.avif",
    },
];

async function seedBancos() {
    await connectDb();
    const bancosCollection = getCollection("bancos");

    const borrado = await bancosCollection.deleteMany({});
    console.log(`Bancos eliminados: ${borrado.deletedCount}`);

    const insercion = await bancosCollection.insertMany(bancosEjemplo);
    console.log(`Bancos insertados: ${insercion.insertedCount}`);
}

seedBancos()
    .then(() => {
        console.log("Seed de bancos completada");
    })
    .catch((error) => {
        console.error("Error ejecutando la seed de bancos:", error);
        process.exitCode = 1;
    })
    .finally(() => {
        process.exit();
    });
