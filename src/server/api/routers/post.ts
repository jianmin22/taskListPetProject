import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),


  createTask: publicProcedure
  .input(z.object({ title: z.string().min(1) ,userId: z.string().min(1)}))
  .mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));  

    return ctx.db.userTask.create({
      data: {
        title: input.title,
        userId: input.userId,
        status:true,
      },
    });
  }),
});
