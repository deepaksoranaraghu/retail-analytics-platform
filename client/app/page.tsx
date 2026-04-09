"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [kpis, setKpis] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const kpiRes = await axios.get("http://localhost:5001/api/kpis");
      const catRes = await axios.get("http://localhost:5001/api/sales-by-category");
      const orderRes = await axios.get("http://localhost:5001/api/recent-orders");

      setKpis(kpiRes.data);
      setCategories(catRes.data);
      setOrders(orderRes.data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Retail Analytics Dashboard</h1>

      <h2>KPIs</h2>
      <p>Total Revenue: ${kpis?.totalRevenue}</p>
      <p>Total Orders: {kpis?.totalOrders}</p>

      <h3>Top Products</h3>
      <ul>
        {kpis?.topProducts?.map((p: any, i: number) => (
          <li key={i}>
            {p.product_name} - {p.total_quantity}
          </li>
        ))}
      </ul>

      <h2>Sales by Category</h2>
      <ul>
        {categories.map((c, i) => (
          <li key={i}>
            {c.category}: ${c.revenue}
          </li>
        ))}
      </ul>

      <h2>Recent Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.order_id} - {o.product_name} - ${o.price}
          </li>
        ))}
      </ul>
    </div>
  );
}