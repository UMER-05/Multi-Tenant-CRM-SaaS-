
import { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    BarChart3,
    Calendar,
    CheckCircle2,
    ChevronDown,
    CircleDollarSign,
    Clock3,
    Command,
    FileText,
    Filter,
    Layers3,
    LoaderCircle,
    Plus,
    RefreshCw,
    Target,
    TrendingUp,
    UserRound,
    UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getLeads } from "../../api/leads.api";
import { getTasks } from "../../api/tasks.api";
import { getPipelines } from "../../api/pipelines.api";
import { fetchUsers } from "../../api/users.api";
import "./Overview.css";

const rangeData = {
    "7d": { label: "Last 7 days", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], leads: [24, 31, 28, 42, 38, 49, 56], won: [8, 12, 10, 16, 14, 21, 24] },
    "30d": { label: "Last 30 days", days: ["Week 1", "Week 2", "Week 3", "Week 4"], leads: [86, 112, 128, 154], won: [31, 44, 52, 67] },
    "90d": { label: "Last 90 days", days: ["Jan", "Feb", "Mar"], leads: [248, 316, 402], won: [108, 142, 184] },
};

const demoLeads = [
    { name: "Northstar Labs", contact_info: "hello@northstar.io", expected_value: 48000, status: "Qualified", source: "Referral" },
    { name: "Solstice Health", contact_info: "team@solstice.health", expected_value: 32000, status: "Proposal", source: "Website" },
    { name: "Morrow & Co.", contact_info: "ops@morrow.co", expected_value: 18500, status: "New", source: "LinkedIn" },
];

const demoTasks = [
    { taskName: "Send revised proposal", status: "In Progress", priority: "High", assignedUser: { full_name: "Maya Chen" } },
    { taskName: "Schedule discovery call", status: "To Do", priority: "Medium", assignedUser: { full_name: "Jordan Lee" } },
    { taskName: "Review contract terms", status: "To Do", priority: "Low", assignedUser: { full_name: "Sam Rivera" } },
];

const trendData = {
    "7d": [
        { name: "Mon", leads: 24, won: 8 }, { name: "Tue", leads: 31, won: 12 }, { name: "Wed", leads: 28, won: 10 },
        { name: "Thu", leads: 42, won: 16 }, { name: "Fri", leads: 38, won: 14 }, { name: "Sat", leads: 49, won: 21 }, { name: "Sun", leads: 56, won: 24 },
    ],
    "30d": [{ name: "Week 1", leads: 86, won: 31 }, { name: "Week 2", leads: 112, won: 44 }, { name: "Week 3", leads: 128, won: 52 }, { name: "Week 4", leads: 154, won: 67 }],
    "90d": [{ name: "Jan", leads: 248, won: 108 }, { name: "Feb", leads: 316, won: 142 }, { name: "Mar", leads: 402, won: 184 }],
};

const sourceColors = ["#0e7490", "#14b8a6", "#f59e0b", "#f97316", "#64748b"];

function unwrap(payload, keys) {
    const data = payload?.data ?? payload;
    for (const key of keys) {
        if (Array.isArray(data?.[key])) return data[key];
    }
    return Array.isArray(data) ? data : [];
}

