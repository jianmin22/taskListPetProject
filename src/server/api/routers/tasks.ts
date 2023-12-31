import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
interface UserTask {
  taskID: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

interface TaskList {
  listID: string;
  taskID: string;
  taskDetails: string;
  sequence: number;
  status: boolean;
}

interface UserTaskWithTaskLists {
  userTask: UserTask;
  taskLists: TaskList[];
}
interface UserTaskList{
  taskLists: TaskList[];
}

export const tasksRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

    showUserTasks: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userTasks = await ctx.db.userTask.findMany({
        where: {
          userId: input.userId,
        }
      });

      const results: UserTaskWithTaskLists[] = [];

      for (const userTask of userTasks) {
        const taskLists = await ctx.db.taskList.findMany({
          where: {
            taskID: userTask.taskID,
          },
          orderBy: {
            sequence: 'asc',
          },
          take: 3,
        });
        results.push({
          userTask,
          taskLists,
        });
      }

      return results;
    }),
    showUserTasksList: publicProcedure
    .input(z.object({ taskId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const userTasks = await ctx.db.taskList.findMany({
          where: {
            taskID: input.taskId,
          },
        });
        return userTasks;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user tasks');
      }
    }),  
  createTask: publicProcedure
    .input(z.object({ title: z.string().min(1), userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userTask.create({
        data: {
          title: input.title,
          userId: input.userId,
          status: true,
        },
      });
    }),
  createTaskList: publicProcedure
  .input(z.object({ taskDetails: z.string().min(1) ,taskId: z.string().min(1),sequence: z.number(),}))
  .mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));  

    return ctx.db.taskList.create({
      data: {
        taskDetails: input.taskDetails,
        taskID: input.taskId,
        status:true,
        sequence:input.sequence,
      },
    });
  }),
    deleteTask: publicProcedure
    .input(z.object({ taskID: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.userTask.delete({
        where: {
          taskID: input.taskID
        },
      });

      await ctx.db.taskList.deleteMany({
        where: {
          taskID: input.taskID
        },
      });

      return "Delete Success";
    })
});
