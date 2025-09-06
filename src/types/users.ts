// types/users.ts
export type Role = "user" | "admin";

export interface UserRow {
    _id: string;
    username: string;
    email?: string | null;
    isGuest: boolean;
    isBanned?: boolean;
    roles?: Role[];
    xp?: number;
    streak?: number;
    stats?: {
        totalGames?: number;
        totalWins?: number;
    };
    createdAt: string;
}

export interface UsersListResponse {
    rows: UserRow[];
    total: number;
    page: number;
    pages: number;
}

export interface Wallet {
    _id: string;
    userId: string;
    coins: number;
}

export interface MeResponse {
    user: any;     // if you want, add a full typed version later
    wallet: Wallet | null;
}

export type UsersQuery = {
    page?: number;
    limit?: number;
    search?: string;
    isGuest?: boolean;
    isBanned?: boolean;
    role?: Role | "";
    sort?: "createdAt" | "-createdAt" | "username" | "-username";
};
