"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type KPIData = {
  totalRevenue: string;
  totalOrders: string;
  topProducts: { product_name: string; total_quantity: string }[];
};

type CategorySales = {
  category: string;
  revenue: string;
};

type Order = {
  id: number;
  order_id: string;
  product_name: string;
  category: string;
  quantity: number;
  price: string;
  region: string;
  order_date: string;
};

export default function Home() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [categories, setCategories] = useState<CategorySales[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, catRes, orderRes] = await Promise.all([
          axios.get("http://localhost:5001/api/kpis"),
          axios.get("http://localhost:5001/api/sales-by-category"),
          axios.get("http://localhost:5001/api/recent-orders"),
        ]);

        setKpis(kpiRes.data);
        setCategories(catRes.data);
        setOrders(orderRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold text-slate-800">
          Retail Analytics Dashboard
        </h1>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              ${kpis?.totalRevenue ?? "0"}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-slate-500">Total Orders</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {kpis?.totalOrders ?? "0"}
            </h2>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold text-slate-800">
              Top Products
            </h3>
            <div className="space-y-3">
              {kpis?.topProducts?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="font-medium text-slate-700">
                    {item.product_name}
                  </span>
                  <span className="text-slate-500">{item.total_quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold text-slate-800">
              Sales by Category
            </h3>
            <div className="space-y-3">
              {categories.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="font-medium text-slate-700">
                    {item.category}
                  </span>
                  <span className="text-slate-500">${item.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="mb-4 text-xl font-semibold text-slate-800">
            Recent Orders
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm text-slate-500">
                  <th className="px-3 py-3">Order ID</th>
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Quantity</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Region</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b text-sm">
                    <td className="px-3 py-3">{order.order_id}</td>
                    <td className="px-3 py-3">{order.product_name}</td>
                    <td className="px-3 py-3">{order.category}</td>
                    <td className="px-3 py-3">{order.quantity}</td>
                    <td className="px-3 py-3">${order.price}</td>
                    <td className="px-3 py-3">{order.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}