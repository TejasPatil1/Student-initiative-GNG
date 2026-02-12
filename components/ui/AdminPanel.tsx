"use client";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";

export default function AdminPanel() {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "pending"));
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchData(); }, []);

  const approve = async (item: any) => {
    await addDoc(collection(db, "published"), item);
    await deleteDoc(doc(db, "pending", item.id));
    fetchData();
  };

  const reject = async (id: string) => {
    await deleteDoc(doc(db, "pending", id));
    fetchData();
  };

  return (
    <div>
      <h2>Pending Uploads</h2>
      {data.map(item => (
        <div key={item.id} style={{ margin:"10px", padding:"10px", border:"1px solid #ccc" }}>
          <p><b>{item.title}</b> | {item.subject} | {item.year} | {item.type}</p>
          <a href={item.fileUrl} target="_blank">View File</a><br />
          <button onClick={() => approve(item)}>Approve</button>
          <button onClick={() => reject(item.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}
