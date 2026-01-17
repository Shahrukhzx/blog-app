import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {
        const adminData = {
            name: "Shahrukh Khan",
            email: "shahrukh.priv2@gmail.com",
            role: UserRole.ADMIN,
            password: "admin123"

        }
        // check if user already exists or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })
        if (existingUser) {
            throw new Error("Admin user already exists");
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            credentials: "include", // REQUIRED
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(adminData)
        })
        console.log(signUpAdmin)
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
}

seedAdmin()