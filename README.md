# 🔗 URL Bundle Creator

<div align="center">
  <p><strong>Share 20 links with 1 link. No signup required.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://imgshields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" />
  </p>
</div>

---

## 🌟 Overview

**URL Bundle Creator** is a beautifully designed, modern web application that allows you to package multiple URLs into a single, easily shareable link. Whether you are a teacher sharing resources, a developer sharing documentation, or a student organizing research, this tool makes link management elegant and effortless.

Built with a premium **Glassmorphism** UI, it supports both **Dark Mode** and **Light Mode**, automatically fetches website metadata (titles, descriptions, favicons), and provides multiple export options.

## ✨ Features

- **🎨 Premium UI/UX:** Stunning glassmorphism design with fluid animations.
- **🌗 Theme Toggle:** Seamlessly switch between Light and Dark modes (preference saved locally).
- **🤖 Smart Metadata Fetching:** Paste a link and instantly fetch the website's Title, Description, and Favicon.
- **🔄 Drag & Drop:** Easily reorder your links before generating the bundle.
- **📤 Export Anywhere:** Export your created bundles to **CSV**, **Markdown**, **TXT**, or **PDF**, or share them via QR Code.
- **⚡ Fast & Secure:** Built on Next.js App Router with Prisma & SQLite for blazing fast performance.
- **🚫 No Signup Needed:** Create and share bundles instantly without creating an account.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Custom Vanilla CSS (Glassmorphism)
- **Database:** SQLite
- **ORM:** [Prisma](https://www.prisma.io/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Drag & Drop:** `@hello-pangea/dnd`

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/Pubudugunawardhana/URL-Bundle-Creator.git
cd URL-Bundle-Creator
```

### 2. Install dependencies

```bash
npm install
```

*(Note: If you face peer dependency issues due to React versions, run `npm install --legacy-peer-deps`)*

### 3. Environment Variables

Create a `.env` file in the root directory. You can copy the provided example:

```bash
cp .env.example .env
```

Ensure your `.env` file has the correct database path:
```env
DATABASE_URL="file:./dev.db"
```

### 4. Setup the Database

Push the Prisma schema to your SQLite database:

```bash
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action!

## 📸 Screenshots

*(Add your screenshots here! E.g., `![Light Mode](path/to/image.png)`)*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
<div align="center">
  <i>Crafted with ❤️ for easy sharing.</i>
</div>
