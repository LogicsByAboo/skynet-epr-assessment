import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api/client";

type Role = "student" | "instructor" | "admin";

interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  course_name?: string;
  status?: string;
  total_eprs_written?: number;
}

// [{
//   "id": "ae44f379-eb31-43e0-9e0d-258bc957de18",
//   "name": "Capt. Arjun Mehta",
//   "email": "arjun@academy.com",
//   "role": "instructor",
//   "created_at": "2026-02-24 09:00:34.390005+00",
//   "updated_at": "2026-02-24 09:00:34.390005+00"
// }, {
//   "id": "c8d54453-e935-4f09-b1b0-a9e8d8efbf16",
//   "name": "Capt. Riya Sharma",
//   "email": "riya@academy.com",
//   "role": "instructor",
//   "created_at": "2026-02-24 09:00:34.390005+00",
//   "updated_at": "2026-02-24 09:00:34.390005+00"
// }, {
//   "id": "7f494e8e-0b93-4fb0-8bab-984cdd560b4e",
//   "name": "Admin User",
//   "email": "admin@academy.com",
//   "role": "admin",
//   "created_at": "2026-02-24 09:00:34.390005+00",
//   "updated_at": "2026-02-24 09:00:34.390005+00"
// }, {
//   "id": "186de13c-b64f-4e71-a344-8e64cfcbf05a",
//   "name": "Rahul Verma",
//   "email": "rahul@academy.com",
//   "role": "student",
//   "created_at": "2026-02-24 09:00:34.472516+00",
//   "updated_at": "2026-02-24 09:00:34.472516+00"
// }, {
//   "id": "a3bc105e-6b23-4a6c-a025-cb6f0f735c0a",
//   "name": "Aman Singh",
//   "email": "aman@academy.com",
//   "role": "student",
//   "created_at": "2026-02-24 09:00:34.472516+00",
//   "updated_at": "2026-02-24 09:00:34.472516+00"
// }, {
//   "id": "c4bf707a-1f1d-4115-a529-86678801ee50",
//   "name": "Priya Nair",
//   "email": "priya@academy.com",
//   "role": "student",
//   "created_at": "2026-02-24 09:00:34.472516+00",
//   "updated_at": "2026-02-24 09:00:34.472516+00"
// }, {
//   "id": "fc981557-98fe-4c85-9251-7f09b759c82f",
//   "name": "Karan Patel",
//   "email": "karan@academy.com",
//   "role": "student",
//   "created_at": "2026-02-24 09:00:34.472516+00",
//   "updated_at": "2026-02-24 09:00:34.472516+00"
// }, {
//   "id": "c72bb10d-b27c-454c-99ad-74f9eab6ca11",
//   "name": "Neha Joshi",
//   "email": "neha@academy.com",
//   "role": "student",
//   "created_at": "2026-02-24 09:00:34.472516+00",
//   "updated_at": "2026-02-24 09:00:34.472516+00"
// }, {
//   "id": "e1c3261d-ea65-4bde-a6a1-02be17b4f419",
//   "name": "Rohit Das",
//   "email": "rohit@academy.com",
//   "role": "student",
//   "created_at": "2026-02-24 09:00:34.472516+00",
//   "updated_at": "2026-02-24 09:00:34.472516+00"
// }]


