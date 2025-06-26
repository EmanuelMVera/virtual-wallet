# Virtual Wallet Backend

Este proyecto es el backend de una billetera virtual tipo MercadoPago, desarrollado en Node.js, Express y Sequelize (PostgreSQL).

---

## Estructura de carpetas

```
backend/
│
├── src/
│   ├── app.ts                # Configuración principal de Express
│   ├── server.ts             # Punto de entrada del servidor
│   ├── controllers/          # Lógica de negocio y endpoints
│   ├── db/                   # Configuración y carga de base de datos y relaciones
│   ├── middlewares/          # Middlewares (autenticación, etc)
│   ├── models/               # Modelos Sequelize (User, Account, Transaction, BankAccount)
│   ├── routes/               # Definición de rutas agrupadas por recurso
│   └── types/                # Tipos TypeScript personalizados
│
├── .env                      # Variables de entorno (ver ejemplo abajo)
├── package.json
├── tsconfig.json
└── README.md                 # Este archivo
```

---

## Instalación y ejecución

1. Clona el repositorio y entra a la carpeta `backend`.
2. Instala dependencias:
   ```
   npm install
   ```
3. Configura el archivo `.env` (ver ejemplo abajo).
4. Ejecuta el servidor en desarrollo:
   ```
   npm run dev
   ```
   O en producción:
   ```
   npm run build
   npm start
   ```

---

## Ejemplo de archivo `.env`

```
PORT=3000

# Base de datos
DB_DIALECT=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=virtualwallet

# JWT
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRATION_TIME=3600

# Entorno
NODE_ENV=development
```

---

## Rutas principales

### Usuarios

#### Registrar usuario

- **POST** `/api/users/register`
- **Body:**
  ```json
  {
    "name": "Juan Amarillo",
    "email": "juan@example.com",
    "password": "123456"
  }
  ```

#### Login

- **POST** `/api/users/login`
- **Body:**
  ```json
  {
    "email": "juan@example.com",
    "password": "123456"
  }
  ```
- **Respuesta:**  
  Guarda el `token` para las siguientes rutas protegidas.

#### Logout

- **POST** `/api/users/logout`

---

### Cuentas virtuales

#### Listar cuentas del usuario

- **GET** `/api/accounts/list`
- **Headers:**  
  `Authorization: Bearer <token>`

#### Crear cuenta virtual adicional(proximamente utilidad)

- **POST** `/api/accounts/create`
- **Headers:**  
  `Authorization: Bearer <token>`

#### Obtener balance de la cuenta principal

- **GET** `/api/accounts/balance`
- **Headers:**  
  `Authorization: Bearer <token>`

#### Buscar cuenta por alias o CBU

- **GET** `/api/accounts/find?alias=juan.amarillo.ab12.vw`
- **GET** `/api/accounts/find?cbu=1234567890123456`
- **Headers:**  
  `Authorization: Bearer <token>`

---

### Cuentas bancarias ficticias

#### Registrar cuenta bancaria

- **POST** `/api/bank-accounts/register`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "bankName": "Banco Ficticio",
    "accountNumber": "1234567890"
  }
  ```

#### Listar cuentas bancarias del usuario

- **GET** `/api/bank-accounts/list`
- **Headers:**  
  `Authorization: Bearer <token>`

#### Depositar desde banco a billetera virtual

- **POST** `/api/bank-accounts/deposit`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "bankAccountId": 1,
    "walletAccountId": 2,
    "amount": 100.0
  }
  ```

---

### Transacciones

#### Transferir dinero a otra cuenta virtual

- **POST** `/api/transactions/transfer`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body (por id):**
  ```json
  {
    "senderAccountId": 1,
    "receiverAccountId": 2,
    "amount": 50.0
  }
  ```
- **Body (por alias):**
  ```json
  {
    "senderAccountId": 1,
    "receiverAlias": "juan.amarillo.ab12.vw",
    "amount": 50.0
  }
  ```
- **Body (por cbu):**
  ```json
  {
    "senderAccountId": 1,
    "receiverCbu": "1234567890123456",
    "amount": 50.0
  }
  ```

#### Listar transacciones del usuario

- **GET** `/api/transactions/list`
- **Headers:**  
  `Authorization: Bearer <token>`

---

## Notas

- Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`.
- El alias y el CBU de las cuentas virtuales son únicos y se generan automáticamente.
- El email siempre se guarda en minúsculas.
- El backend usa PostgreSQL como base de datos.
- Las transacciones pueden ser de tipo `"transfer"` (entre usuarios) o `"deposit"` (depósito desde banco).

---

## Contacto

Ema
