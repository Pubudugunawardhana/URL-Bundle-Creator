<div align="center">
  <h1 align="center">URL Bundle Creator</h1>
  <p align="center">
    A beautiful, modern application to organize, share, and track progress on collections of URLs.
  </p>
</div>

<br />

## 🌟 Overview

**URL Bundle Creator** is a full-stack web application designed to help you curate collections of links (bundles). Whether you're putting together a learning path, a list of resources, or just organizing your bookmarks, this app provides a sleek, glass-morphism interface to manage them all.

## ✨ Features

- 🔗 **Curate Link Bundles:** Easily create and manage collections of URLs.
- 📈 **Progress Tracking:** Keep track of which links you have visited in a bundle.
- 🎨 **Modern UI/UX:** Built with a beautiful, responsive, frosted-glass design (Dark Mode supported!).
- 🔐 **Authentication:** Secure user signup and login powered by NextAuth.
- ❤️ **Favorites:** Mark your most used bundles as favorites for quick access.
- 🚀 **Serverless Ready:** Fully configured to be deployed on Vercel with a NestJS serverless backend.

## 🛠️ Technology Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (Optimized for Supabase/Neon)
- **Deployment:** Ready for Vercel Serverless (with Keep-Alive Cron Jobs)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need a PostgreSQL database (e.g., Supabase or Neon).

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/url-bundle-creator.git
cd url-bundle-creator
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="your_postgresql_database_url_here"
JWT_SECRET="your_super_secret_jwt_string"
FRONTEND_URL="http://localhost:3001"
```
Generate Prisma Client and push the schema:
```bash
npx prisma generate
npx prisma db push
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:3002"
NEXTAUTH_SECRET="your_super_secret_string"
NEXTAUTH_URL="http://localhost:3001"
```
Start the frontend development server:
```bash
npm run dev
```

Your app should now be running at `http://localhost:3001`!

## ☁️ Deployment

This project is fully configured for deployment on **Vercel**. 
1. Deploy the **Frontend** on Vercel as a standard Next.js project.
2. Deploy the **Backend** on Vercel as a separate Node.js project. Vercel will automatically detect the `vercel.json` configuration and deploy it as a serverless function with a 10-minute Keep-Alive Cron Job.
3. Don't forget to update your Production Environment Variables on the Vercel Dashboard!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
