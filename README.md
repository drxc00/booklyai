# 📚 bookly**ai** (In Progress)
An AI-Powered Ebook Generator that actually works. Powered by 🤖 GPT-4o.
Built with 🚀 Next.js 15 App Router, 🟦 TypeScript, 🍃 MongoDB, ☁️ AWS S3 & 🌐 Lambda functions, and 💳 LemonSqueezy.

## ✨ Features
- 🛠️ Created using **Next.js 15**
- 🗂️ Uses **MongoDB** as its primary database and AWS **S3** and **CloudFlare** for PDF storage
- 🔒 Implemented with user Authentication (Google OAuth) using Auth.js
- 📖 Allows users to generate ebook based on a `topic`, `target audience`, and `description`
- 📄 Chapter previews for individual chapters before the final book is generated
- 🌟 Powered by **GPT-4o** model for quality generations
### 📝 Current To-Do's
- 🔐 Add more security to requests.
- 🚀 Deploy to vps.


# Notes
This repository is for the front-end code of the site. I order to use the application, a separate lambda function deployed to aws is required, which is not available for the public. 