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
        name: "BANCO DE ESPAÑA",
        address: "C/ de España 1, Madrid",
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

const utensiliosEjemplo = [
    {
        nombre: "GUANTES",
        precio: 20,
        descripcion: "Guantes de microfibra para evitar huellas",
        imagen: "assets/images/guantes.avif",
    },
    {
        nombre: "PASAMONTAÑAS",
        precio: 28,
        descripcion: "Pasamontañas para evitar ser descubierto",
        imagen: "assets/images/Pasamontanas.avif",
    },
    {
        nombre: "CORTACRISTALES",
        precio: 30,
        descripcion: "Cortacristales barato",
        imagen: "assets/images/Cortacristales.avif",
    },
    {
        nombre: "CORTACRISTALES CON VENTOSA",
        precio: 50,
        descripcion: "Cortacristales con ventosa, para mayor precisión",
        imagen: "assets/images/Cortacristales_Ventosa.avif",
    },
    {
        nombre: "CUERDA",
        precio: 25,
        descripcion: "Cuerda resistente para uso general",
        imagen: "assets/images/Cuerda.avif",
    },
    {
        nombre: "INHIBIDOR DE SEÑAL",
        precio: 300,
        descripcion: "Inhibidor de señal para evitar detección",
        imagen: "assets/images/Inhibidor.avif",
    },
    {
        nombre: "WALKIE TALKIE",
        precio: 60,
        descripcion: "Walkie Talkie para comunicación en el lugar",
        imagen: "assets/images/WalkieTalkie.avif",
    },
    {
        nombre: "GAFAS DE VISIÓN NOCTURNA",
        precio: 180,
        descripcion:
            "Gafas de visión nocturna para mejorar la visibilidad en condiciones de poca luz",
        imagen: "assets/images/GafasVisionNocturna.avif",
    },
    {
        nombre: "SPRAY REVELADOR DE LÁSER",
        precio: 5,
        descripcion: "Spray para revelar láser de seguridad",
        imagen: "assets/images/Spray.avif",
    },
    {
        nombre: "GANZUA PARA CERRADURAS",
        precio: 10,
        descripcion: "Ganzua para abrir cerraduras sin llave",
        imagen: "assets/images/Ganzua.avif",
    },
    {
        nombre: "PALANCA PARA ABRIR CERRADURAS",
        precio: 20,
        descripcion: "Palanca para abrir cerraduras sin llave",
        imagen: "assets/images/Palanca.avif",
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

async function seedUtensilios() {
    const utensiliosCollection = getCollection("utensilios");

    const borrado = await utensiliosCollection.deleteMany({});
    console.log(`Utensilios eliminados: ${borrado.deletedCount}`);

    const insercion = await utensiliosCollection.insertMany(utensiliosEjemplo);
    console.log(`Utensilios insertados: ${insercion.insertedCount}`);
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
    await seedUtensilios();
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
