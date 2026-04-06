/* EJECUTAR ESTE SCRIPT CON `npm run start` */

const { connectDb, getCollection } = require("#src/db.js");

const bancosEjemplo = [
    {
        name: "BANCO DE ASTURIAS",
        address: "C/ Mayor 1, Oviedo",
        difficulty: "facil",
        reward: 300,
        available: true,
        image: "assets/images/banco-asturias.avif",
    },
    {
        name: "BANCO DE BARCELONA",
        address: "Paseo 2, Barcelona",
        difficulty: "alta",
        reward: 800,
        available: true,
        image: "assets/images/Banco-barcelona.avif",
    },
    {
        name: "BANCO DE ESPANA",
        address: "C/ de Espana 1, Madrid",
        difficulty: "media",
        reward: 550,
        available: true,
        image: "assets/images/banco-de-españa.avif",
    },
    {
        name: "BANCO DE MADRID",
        address: "C/ de Madrid 1, Madrid",
        difficulty: "alta",
        reward: 900,
        available: true,
        image: "assets/images/Banco-madrid.avif",
    },
    {
        name: "BANCO BANKINTER",
        address: "C/ de Bankinter 1, Madrid",
        difficulty: "media",
        reward: 600,
        available: true,
        image: "assets/images/bankinter.avif",
    },
    {
        name: "BANCO BBVA",
        address: "C/ de BBVA 1, Madrid",
        difficulty: "alta",
        reward: 850,
        available: true,
        image: "assets/images/BBVA.avif",
    },
    {
        name: "CASA DE LA MONEDA BARCELONA",
        address: "C/ de la Moneda 1, Barcelona",
        difficulty: "media",
        reward: 650,
        available: true,
        image: "assets/images/Casa-de-la-moneda-barceona.avif",
    },
    {
        name: "CASA DE LA MONEDA PARIS",
        address: "C/ de la Moneda 1, Paris",
        difficulty: "alta",
        reward: 1000,
        available: true,
        image: "assets/images/casa-de-la-moneda-paris.avif",
    },
    {
        name: "CASA DE LA MONEDA SEGOVIA",
        address: "C/ de la Moneda 1, Segovia",
        difficulty: "media",
        reward: 500,
        available: true,
        image: "assets/images/casa-de-la-moneda-segobia.avif",
    },
    {
        name: "CASA DE LA MONEDA SEVILLA",
        address: "C/ de la Moneda 1, Sevilla",
        difficulty: "alta",
        reward: 750,
        available: true,
        image: "assets/images/Casa-de-la-moneda-sevilla.avif",
    },
    {
        name: "CASA DE LA MONEDA Y TIMBRE",
        address: "C/ de la Moneda 1, Y Timbre",
        difficulty: "media",
        reward: 590,
        available: true,
        image: "assets/images/Casa-de-la-moneda-y-timbre.avif",
    },
];

function getReservasEjemplo(bankIds) {
    return [
        {
            leaderName: "El Profesor",
            leaderEmail: "profesor@heistcraft.test",
            experience: 15,
            bankId: bankIds["BANCO DE BARCELONA"],
            operationDate: "2026-03-01",
            operationTime: "14:30",
            teamSize: 8,
            riskLevel: "alto",
            budget: 50000,
            equipment: "Inhibidores, herramientas termicas y comunicaciones seguras",
            plan: "Entrada por servicio, control de accesos y extraccion en dos vehiculos",
            specialties: ["hacking", "driving", "combat"],
            status: "confirmada",
            createdAt: "2026-02-20T10:30:00.000Z",
        },
        {
            leaderName: "Berlin",
            leaderEmail: "berlin@heistcraft.test",
            experience: 12,
            bankId: bankIds["BANCO BANKINTER"],
            operationDate: "2026-02-28",
            operationTime: "10:15",
            teamSize: 6,
            riskLevel: "medio",
            budget: 30000,
            equipment: "Ganzuas, drones de reconocimiento y equipo tactico ligero",
            plan: "Reconocimiento previo, acceso simultaneo y salida escalonada",
            specialties: ["negotiation", "logistics"],
            status: "confirmada",
            createdAt: "2026-02-18T08:00:00.000Z",
        },
    ];
}

async function seedBancos() {
    const bancosCollection = getCollection("bancos");

    const borrado = await bancosCollection.deleteMany({});
    console.log(`Bancos eliminados: ${borrado.deletedCount}`);

    const insercion = await bancosCollection.insertMany(bancosEjemplo);
    console.log(`Bancos insertados: ${insercion.insertedCount}`);

    const bankIds = {};
    Object.entries(insercion.insertedIds).forEach(([index, objectId]) => {
        const banco = bancosEjemplo[Number.parseInt(index, 10)];
        bankIds[banco.name] = objectId.toHexString();
    });

    return bankIds;
}

async function seedReservas(bankIds) {
    const reservasCollection = getCollection("reservas");
    const reservasEjemplo = getReservasEjemplo(bankIds);

    const borrado = await reservasCollection.deleteMany({});
    console.log(`Reservas eliminadas: ${borrado.deletedCount}`);

    const insercion = await reservasCollection.insertMany(reservasEjemplo);
    console.log(`Reservas insertadas: ${insercion.insertedCount}`);
}

async function runSeed() {
    await connectDb();
    const bankIds = await seedBancos();
    await seedReservas(bankIds);
}

runSeed()
    .then(() => {
        console.log("Seed de bancos y reservas completada");
    })
    .catch((error) => {
        console.error("Error ejecutando la seed:", error);
        process.exitCode = 1;
    })
    .finally(() => {
        process.exit();
    });
