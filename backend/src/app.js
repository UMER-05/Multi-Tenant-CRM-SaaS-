import cors from 'cors';
import express from 'express';
import passport from "passport";
const app = express();

//importing routes
import authRoute from './routes/auth.route.js';
import tenantRoute from './routes/tenant.routes.js';
import taskRoute from './routes/task.routes.js';
import userRoute from './routes/user.routes.js';
import pipelineRoute from './routes/pipeline.routes.js';
import stageRoute from './routes/stage.routes.js';
import leadRoute from './routes/lead.routes.js';
import taskNoteRoute from './routes/taskNote.routes.js';
import taskAttachment from './routes/taskAttachment.routes.js'

import './cron/task.cron.js'
import './config/passport.js'
//configrations
app.use(cors());
app.use(express.json({limit: '32kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(passport.initialize());


//routes
app.use('/api/auth', authRoute);
app.use('/api/tenants',tenantRoute);
app.use('/api/tasks',taskRoute);
app.use('/api/users',userRoute);
app.use('/api/pipelines', pipelineRoute);
app.use('/api/stages', stageRoute);
app.use('/api/leads', leadRoute);
app.use('/api/task-notes', taskNoteRoute);
app.use('/api/task-attachments',taskAttachment)



export default app;