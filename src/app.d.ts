import 'unplugin-icons/types/svelte'
import type PocketBase from 'pocketbase'
import type { AuthModel } from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			// auth: import("lucia").AuthRequest;
			pb: PocketBase;
			user: AuthModel | undefined;
		}

		interface PageData {
			flash?: {
				type: "success" | "error" | "info" | "warning";
				message: string;
			};
		}

	}
}

/// <reference types="lucia" />
declare global {
	declare namespace Lucia {
		type Auth = import("$lib/server/lucia").Auth;
		type DatabaseUserAttributes = {
			username: string;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
