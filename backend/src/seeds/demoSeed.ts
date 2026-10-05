import { models } from "../db/db.js";
import { DEMO_EMAIL } from "../config/demoConfig.js";

// Contraseña pública de demostración: se hashea igual que cualquier
// contraseña de usuario (hook beforeCreate de models/User.ts).
const DEMO_PASSWORD = "Demo1234!";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

/**
 * Crea la cuenta demo pública, usuarios de relleno y un historial de
 * transacciones de ejemplo. Idempotente: si la cuenta demo ya existe
 * (identificada por email), no vuelve a crear nada.
 */
export async function seedDemoData(): Promise<void> {
  try {
    const existingDemo = await models.User.findOne({ where: { email: DEMO_EMAIL } });
    if (existingDemo) {
      console.log("ℹ️ Datos demo ya existen, se omite el seed.");
      return;
    }

    console.log("🌱 Creando datos demo...");

    const demo = await models.User.create({
      dni: "40000001",
      firstName: "Demo",
      lastName: "Virtual Wallet",
      email: DEMO_EMAIL,
      phone: "1120000001",
      password: DEMO_PASSWORD,
      alias: "demo.wallet",
      balance: 289750,
    });

    const ana = await models.User.create({
      dni: "40000002",
      firstName: "Ana",
      lastName: "Pérez",
      email: "ana.demo@virtualwallet.com",
      phone: "1120000002",
      password: DEMO_PASSWORD,
      alias: "ana.perez",
      balance: 167500,
    });

    const lucas = await models.User.create({
      dni: "40000003",
      firstName: "Lucas",
      lastName: "Gómez",
      email: "lucas.demo@virtualwallet.com",
      phone: "1120000003",
      password: DEMO_PASSWORD,
      alias: "lucas.gomez",
      balance: 182000,
    });

    const sofia = await models.User.create({
      dni: "40000004",
      firstName: "Sofía",
      lastName: "Martínez",
      email: "sofia.demo@virtualwallet.com",
      phone: "1120000004",
      password: DEMO_PASSWORD,
      alias: "sofia.martinez",
      balance: 208750,
    });

    const martin = await models.User.create({
      dni: "40000005",
      firstName: "Martín",
      lastName: "López",
      email: "martin.demo@virtualwallet.com",
      phone: "1120000005",
      password: DEMO_PASSWORD,
      alias: "martin.lopez",
      balance: 175000,
    });

    await models.Transaction.create({
      senderId: null,
      receiverId: demo.id,
      amount: 250000,
      type: "load",
      createdAt: daysAgo(20),
    });

    await models.Transaction.create({
      senderId: demo.id,
      receiverId: ana.id,
      amount: 32500,
      type: "transfer",
      createdAt: daysAgo(15),
    });

    await models.Transaction.create({
      senderId: lucas.id,
      receiverId: demo.id,
      amount: 18000,
      type: "transfer",
      createdAt: daysAgo(12),
    });

    await models.Transaction.create({
      senderId: demo.id,
      receiverId: demo.id,
      amount: 12000,
      type: "withdraw",
      createdAt: daysAgo(9),
    });

    await models.Transaction.create({
      senderId: demo.id,
      receiverId: sofia.id,
      amount: 8750,
      type: "transfer",
      createdAt: daysAgo(6),
    });

    await models.Transaction.create({
      senderId: martin.id,
      receiverId: demo.id,
      amount: 25000,
      type: "transfer",
      createdAt: daysAgo(3),
    });

    await models.Transaction.create({
      senderId: null,
      receiverId: demo.id,
      amount: 50000,
      type: "load",
      createdAt: daysAgo(1),
    });

    console.log("✅ Datos demo creados correctamente.");
  } catch (err) {
    console.error("⚠️ Error creando datos demo (el servidor continúa igualmente):", err);
  }
}
