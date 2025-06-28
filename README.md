# Proiect Licență – Comenzi de instalare și rulare

## 1. Repository Git

https://github.com/patriciabalint/weddit-fullstack-licenta.git

## 2. Linkuri aplicație (deploy)

- Frontend: https://weddit-frontend.vercel.app/
- Admin Panel: https://weddit-admin.vercel.app/
- Backend API: https://weddit-backend.vercel.app/

## 3.Cerințe minime pentru rulare

- Node.js v22: https://nodejs.org/en/download/
  > Alte librării vor fi instalate automat cu `npm install`.

## 4.Pași pentru rulare locală

### Rulare Backend:

```
cd backend
npm install
npm run server
```

> Serverul backend va rula pe `http://localhost:4000`

### Rulare Frontend

```
cd frontend
npm install
npm run dev
```

> Frontendul va rula pe `http://localhost:5173`

### Rulare Admin Panel

```
cd admin
npm install
npm run dev
```

> Admin Panel-ul va rula pe `http://localhost:5174`

## 5. Fișier `.env`

Exemplu structură `.env` în folderul `backend/`:

```env
JWT_SECRET = "your_jwt_secret"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin_password"

MONGODB_URI = "mongodb+srv://<username>:<password>@cluster.mongodb.net/..."

CLOUDINARY_API_KEY = ""
CLOUDINARY_SECRET_KEY = ""
CLOUDINARY_NAME = ""

STRIPE_SECRET_KEY = ""
```
