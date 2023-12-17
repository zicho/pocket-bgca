import type { PageLoad } from './$types';

export const load = (async ({ data }) => {

    const poop = "poop";

    return {
        ...data,
        poop
    };
}) satisfies PageLoad;