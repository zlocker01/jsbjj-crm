const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Función simple para cargar variables de .env.local manualmente
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (!fs.existsSync(envPath)) {
      console.error('❌ No se encontró el archivo .env.local');
      process.exit(1);
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Quitar comillas si las tiene
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        envVars[key] = value;
      }
    });
    return envVars;
  } catch (error) {
    console.error('Error leyendo .env.local:', error);
    process.exit(1);
  }
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local');
  console.log('Variables encontradas:', Object.keys(env));
  process.exit(1);
}

console.log(`📡 Probando conexión a: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  try {
    // Intentamos una operación muy simple que no requiera permisos especiales (auth.getSession)
    // O consultar una tabla pública. Probaremos auth primero que suele estar siempre disponible.
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Error al conectar:', error.message);
      if (error.cause) console.error('Causa:', error.cause);
    } else {
      console.log('✅ ¡CONEXIÓN EXITOSA!');
      console.log('   El cliente de Supabase pudo conectarse y obtener la sesión (aunque sea nula).');
      console.log('   Tu configuración es correcta.');
    }
  } catch (err) {
    console.error('❌ Error inesperado de conexión:', err.message);
    if (err.cause) console.error('Causa:', err.cause);
    console.log('\n💡 Sugerencia: Asegúrate de que Supabase esté corriendo localmente (`npx supabase start`).');
  }
}

checkConnection();
