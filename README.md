# Gestor de Tasques - Autenticació JWT
API REST per a la gestió de tasques amb autenticació JWT i control d'accés per rols.
## Instal·lació
```
git clone <url-del-repositori>
cd OP1-B1-NODE-06_OriolTorra
npm install
```
## Crea un arxiu .env:
```
envMONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=la_teva_clau_secreta_super_segura
JWT_EXPIRES_IN=7d
PORT=3000
```
## Inicia el servidor:
```
npm start
```

## Variables d'Entorn
```
| Variable | Descripció | Obligatòria |
|----------|------------|-------------|
| MONGODB_URI | URI de connexió a MongoDB | Sí |
| JWT_SECRET | Clau secreta per JWT | Sí |
| JWT_EXPIRES_IN | Temps de validesa del token | Sí |
| PORT | Port del servidor | No |
```
## Endpoints

### Autenticació
```
POST   /api/auth/register          - Registrar usuari
POST   /api/auth/login              - Iniciar sessió
GET    /api/auth/me                 - Obtenir perfil (auth)
PUT    /api/auth/profile            - Actualitzar perfil (auth)
PUT    /api/auth/change-password    - Canviar contrasenya (auth)
```

### Tasques
```
GET    /api/tasks           - Llistar tasques (auth)
GET    /api/tasks/stats     - Estadístiques (auth)
GET    /api/tasks/:id       - Obtenir tasca (auth)
POST   /api/tasks           - Crear tasca (auth)
PUT    /api/tasks/:id       - Actualitzar tasca (auth)
DELETE /api/tasks/:id       - Eliminar tasca (auth)
```

### Administració
```
GET    /api/admin/users           - Llistar usuaris (admin)
GET    /api/admin/tasks           - Llistar totes les tasques (admin)
DELETE /api/admin/users/:id       - Eliminar usuari (admin)
PUT    /api/admin/users/:id/role  - Canviar rol (admin)
```
## Exemples d'Ús
### Registre
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Oriol Torra",
  "email": "oriol.torra24@lacetania.cat",
  "password": "1qazZAQ!"
}
```

### Resposta:
```
json{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Oriol Torra",
      "email": "oriol.torra24@lacetania.cat",
      "role": "user"
    }
  }
}
```
### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "oriol.torra24@lacetania.cat",
  "password": "1qazZAQ!"
}
```
### Crear tasca
```
POST /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Tasca PHP",
  "description": "Tasca PHP",
  "cost": 500,
  "hours_estimated": 10
}
```
### Llistar tasques
```
GET /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Sistema d'Autenticació

### Funcionament

1. L'usuari es registra o fa login amb email i contrasenya
2. La contrasenya es xifra amb bcrypt abans de guardar-se
3. El servidor genera un JWT signat amb JWT_SECRET
4. El client rep el token i l'envia a cada petició protegida
5. El middleware verifica el token abans de processar la petició

### Estructura del JWT

El token conté:
- userId: ID de l'usuari
- email: Email de l'usuari
- role: Rol (user o admin)
- iat: Data de creació
- exp: Data d'expiració

### Ús del token

Afegeix el header a cada petició protegida:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
### Rols

user: Pot gestionar només les seves tasques
admin: Pot gestionar tots els usuaris i tasques

Per crear un admin: canvia manualment el camp role a MongoDB o utilitza la ruta /api/admin/users/:id/role amb un admin existent.
Validacions
Registre:

Email vàlid i únic
Contrasenya mínim 6 caràcters amb majúscula, minúscula i número

### Autor

Oriol Torra - T7 Gestor de Tasques - OP1-B1-NODE






