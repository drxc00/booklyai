import { z } from "zod";


export const generateFormSchema = z.object({
    booktopic: z.string().min(2),
    targetaudience: z.string().min(2),
    bookdescription: z.string(),
})