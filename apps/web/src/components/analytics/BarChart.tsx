"use client";

import React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface BarChartProps {
  title: string;
  data: any[];
  dataKey: string;
  color?: string;
  height?: number;
}

export function BarChart({
  title,
  data,
  dataKey,
  color = "#0066cc",
  height = 300,
}: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}