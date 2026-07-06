"use client";

import React from "react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface LineChartProps {
  title: string;
  data: ChartData[];
  lines: Array<{
    key: string;
    color: string;
    label: string;
  }>;
  height?: number;
}

export function LineChart({
  title,
  data,
  lines,
  height = 300,
}: LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                name={line.label}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}