export default function App() {

  const [role, setRole] = useState<Role>("instructor");
  const [userId, setUserId] = useState("ae44f379-eb31-43e0-9e0d-258bc957de18");
  const [directoryRoleFilter, setDirectoryRoleFilter] = useState<"student" | "instructor">("student");
  const [people, setPeople] = useState<Person[]>([]);
  const loggedInUser = useMemo(() => {
    return people.find(p => p.id === userId);
  }, [people, userId]);
  const [selectedPerson, setSelectedPerson] =
    useState<Person | null>(null);

  const [eprList, setEprList] = useState<any[]>([]);
 

  const [loading, setLoading] = useState(false);
  const [loadingEpr, setLoadingEpr] = useState(false);
  const [error, setError] = useState("");

  const studentOptions = people.filter(
    (p) => p.role === "student"
  );
  
  const instructorOptions = people.filter(
    (p) => p.role === "instructor"
  );
 
 const [search, setSearch] = useState("");
 // EPR detail & edit
const [selectedEpr, setSelectedEpr] = useState<any | null>(null);
const [editMode, setEditMode] = useState(false);

// New EPR form
const [showNewForm, setShowNewForm] = useState(false);
const [newEpr, setNewEpr] = useState({
  periodStart: "",
  periodEnd: "",
  overallRating: 3,
  technicalSkillsRating: 3,
  nonTechnicalSkillsRating: 3,
  remarks: "",
  status: "draft",
});
const [generating, setGenerating] = useState(false);

const canEdit =
  role === "instructor" &&
  selectedEpr &&
  selectedEpr.evaluator_id === userId &&
  selectedEpr.status !== "submitted" &&
  selectedEpr.status !== "archived";

 useEffect(() => {
  fetchPeople();
}, [role, search]);


async function fetchPeople() {
  try {
    setLoading(true);
    const query = `?role=${directoryRoleFilter}${search ? `&search=${search}` : ""}`;

    const data = await apiFetch(
  `/api/people${query}`,
  userId,
  role
);

    setPeople(data);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

const handleGenerateRemarks = async () => {
  try {
    setGenerating(true);

    const res = await fetch("http://localhost:5000/api/epr/assist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
        "x-user-role": role,
      },
      body: JSON.stringify({
        overallRating: newEpr.overallRating,
        technicalSkillsRating: newEpr.technicalSkillsRating,
        nonTechnicalSkillsRating: newEpr.nonTechnicalSkillsRating,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Failed to generate remarks" }));
      throw new Error(errorData.error || "Failed to generate remarks");
    }

    const data = await res.json();
    console.log("AI RESPONSE:", data);

    setNewEpr((prev) => ({
      ...prev,
      remarks: data.suggestedRemarks || "",
    }));
  } catch (err: any) {
    console.error("Error generating remarks:", err);
    alert(err.message || "Failed to generate remarks. Please try again.");
  } finally {
    setGenerating(false);
  }
};

  async function fetchEprList(personId: string) {
    try {
      setLoading(true);
      setError("");
  
      
      setSelectedEpr(null);
      setEprList([]);
  
      const data = await apiFetch(
        `/api/epr?personId=${personId}`,
        userId,
        role
      );
  
      setEprList(data);
    } catch (err: any) {
      
      setSelectedPerson(null);
      setSelectedEpr(null);
      setEprList([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateEpr() {
    if (role === "instructor" && selectedEpr.evaluator_id !== userId) {
      return;
    }
    {canEdit && (
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setEditMode(true)}
      >
        Edit
      </button>
    )}
    if (role === "student") return;
    if (!selectedEpr || !selectedPerson) return;
  
    await apiFetch(
      `/api/epr/${selectedEpr.id}`,
      userId,
      role,
      {
        method: "PATCH",
        body: {
          overallRating: selectedEpr.overall_rating,
          technicalSkillsRating: selectedEpr.technical_skills_rating,
          nonTechnicalSkillsRating: selectedEpr.non_technical_skills_rating,
          remarks: selectedEpr.remarks,
          status: selectedEpr.status,
        },
      }
    );
  
    setEditMode(false);
    fetchEprList(selectedPerson.id);
  }

  async function fetchEprDetail(id: string) {
    try {
      setLoadingEpr(true);
      const data = await apiFetch(
        `/api/epr/${id}`,
        userId,
        role
      );
      setSelectedEpr(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingEpr(false);
    }
  }

  async function handleCreateEpr() {
    if (!selectedPerson) return;
  
    await apiFetch(
      "/api/epr",
      userId,
      role,
      {
        method: "POST",
        body: {
          personId: selectedPerson.id,
          evaluatorId: userId,
          roleType: selectedPerson.role,
          periodStart: newEpr.periodStart,
          periodEnd: newEpr.periodEnd,
          overallRating: newEpr.overallRating,
          technicalSkillsRating: newEpr.technicalSkillsRating,
          nonTechnicalSkillsRating: newEpr.nonTechnicalSkillsRating,
          remarks: newEpr.remarks,
          status: newEpr.status,
        },
      }
    );
  
    setShowNewForm(false);
    fetchEprList(selectedPerson.id);
  }

  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="text-sm text-blue-600 font-medium">
  {loggedInUser && (
    <>
      Logged in as: {loggedInUser.role} – {loggedInUser.name}
    </>
  )}
</div>
      <div className="bg-white border-b p-3 flex gap-4 items-center">
      <div className="ml-auto text-sm text-gray-700 font-medium">
</div>
      <select
  className="border p-2 rounded"
  value={directoryRoleFilter}
onChange={(e) =>
  setDirectoryRoleFilter(e.target.value as "student" | "instructor")
}
>
  <option value="admin">Admin</option>
  <option value="instructor">Instructor</option>
  <option value="student">Student</option>
</select>

        <input
  type="text"
  placeholder="Search by name or email"
  className="border p-2 rounded w-72"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<select
  className="border p-2 rounded w-64"
  value={selectedPerson?.id || ""}
  onChange={(e) => {
    const selectedId = e.target.value;

    const person = people.find(
      (p) => p.id === selectedId
    );

    if (person) {
      setSelectedPerson(person);
      fetchEprList(person.id);
    }
  }}
>
  <option value="">Select Person</option>

  {people.map((person) => (
    <option key={person.id} value={person.id}>
      {person.name} ({person.role})
    </option>
  ))}
</select>

        <button
          onClick={fetchPeople}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* LEFT PANE */}
        <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">
            People
          </h2>

          {loading && <div>Loading...</div>}
          {error && (
            <div className="text-red-600">{error}</div>
          )}

          {people.map((person) => (
            <div
              key={person.id}
              onClick={() => {
                setSelectedPerson(person);
                fetchEprList(person.id);
              }}
              className="border p-3 rounded mb-2 cursor-pointer hover:bg-gray-50"
            >
              <div className="font-medium">
                {person.name}
              </div>
              <div className="text-sm text-gray-600">
                {person.email}
              </div>
              <div className="text-xs mt-1">
                Role: {person.role}
              </div>

              {person.role === "student" && (
                <>
                  <div className="text-xs">
                    Course: {person.course_name}
                  </div>
                  <div className="text-xs">
                    Status: {person.status}
                  </div>
                </>
              )}

              {person.role === "instructor" && (
                <div className="text-xs">
                  EPRs Written:{" "}
                  {person.total_eprs_written}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT PANE */}
        <div className="flex-1 p-6 overflow-y-auto">
        {error && (
         <div className="text-red-600 font-semibold mb-4">
         {error}
        </div>
         )}

          {!selectedPerson && (
            <div className="text-gray-500">
              Select a person to view details
            </div>
          )}

{selectedPerson && !error && (
  <>
    <h2 className="text-xl font-semibold">
      {selectedPerson.name}
    </h2>

    <div className="text-sm text-gray-600 mb-4">
      {selectedPerson.role}
    </div>

    {/* New EPR Button */}
    {role !== "student" && (
  <button
    className="mb-4 bg-black text-white px-4 py-2 rounded"
    onClick={() => setShowNewForm(true)}
  >
    New EPR
  </button>
)}

    {showNewForm && selectedPerson && (
  <div className="mt-4 border p-4 rounded bg-white">
    <h3 className="font-semibold mb-2">Create New EPR</h3>

    <input
      type="date"
      className="border p-2 rounded mb-2 w-full"
      onChange={(e) =>
        setNewEpr({ ...newEpr, periodStart: e.target.value })
      }
    />

    <input
      type="date"
      className="border p-2 rounded mb-2 w-full"
      onChange={(e) =>
        setNewEpr({ ...newEpr, periodEnd: e.target.value })
      }
    />

<input
  type="number"
  min="1"
  max="10"
  placeholder="Overall Rating"
  className="border p-2 rounded w-full mb-2"
  value={newEpr.overallRating}
  onChange={(e) =>
    setNewEpr({
      ...newEpr,
      overallRating: Number(e.target.value),
    })
  }
/>

<input
  type="number"
  min="1"
  max="10"
  placeholder="Technical Rating"
  className="border p-2 rounded w-full mb-2"
  value={newEpr.technicalSkillsRating}
  onChange={(e) =>
    setNewEpr({
      ...newEpr,
      technicalSkillsRating: Number(e.target.value),
    })
  }
/>

<input
  type="number"
  min="1"
  max="10"
  placeholder="Non-Technical Rating"
  className="border p-2 rounded w-full mb-2"
  value={newEpr.nonTechnicalSkillsRating}
  onChange={(e) =>
    setNewEpr({
      ...newEpr,
      nonTechnicalSkillsRating: Number(e.target.value),
    })
  }
/>

    <textarea
      placeholder="Remarks"
      className="border p-2 rounded w-full mb-2"
      value={newEpr.remarks}
      onChange={(e) =>
        setNewEpr({ ...newEpr, remarks: e.target.value })
      }
    />

     <button
         type="button"
         onClick={handleGenerateRemarks}
         disabled={
         generating ||
         !newEpr.overallRating ||
         !newEpr.technicalSkillsRating ||
         !newEpr.nonTechnicalSkillsRating
         }
         className={`px-4 py-2 rounded text-white transition mb-2 ${
           generating || !newEpr.overallRating || !newEpr.technicalSkillsRating || !newEpr.nonTechnicalSkillsRating
          ? "bg-purple-400 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700"
           }`}
>          {generating ? "Generating..." : "Generate Suggested Remarks"}
    </button>

    <button  
      className="bg-green-600 text-white px-4 py-2 rounded"
      onClick={handleCreateEpr}
    >
      Create
    </button>
  </div>
)}

    {/* EPR LIST */}
    <div className="mt-4">
      <h3 className="font-semibold mb-2">
        Performance Records
      </h3>

                {eprList.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No EPR records found
                  </div>
                ) : (
                  eprList.map((epr) => (
                    <div
                      key={epr.id}
                      className="border p-3 rounded mb-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedEpr(epr);
                        setEditMode(false);
                      }}
                    >
                      <div className="flex justify-between">
                        <span>
                          {new Date(epr.period_start).toLocaleDateString()} –{" "}
                          {new Date(epr.period_end).toLocaleDateString()}
                        </span>
                  
                        <span className="font-bold">
                          ⭐ {epr.overall_rating}
                        </span>
                      </div>
                  
                      <span className="text-sm text-gray-500">
                        {epr.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* EPR DETAIL */}
              {selectedEpr && (
  <div className="mt-4">
  <h3 className="font-semibold mb-2">EPR Detail</h3>

  <div className="text-lg font-medium mb-2">
    {selectedEpr.person_name}
  </div>

    <p><strong>Period:</strong> {selectedEpr.period_start} – {selectedEpr.period_end}</p>
    <p><strong>Overall:</strong> {selectedEpr.overall_rating}</p>
    <p><strong>Technical:</strong> {selectedEpr.technical_skills_rating}</p>
    <p><strong>Non-Technical:</strong> {selectedEpr.non_technical_skills_rating}</p>
    <p><strong>Status:</strong> {selectedEpr.status}</p>

    <div className="mt-2">
      <strong>Remarks:</strong>
      <p className="mt-1 text-gray-700">
        {selectedEpr.remarks}
      </p>
    </div>

    {role === "instructor" &&
  selectedEpr?.evaluator_id === userId && (
    <button
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      onClick={() => setEditMode(true)}
    >
      Edit
    </button>
)}
  </div>
)}
{editMode && canEdit && (
  <div className="mt-4 border p-4 rounded bg-gray-50">
    <h4 className="font-semibold mb-2">Edit EPR</h4>

    <input
      type="number"
      min="1"
      max="5"
      className="border p-2 rounded mb-2 w-full"
      value={selectedEpr.overall_rating}
      onChange={(e) =>
        setSelectedEpr({
          ...selectedEpr,
          overall_rating: Number(e.target.value),
        })
      }
    />

    <textarea
      className="border p-2 rounded w-full mb-2"
      value={selectedEpr.remarks}
      onChange={(e) =>
        setSelectedEpr({
          ...selectedEpr,
          remarks: e.target.value,
        })
      }
    />

    <select
      className="border p-2 rounded mb-2"
      value={selectedEpr.status}
      onChange={(e) =>
        setSelectedEpr({
          ...selectedEpr,
          status: e.target.value,
        })
      }
    >
      <option value="draft">Draft</option>
      <option value="submitted">Submitted</option>
      <option value="archived">Archived</option>
    </select>

    <button
      className="bg-green-600 text-white px-4 py-2 rounded"
      onClick={handleUpdateEpr}
    >
      Save
    </button>
    
  </div>
)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}