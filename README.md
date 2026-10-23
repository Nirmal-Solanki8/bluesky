# 🏊 Crystal Pools - Swimming Pool Website & Admin Panel CMS

Node.js, Express.js અને MongoDB (Mongoose) પર આધારિત સ્વિમિંગ પૂલ કંપનીની વેબસાઇટ અને એડમિન પેનલ.

---

## 🚀 ઝડપી શરૂઆત (Quick Setup)

### 1. Dependencies Install કરો
```bash
npm install
```

### 2. MongoDB ચાલુ કરો
ખાતરી કરો કે તમારી સિસ્ટમમાં MongoDB સર્વિસ ચાલુ છે (`mongod` અથવા MongoDB Compass).
`.env` ફાઇલમાં કનેક્શન URL:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crystal_pools
SESSION_SECRET=crystal_pool_super_secret_key_2026
```

### 3. શરૂઆતી ડેટા અને એડમિન યુઝર સીડ (Seed) કરો
નીચે આપેલ કમાન્ડ રન કરવાથી ડિફોલ્ટ એડમિન એકાઉન્ટ અને સેમ્પલ સર્વિસીસ/પ્રોજેક્ટ્સ બની જશે:
```bash
npm run seed
```

**ડિફોલ્ટ એડમિન ક્રેડેન્શિયલ્સ:**
- **Email:** `admin@crystalpools.in`
- **Password:** `admin123`

### 4. પ્રોજેક્ટ રન કરો
```bash
# ડેવલપમેન્ટ મોડ (Auto-restart)
npm run dev

# અથવા સ્ટાન્ડર્ડ મોડ
npm start
```

---

## 🌐 URLs
- **પબ્લિક વેબસાઇટ:** [http://localhost:5000](http://localhost:5000)
- **એડમિન પેનલ:** [http://localhost:5000/admin/login](http://localhost:5000/admin/login)

---

## 📁 ફાઇલો અને ફોલ્ડર સ્ટ્રક્ચર
- `config/db.js` : MongoDB કનેક્શન
- `models/` : Mongoose સ્કીમા (Admin, Inquiry, Service, Project, Product, Setting)
- `controllers/` : બિઝનેસ લોજિક (પબ્લિક અને એડમિન કંટ્રોલર્સ)
- `routes/` : URL રૂટ્સ (`publicRoutes.js`, `adminRoutes.js`)
- `views/` : EJS ટેમ્પલેટ્સ (Public Pages & Admin Dashboard)
- `public/` : CSS, JS અને અપલોડ કરેલા ફોટો (`public/uploads`)
- `utils/seed.js` : ડમી ડેટા અને એડમિન સીડિંગ સ્ક્રિપ્ટ