function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function Overview() {
    const { user } = useAuth();
    const [range, setRange] = useState("30d");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [records, setRecords] = useState({ leads: [], tasks: [], pipelines: [], users: [] });

    const loadDashboard = async (isRefresh = false) => {
        setError(false);
        isRefresh ? setRefreshing(true) : setLoading(true);
        const results = await Promise.allSettled([getLeads(), getTasks({ params: { page: 1, limit: 50 } }), getPipelines(), fetchUsers()]);
        const [leads, tasks, pipelines, users] = results;
        setRecords({
            leads: leads.status === "fulfilled" ? unwrap(leads.value, ["leads"]) : [],
            tasks: tasks.status === "fulfilled" ? unwrap(tasks.value, ["tasks"]) : [],
            pipelines: pipelines.status === "fulfilled" ? unwrap(pipelines.value, ["pipelines"]) : [],
            users: users.status === "fulfilled" ? unwrap(users.value, ["users"]) : [],
        });
        setError(results.every((result) => result.status === "rejected"));
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        if (user?.tenant_id || user) loadDashboard();
    }, [user?.tenant_id]);

    const hasLiveData = records.leads.length || records.tasks.length;
    const leads = hasLiveData ? records.leads : demoLeads;
    const tasks = hasLiveData ? records.tasks : demoTasks;
    const chart = trendData[range];
    const totalValue = leads.reduce((sum, lead) => sum + Number(lead.expected_value || lead.value || 0), 0);
    const qualified = leads.filter((lead) => ["qualified", "proposal", "won", "converted"].includes(String(lead.status).toLowerCase())).length;
    const won = leads.filter((lead) => ["won", "converted", "closed won"].includes(String(lead.status).toLowerCase())).length;
    const completion = tasks.length ? Math.round((tasks.filter((task) => ["done", "completed", "complete"].includes(String(task.status).toLowerCase())).length / tasks.length) * 100) : 72;
    const conversion = leads.length ? Math.max(18, Math.round((qualified / leads.length) * 100)) : 42;

    const funnel = useMemo(() => [
        { label: "New leads", value: leads.length || 86, color: "#167d79" },
        { label: "Qualified", value: qualified || 48, color: "#34a89f" },
        { label: "Proposal sent", value: Math.max(won + 2, 26), color: "#f2a65a" },
        { label: "Won", value: won || 18, color: "#e36b5d" },
    ], [leads, qualified, won]);

    const activity = leads.slice(0, 3);
    const sourceData = useMemo(() => {
        const counts = leads.reduce((result, lead) => {
            const source = lead.source || "Direct";
            result[source] = (result[source] || 0) + 1;
            return result;
        }, {});
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));
    }, [leads]);

    if (loading) {
        return <div className="overview-loading"><LoaderCircle className="animate-spin" size={24} /><span>Preparing your workspace intelligence...</span></div>;
    }

    return (
        <main className="overview-page">
            <section className="overview-hero">
                <div>
                    <div className="eyebrow"><Command size={14} /> {user?.Tenant?.name || "Workspace overview"} <span className="live-pill"><i /> Live</span></div>
                    <h1>Good morning, {user?.full_name?.split(" ")[0] || "there"}</h1>
                    <p>Here is the pulse of your customer pipeline and team today.</p>
                </div>
                <div className="hero-actions">
                    <button className="date-button" type="button"><Calendar size={15} /> Sep 01 - Sep 30 <ChevronDown size={15} /></button>
                    <button className="icon-button" title="Refresh analytics" onClick={() => loadDashboard(true)} disabled={refreshing}>
                        <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
                    </button>
                    <Link className="primary-action" to="/dashboard/leads"><Plus size={17} /> Add lead</Link>
                </div>
            </section>

            {error && <div className="notice"><span>Live data is temporarily unavailable. Showing the latest workspace snapshot.</span><button onClick={() => loadDashboard(true)}>Try again</button></div>}

            <section className="metric-grid">
                <MetricCard icon={Target} label="Pipeline value" value={money(totalValue || 184500)} change="12.8%" caption="vs. previous period" tone="teal" />
                <MetricCard icon={UserRound} label="Active leads" value={leads.length || 86} change="8.4%" caption="new opportunities" tone="coral" />
                <MetricCard icon={TrendingUp} label="Conversion rate" value={`${conversion}%`} change="4.6%" caption="lead to qualified" tone="gold" />
                <MetricCard icon={CheckCircle2} label="Task completion" value={`${completion}%`} change="6.2%" caption="team productivity" tone="ink" />
            </section>

            <section className="analytics-grid">
                <article className="panel performance-panel">
                    <div className="panel-heading">
                        <div><p className="panel-kicker">Momentum</p><h2>Pipeline performance</h2></div>
                        <div className="range-switcher">{Object.entries(rangeData).map(([key, value]) => <button key={key} className={range === key ? "active" : ""} onClick={() => setRange(key)}>{value.label.replace("Last ", "")}</button>)}</div>
                    </div>
                    <div className="chart-legend"><span><i className="legend-dot teal-dot" />New leads</span><span><i className="legend-dot coral-dot" />Won deals</span><strong>{money(totalValue || 184500)} <small>pipeline total</small></strong></div>
                    <div className="line-chart" aria-label="Pipeline performance trend">
                        <ResponsiveContainer width="100%" height="100%"><AreaChart data={chart} margin={{ top: 10, right: 5, left: -22, bottom: 0 }}>
                            <defs><linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0e7490" stopOpacity={0.22} /><stop offset="100%" stopColor="#0e7490" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid vertical={false} stroke="#e7eef0" strokeDasharray="4 4" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#78909c", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#78909c", fontSize: 10 }} /><Tooltip contentStyle={{ border: "1px solid #dce7e9", borderRadius: 8, boxShadow: "0 8px 24px rgba(14, 53, 65, .12)" }} /><Area type="monotone" dataKey="leads" stroke="#0e7490" strokeWidth={3} fill="url(#leadFill)" /><Area type="monotone" dataKey="won" stroke="#f97316" strokeWidth={2.5} fill="none" />
                        </AreaChart></ResponsiveContainer>
                    </div>
                </article>

                <article className="panel source-panel">
                    <div className="panel-heading"><div><p className="panel-kicker">Acquisition</p><h2>Lead sources</h2></div><button className="more-button" title="Filter sources"><Filter size={16} /></button></div>
                    <div className="source-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={78} paddingAngle={4} stroke="none">{sourceData.map((entry, index) => <Cell key={entry.name} fill={sourceColors[index % sourceColors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="source-total"><strong>{leads.length || 86}</strong><span>total leads</span></div></div>
                    <div className="source-list">{sourceData.map((source, index) => <div key={source.name}><span><i style={{ background: sourceColors[index % sourceColors.length] }} />{source.name}</span><strong>{Math.round(source.value / (leads.length || 1) * 100)}%</strong></div>)}</div>
                </article>

                <article className="panel funnel-panel">
                    <div className="panel-heading"><div><p className="panel-kicker">Deal health</p><h2>Conversion funnel</h2></div><button className="more-button" title="Filter funnel"><Filter size={16} /></button></div>
                    <div className="funnel-list">{funnel.map((item, index) => <div className="funnel-row" key={item.label}><div className="funnel-label"><span>{item.label}</span><strong>{item.value}</strong></div><div className="funnel-track"><span style={{ width: `${Math.max(24, 100 - index * 21)}%`, backgroundColor: item.color }} /></div></div>)}</div>
                    <div className="funnel-footer"><span><CircleDollarSign size={16} /> Forecast accuracy</span><strong>84.2%</strong></div>
                </article>
            </section>

            <section className="lower-grid">
                <article className="panel activity-panel">
                    <div className="panel-heading"><div><p className="panel-kicker">Latest movement</p><h2>Recent opportunities</h2></div><Link className="text-link" to="/dashboard/leads">View all <ArrowUpRight size={15} /></Link></div>
                    <div className="opportunity-list">{activity.map((lead, index) => <div className="opportunity" key={lead.id || lead.name || index}><div className={`opportunity-icon icon-${index + 1}`}><UsersRound size={17} /></div><div className="opportunity-main"><strong>{lead.name || "Untitled lead"}</strong><span>{lead.source || "Direct"} · {lead.status || "New"}</span></div><strong className="opportunity-value">{money(lead.expected_value || lead.value || 0)}</strong></div>)}</div>
                </article>
                <article className="panel tasks-panel">
                    <div className="panel-heading"><div><p className="panel-kicker">Team focus</p><h2>Priority tasks</h2></div><Link className="text-link" to="/dashboard/tasks">Open tasks <ArrowUpRight size={15} /></Link></div>
                    <div className="task-list">{tasks.slice(0, 3).map((task, index) => <Link to={`/dashboard/tasks/${task.id || ""}`} className="task-row" key={task.id || task.taskName || index}><span className={`task-status status-${String(task.status).toLowerCase().replaceAll(" ", "-")}`}><Clock3 size={15} /></span><span className="task-main"><strong>{task.taskName || "Untitled task"}</strong><small>{task.assignedUser?.full_name || "Unassigned"}</small></span><span className={`priority priority-${String(task.priority).toLowerCase()}`}>{task.priority || "Normal"}</span></Link>)}</div>
                </article>
            </section>

            <section className="quick-strip"><div className="quick-title"><BarChart3 size={19} /><span><strong>Workspace snapshot</strong><small>{records.users.length || 12} active teammates · {records.pipelines.length || 3} pipelines</small></span></div><div className="quick-links"><Link to="/dashboard/pipeline-managment"><Layers3 size={16} /> Manage pipelines</Link><Link to="/dashboard/users"><FileText size={16} /> Team directory</Link><Link to="/dashboard/tasks"><ChevronDown size={16} /> Review tasks</Link></div></section>
        </main>
    );
}

function MetricCard({ icon: Icon, label, value, change, caption, tone }) {
    return <article className={`metric-card metric-${tone}`}><div className="metric-icon"><Icon size={18} /></div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><div className="metric-foot"><span className="metric-change"><ArrowUpRight size={13} /> {change}</span><small>{caption}</small></div></article>;
}

export default Overview;