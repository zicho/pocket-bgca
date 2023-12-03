import { z } from "zod";

export const upsertProfileSchema = z.object({
	description: z
		.string({})
		.max(400, { message: "Profile description can't exceed 400 characters." })
		.trim(),
	signature: z.string({}).max(45, { message: "Signature can't exceed 40 characters." }).trim()
}).pick({
	// put the fields you want to validate here
	description: true,
	signature: true
});