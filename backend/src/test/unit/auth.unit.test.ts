import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("authentication unit test", () => {
    it("should hashed password correctly", async () => {
        const password = "123456";
        const hashedPassword = await bcrypt.hash(password, 10);

        expect( await bcrypt.compare(password, hashedPassword)).toBe(true);
    }); 

    it("should generate token correctly", async () => {
        const payload = {
            id : 1, 
            email : "user1@gmail.com",
            role : "User"
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn : "7d"
        });

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        expect((decoded as any).id).toBe(1);
        expect((decoded as any).role).toBe("User");
    })
})
