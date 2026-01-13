require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const { syncDatabase } = require('./src/models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connetti database
  await connectDB();
  
  // Sincronizza models (crea tabelle)
  await syncDatabase();

  // Avvia server
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║                                        ║
║        🎬 GluGluPop Backend API        ║
║                                        ║
║  🚀 Server: http://localhost:${PORT}      ║
║  📝 Environment: ${process.env.NODE_ENV}           ║
║  💾 Database: SQLite                   ║
║                                        ║
╚════════════════════════════════════════╝
    `);
  });
};

startServer().catch(err => {
  console.error('❌ Errore avvio server:', err.message);
  process.exit(1);
});

// Gestione errori
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});