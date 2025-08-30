import useSWR, { SWRConfiguration, SWRResponse } from "swr";

export const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const swrConfig: SWRConfiguration = {
    fetcher,
    revalidateOnFocus: false,
    keepPreviousData: true,
};

export { useSWR }; export type { SWRResponse };

