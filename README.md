# Café Reward System

A simple and efficient customer loyalty tracking system for cafés. Track customer purchases, reward loyal customers, and grow your business with this easy-to-use digital punch card alternative.

![WhatsApp Image 2025-04-21 at 14 18 56_edb81ecc](https://github.com/user-attachments/assets/54e43393-9b24-4162-85a5-8373a3fb7793)
![WhatsApp Image 2025-04-21 at 14 18 57_8c2a5a60](https://github.com/user-attachments/assets/36721d63-7981-41f9-bc9e-5180b840f060)



## 🚀 Features

- Customer registration via phone number
- Purchase tracking system
- Reward eligibility at 5 purchases
- Easy progress checking for customers
- Admin dashboard for café staff
- Responsive design for all devices

## 💻 Tech Stack

- **Frontend:** Next.js 15
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS with shadcn/ui components
- **Zod:** For creating typeScript Types

## 📋 Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Mahmoudbaky/reward-system.git
cd reward-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables by creating a `.env` file:
```
DATABASE_URL="your-postgreSql-url"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 📱 Usage

### For Café Staff
1. Register new customers by entering their phone number
2. Record new purchases to the customer's account
3. View customer progress and manage rewards

### For Customers
1. Enter phone number to check reward progress
2. Receive notification when 5 purchases are reached
3. Redeem reward at the café


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

If you have any questions or feedback, please reach out to us at cafe@example.com

---

Made with ☕ and code
