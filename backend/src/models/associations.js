import User from "./user.model.js";
import Tenant from "./tenant.model.js";
import Task from "./task.model.js";
import Stage from "./stage.model.js";
import Pipeline from "./pipeline.model.js";
import Lead from "./lead.model.js";
import TaskNote from "./taskNotes.model.js";
import TaskNoteAttachment from './taskAttachments.model.js'
User.belongsTo(Tenant, {  foreignKey: "tenant_id",  onDelete: "CASCADE",});
Tenant.hasMany(User, {  foreignKey: "tenant_id",  onDelete: "CASCADE",});
Task.belongsTo(User, {  foreignKey: "created_by",  as: "createdBy",  onDelete: "CASCADE",});
User.hasMany(Task, {  foreignKey: "created_by",  as: "creator",  onDelete: "CASCADE",});

Task.belongsTo(User, {  foreignKey: "updated_by",  as: "updatedBy",  onDelete: "CASCADE",});
User.hasMany(Task, {  foreignKey: "updated_by",  as: "updater",  onDelete: "CASCADE",});

Task.belongsTo(User, {  foreignKey: "assigned_user",  as: "assignedUser",  onDelete: "CASCADE",});
User.hasMany(Task, {  foreignKey: "assigned_user",  });

Task.belongsTo(Lead, {  foreignKey: "assigned_lead",  as: "assignedLead",  onDelete: "CASCADE",});
Lead.hasMany(Task, {  foreignKey: "assigned_lead",  });

//  pipelines || Stages || Leads
Pipeline.belongsTo(Tenant, { foreignKey: "tenant_id",});
Tenant.hasMany(Pipeline, {foreignKey: "tenant_id",  onDelete: "CASCADE",
});

Stage.belongsTo(Pipeline, {  foreignKey: "pipeline_id",});
Pipeline.hasMany(Stage, {  foreignKey: "pipeline_id",  onDelete: "CASCADE",});

Stage.hasMany(Lead, { foreignKey: "pipeline_stage_id", onDelete: "CASCADE" });
Lead.belongsTo(Stage, { foreignKey: "pipeline_stage_id" });

Pipeline.hasMany(Lead, { foreignKey: "pipeline_id", onDelete: "CASCADE" });
Lead.belongsTo(Pipeline, { foreignKey: "pipeline_id" });

Tenant.hasMany(Lead, { foreignKey: "tenant_id", onDelete: "CASCADE" });
Lead.belongsTo(Tenant, { foreignKey: "tenant_id" });

Lead.belongsTo(User, { foreignKey: "assigned_user_id", as: "assignedUser" });
User.hasMany(Lead, { foreignKey: "assigned_user_id" });

//taskNotes
TaskNote.belongsTo(Task, { foreignKey: "task_id" });
Task.hasMany(TaskNote, { foreignKey: "task_id", onDelete: "CASCADE" });

TaskNote.belongsTo(User, { foreignKey: "created_by", as:'createdBy'});
User.hasMany(TaskNote, { foreignKey: "created_by", onDelete: "CASCADE" });
//note attachment 
TaskNoteAttachment.belongsTo(Task, { foreignKey:"task_id" })
Task.hasMany(TaskNoteAttachment, {foreignKey:'task_id' , onDelete:'CASCADE' })

TaskNoteAttachment.belongsTo(User, { foreignKey:'uploaded_by' })
User.hasMany(TaskNoteAttachment, { foreignKey:"uploaded_by", onDelete:"CASCADE" })

export { User, Tenant,Pipeline,Stage , Lead , Task, TaskNote,TaskNoteAttachment };
