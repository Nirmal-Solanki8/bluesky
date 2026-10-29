# 🏊 Blue Sky International - Ultra-Luxury Swimming Pool Architecture & Engineering

Node.js, Express.js, MongoDB (Mongoose), Vanilla CSS & Bootstrap 5 પર આધારિત અલ્ટ્રા-લક્ઝરી સ્વિમિંગ પૂલ કંપનીની વેબસાઈટ અને એક્ઝિક્યુટિવ એડમિન પેનલ CMS.

---

## 🚀 ઝડપી શરૂઆત (Quick Setup & Local Run)

### 1. Dependencies Install કરો
```bash
npm install
```

### 2. ડેટાબેઝ સેટઅપ (Database Setup)
તમારા લોકલ MongoDB અથવા Cloud **MongoDB Atlas** નો કનેક્શન URL `.env` ફાઈલમાં મૂકો:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crystal_pools
SESSION_SECRET=bluesky_pools_secret_key_2026
NODE_ENV=development
```

### 3. ડેટાબેઝ ઈમ્પોર્ટ / સીડ કરો (Data Import & Seeding)
પ્રોજેક્ટમાં તૈયાર ડેટાબેઝ બેકઅપ સામેલ છે. નવો ડેટાબેઝ સેટઅપ કરવા માટે:
```bash
# આખો તૈયાર ડેટાબેઝ બેકઅપમાંથી ઈમ્પોર્ટ કરવા માટે (Recommended):
npm run import-db

# અથવા મૂળભૂત સીડ રન કરવા માટે:
npm run seed
```

---

## 🔐 એડમિન પેનલ એક્સેસ (Admin Credentials)

- **લૉગિન URL:** [http://localhost:5000/admin/login](http://localhost:5000/admin/login)
- **ડિફોલ્ટ એડમિન ઈમેઈલ:** `pritesh029@gmail.com`
- **ડિફોલ્ટ પાસવર્ડ:** `123456`
- **ગુપ્ત શૉર્ટકટ:** વેબસાઈટ પર ગમે ત્યાં રહીને કીબોર્ડ પર `Ctrl + Alt + A` દબાવવાથી સીધું લૉગિન પેજ ખૂલશે.

> *નોંધ: ક્લાયન્ટ લૉગિન કરીને **Company Settings -> Admin Account Security** માંથી પોતાનો નવો પાસવર્ડ સરળતાથી બદલી શકે છે.*

---

## 💾 ડેટાબેઝ બેકઅપ અને એક્સપોર્ટ (Backup & Export)
જ્યારે પણ ડેટાબેઝનો બેકઅપ લેવો હોય કે બીજા સર્વર પર લઈ જવો હોય:
```bash
# ડેટાબેઝ એક્સપોર્ટ કરવા માટે (database_backup/ માં JSON ફાઇલ્સ બનશે):
npm run export-db

# કોઈપણ નવા MongoDB / MongoDB Atlas માં રીસ્ટોર કરવા માટે:
npm run import-db
```

---

## 🌐 URLs
- **લાઈવ પબ્લિક સાઈટ:** [http://localhost:5000](http://localhost:5000)
- **એડમિન કંટ્રોલ પેનલ:** [http://localhost:5000/admin](http://localhost:5000/admin)

---

## 📁 પ્રોજેક્ટ ફોલ્ડર સ્ટ્રક્ચર (Clean MVC Architecture)
- `config/db.js` : MongoDB કનેક્શન પુલિંગ
- `models/` : Mongoose સ્કીમા (Admin, Inquiry, Service, Project, Product, Setting, Testimonial)
- `controllers/` : બિઝનેસ લોજિક (`publicController.js`, `adminController.js`)
- `routes/` : મોડ્યુલર URL રૂટ્સ (`publicRoutes.js`, `adminRoutes.js`)
- `views/` : EJS ટેમ્પલેટ્સ (`views/public/`, `views/admin/`)
- `public/` : CSS, JS અને વેબપી (WebP) ઈમેજીસ
- `database_backup/` : સંપૂર્ણ ડેટાબેઝ JSON બેકઅપ
- `utils/` : ડેટાબેઝ એક્સપોર્ટ, ઈમ્પોર્ટ અને સીડ સ્ક્રિપ્ટ્સ
