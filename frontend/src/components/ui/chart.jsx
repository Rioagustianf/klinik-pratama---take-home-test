import {
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Chart wrappers — distribusi antrean per status, konsisten dengan
 * design system SIMKLINIK (brand-600 + semantic status colors).
 */

const STATUS_COLORS = {
  Menunggu: "#f59e0b", // warning/amber
  CheckIn: "#3b82f6", // primary/blue
  Pemeriksaan: "#8b5cf6", // secondary/violet
  Selesai: "#22c55e", // success/green
  Batal: "#ef4444", // destructive/red
};

const statusColor = (status) =>
  STATUS_COLORS[status] || "#9ca3af";

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

/**
 * Bar chart horizontal — bagus untuk distribusi antrean per status.
 * data: [{ status, count }]
 */
export function BarChartComponent({ data = [], height = 250, className }) {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          dy={10}
        />
        <YAxis
          dataKey="status"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 13, fill: "#374151", fontWeight: 500 }}
          width={110}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [value, "antrean"]}
        />
        <Bar dataKey="count" layout="vertical" radius={[0, 6, 6, 0]} maxBarSize={40}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={statusColor(entry.status)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Donut chart — proporsi antrean per status.
 * data: [{ status, count }]
 */
export function PieChartComponent({ data = [], height = 220, className }) {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={2}
          dataKey="count"
          nameKey="status"
          label={({ status, percent }) =>
            `${status} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={statusColor(entry.status)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [value, "antrean"]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconSize={12}
          iconType="circle"
          wrapperStyle={{ paddingTop: 20 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}