# 📚 bookly**ai** (In Progress)
An AI-Powered Ebook Generator that actually works. Powered by 🤖 GPT-4o.
Built with 🚀 Next.js 15 App Router, 🟦 TypeScript, 🍃 MongoDB, ☁️ AWS S3 & 🌐 CloudFlare, and 💳 Paddle.

## ✨ Features
- 🛠️ Created using **Next.js 15**
- 🗂️ Uses **MongoDB** as its primary database and AWS **S3** and **CloudFlare** for PDF storage
- 🔒 Implemented with user Authentication (Google OAuth) using Auth.js
- 📖 Allows users to generate ebook based on a `topic`, `target audience`, and `description`
- 📄 Chapter previews for individual chapters before the final book is generated
- 🌟 Powered by **GPT-4o** model for quality generations
- ⏱️ Real-time book generation status updates
- 🎨 Relatively clean UI *(lmao)* with **ShadCN**.
### 📝 Current To-Do's
- 💵 Integrate **Paddle** for payments
- 🌐 Implement **CloudFlare** CDN (Currently restricted due to AWS issues)
- 🔐 Add more security to requests.

## 🛠️ How to Run booklyai Locally

### 1. **System Requirements**
Make sure you have the following installed on your system:
- 🟦 **Node.js**: v18 or later (to support Next.js 15)
- 🍃 **MongoDB** 
- 🧰 **npm** or **yarn**: For managing packages
- ☁️ **AWS Credentials** (if testing S3 integration locally)

### 2. Setup Environment Variables
View the `sample.env` file to guide you.

### 3. **Clone the Repository**
```bash
git clone https://github.com/drxc00/booklyai.git
cd booklyai
```

### 4. Set Up the Database with Prisma
1. Generate the Prisma Client:
    ```bash
    npx prisma generate
    ```
2. Migrate the Database:
    ```bash
    npx prisma db push
    ```


### 5. Run the Development Server
Start the development server with:
```bash
npm run dev  
# OR if using yarn  
yarn dev  
```
The app should now be running at: http://localhost:3000