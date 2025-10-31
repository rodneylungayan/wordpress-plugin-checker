"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Page() {
  const [websites, setWebsites] = useState([]);
  const [newSite, setNewSite] = useState({ url: "", username: "", password: "" });
  const [editId, setEditId] = useState(null);

  const sitesRef = collection(db, "websites");

  const fetchSites = async () => {
    const snapshot = await getDocs(sitesRef);
    setWebsites(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const addWebsite = async () => {
    if (!newSite.url || !newSite.username || !newSite.password)
      return alert("Please fill in all fields");

    await addDoc(sitesRef, {
      ...newSite,
      createdAt: new Date().toISOString(),
    });
    setNewSite({ url: "", username: "", password: "" });
    fetchSites();
  };

  const updateWebsite = async (id) => {
    await updateDoc(doc(db, "websites", id), newSite);
    setEditId(null);
    setNewSite({ url: "", username: "", password: "" });
    fetchSites();
  };

  const deleteWebsite = async (id) => {
    if (confirm("Delete this website?")) {
      await deleteDoc(doc(db, "websites", id));
      fetchSites();
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] p-6">
      <img src="https://specialistpracticeexcellence.com.au/wp-content/uploads/2019/11/Minimal-Logo.png" alt="spe" className="w-30 mx-auto mb-5"/>
      <h1 className="text-3xl font-bold mb-6 text-center">Website Plugin Monitor</h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">
          {editId ? "Edit Website" : "Add New Website"}
        </h2>

        <div className="space-y-3">
          <input
            className="border border-[#1a1a1a] text-[#1a1a1a] p-2 w-full rounded"
            placeholder="Plugin JSON URL"
            value={newSite.url}
            onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
          />
          <input
            className="border border-[#1a1a1a] text-[#1a1a1a] p-2 w-full rounded"
            placeholder="Username"
            value={newSite.username}
            onChange={(e) => setNewSite({ ...newSite, username: e.target.value })}
          />
          <input
            type="password"
            className="border border-[#1a1a1a] text-[#1a1a1a] p-2 w-full rounded"
            placeholder="App Password"
            value={newSite.password}
            onChange={(e) => setNewSite({ ...newSite, password: e.target.value })}
          />

          {editId ? (
            <button
              onClick={() => updateWebsite(editId)}
              className="bg-[#25B270] text-white p-2 w-full rounded"
            >
              Update Website
            </button>
          ) : (
            <button
              onClick={addWebsite}
              className="bg-[#00377D] text-white p-2 w-full rounded"
            >
              Add Website
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8 space-y-3">
        {websites.map((site) => (
          <div
            key={site.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-[#1a1a1a]">{site.url}</p>
              <p className="text-sm text-[#1a1a1a]">User: {site.username}</p>
              <p className="text-xs text-[#1a1a1a]">
                Added: {new Date(site.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditId(site.id);
                  setNewSite({
                    url: site.url,
                    username: site.username,
                    password: site.password,
                  });
                }}
                className="text-[#00377D]"
              >
                Edit
              </button>
              <button
                onClick={() => deleteWebsite(site.id)}
                className="text-[#8F0808]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
