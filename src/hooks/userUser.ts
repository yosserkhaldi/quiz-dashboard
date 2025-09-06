"use client";

import useSWR from "swr";
import { request } from "@/lib/api";
import { swrConfig } from "@/lib/swr";

export type Wallet = { _id: string; userId: string; balance: number; history: any[] };

export type UserDetails = {
    _id: string;
    username?: string;
    email?: string;
    isGuest: boolean;
    isBanned?: boolean;
    roles?: string[];
    stats?: { totalGames?: number; totalWins?: number; totalCoins?: number };
    coins?: number;
    xp?: number;
    streak?: number;
    achievements?: any[];
    cosmetics?: { equipped?: { avatar?: string | null }, owned?: any[] };
    guestKey?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type UserEnvelope = { user: UserDetails; wallet?: Wallet };

export const buildUserKey = (id?: string) => (id ? `/api/users/${id}` : null);

export function useUser(id?: string) {
    const key = buildUserKey(id);
    return useSWR<UserEnvelope>(
        key,
        swrConfig
    );
}

