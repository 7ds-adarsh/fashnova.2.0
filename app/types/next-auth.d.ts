declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            name: string;
            email: string;
        };
    }

    interface User {
        id: string;
        role: string;
        name: string;
        email: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        name: string;
        email: string;
    }
}