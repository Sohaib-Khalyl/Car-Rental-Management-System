# 🚗 Teima Cars — Premium Car Rental Management System

Teima Cars is a premium, state-of-the-art Car Rental Management System designed with a striking modern aesthetic and rich features. Built on a hybrid architecture of a high-performance backend and an interactive client application, it delivers a seamless booking experience and a robust administrative suite.

---

## ✨ Features

### 🌌 User Experience & Frontend
* **Stunning Modern Design**: A curated visual experience featuring glassmorphism, harmonious dark-mode palettes, smooth gradients, and custom micro-animations powered by **Motion**.
* **Intelligent Recommendation Wizard**: A multi-step questionnaire that dynamically matches user preferences and schedules to available fleet vehicles.
* **Vehicle Catalog & Interactive Reservation**: Dynamic listing page with grid/list layout toggle, category filters, real-time duration pricing calculators, and immediate check-out.
* **User Profile Hub**: Enables renters to view reservation histories, print custom receipts, review billing sheets, and adjust profile identities.
* **Localization & Translations**: Built-in internationalization (i18n) support to seamlessly translate interface components.
* **Dual Theme Preservation**: Seamless transition between light and dark modes with persistent state preservation.

### 🛡️ Administrative Command Center
* **Real-time Performance Analytics**: Dynamic tracking of gross revenue, average fleet utilization rates, active bookings, and member sign-ups.
* **Fleet Mix & Revenue Velocity Charts**: Live visual telemetry of vehicle classifications and monthly revenue trends powered by **Chart.js** and **React-Chartjs-2**.
* **Fleet Sync Manager**: Provision new vehicles (with real-time file upload for car images), update pricing, adjust specifications, and archive fleet items.
* **Rentals Hub**: Review, approve, and reject user bookings instantly, triggering real-time reservation status updates.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Core** | Laravel 11, PHP 8.4 |
| **Frontend Core** | React 19, TypeScript, React Router 7 |
| **Styling & Motion** | TailwindCSS v4, Motion (Framer Motion) |
| **Icons & Graphs** | Lucide React, Chart.js, React-Chartjs-2 |
| **Build Tools** | Vite, Composer |
| **Formatting & Linting** | Laravel Pint, ESLint, Prettier |

---

## 🚀 Installation & Local Setup

Follow these steps to set up the project locally:

### 1. Prerequisites
Ensure you have the following installed on your system:
* **PHP >= 8.2** (with common extensions: `pdo_mysql`, `mbstring`, `openssl`, etc.)
* **Composer**
* **Node.js >= 18** & **NPM**
* **MySQL** or **MariaDB**

### 2. Clone and Configure
1. Clone this repository to your local system.
2. Inside the root folder, duplicate `.env.example` and name it `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and configure your database parameters:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=car_rental_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

### 3. Install Dependencies
Run the package installations for both backend and frontend environments:
```bash
# Install PHP dependencies
composer install

# Install JS packages
npm install
```

### 4. Database Initialization & Seeding
Generate your application key, run database migrations, and seed the tables with pre-configured fleet data:
```bash
# Generate encryption key
php artisan key:generate

# Run database migrations
php artisan migrate

# Seed catalog, users, and vehicles
php artisan db:seed
```

### 5. Running the Application
Launch both development servers concurrently:
```bash
# Start the Laravel backend server
php artisan serve

# Start the Vite frontend dev server (in a separate terminal)
npm run dev
```

Visit the application at the local host URL provided by Vite (typically `http://localhost:5173`).

---

## 🧼 Code Quality & Style Compliance

The project enforces high code quality, compliant typing, and strict linting rules:
```bash
# Check and auto-fix frontend code compliance (ESLint & Prettier)
npm run lint

# Format PHP code style
vendor/bin/pint
```
Before pushing changes, run the linter to ensure that all TypeScript types, unused variables, and React rules of hooks are fully respected.
