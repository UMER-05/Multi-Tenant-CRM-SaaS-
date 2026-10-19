import cron from "node-cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { Op } from "sequelize";
import Task from "../models/task.model.js";
import {User} from '../models/associations.js';
import { transporter } from "../config/nodeMailer.js";

cron.schedule("10 * 8 * * *", async () => {
  console.log(" Running Task Reminder Cron...");

 
  try {
    const targetDate = dayjs().add(2, "day").startOf("day");

    const tasks = await Task.findAll({
      where: {
        status: { [Op.ne]: "completed" },
        due_date: {
          [Op.between]: [targetDate.toDate(), targetDate.endOf("day").toDate()],
        },
      },
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ["email", "full_name"],
        },
      ],
    });

    for (const task of tasks) {
      if (!task.assignedUser?.email) continue;

      await transporter.sendMail({
        from: `"Task Manager" <${process.env.EMAIL_USER}>`,
        //to: task.assignedUser.email,
        to: 'uk4354314@gmail.com',

        subject: `⏰ Task Due Soon: ${task.taskName}`,
        html: `
          <h3>Hello ${task.assignedUser.full_name},</h3>
          <p>Your task <strong>${
            task.taskName
          }</strong> is due in <b>2 days</b>.</p>
          <p><b>Due Date:</b> ${dayjs(task.due_date).format("DD MMM YYYY")}</p>
          <p>Please make sure to complete it on time.</p>
          <br/>
          <p>— Task Management System</p>
        `,
      });

      console.log(` Reminder sent to ${task.assignedUser.email}`);
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
});
