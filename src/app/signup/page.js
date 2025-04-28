"use client";
import { FetchAllDepartment, FetchAllRole, FetchAllTeam, SingnUpSubmite } from "@/_api_/signup";
import { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchAllEmployeesByTeamLeaderId } from "@/_api_/nomination";

export default function Signup() {
    const [formData, setFormData] = useState({
        Name: "",
        Email: "",
        PhoneNO: "",
        Address: "",
        Designation: "",
        EmployeeId: "",
        DOB: "",
        DOJ: "",
        RoleId: "",
        TeamId: "",
        DepartmentId: "",
        Password: "",
    });
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (user && user.userRole != 1 && user.userRole != 2) {
            router.push("/dashboard");
            return;
        }
    }, [user])

    const [roles, setRoles] = useState([]);
    const [teams, setTeams] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const roleRes = await FetchAllRole();
                const deptRes = await FetchAllDepartment()
                const teamRes = await fetchAllEmployeesByTeamLeaderId(true);

                if (!roleRes.ok || !deptRes.ok) {
                    throw new Error("Failed to fetch data");
                }
                setRoles(await roleRes.json());
                setDepartments(await deptRes.json());

                const seen = new Set();
                const filtered = [];

                for (const e of teamRes.data.employeeData) {
                    const role = e.role.roleName;
                    if (["TeamLeader", "HR", "Admin"].includes(role) && !seen.has(e.id)) {
                        seen.add(e.id);
                        filtered.push({ id: e.id, teamName: e.name });
                    }
                }

                setTeams(filtered);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await SingnUpSubmite(formData);
            response.data.statusCode === 200 ? toast.success(`${response.data.message}`) : toast.error(`${response.data.message}`);
            if (response.data.statusCode === 200) {
                setFormData({
                    Name: "",
                    Email: "",
                    PhoneNO: "",
                    Address: "",
                    Designation: "",
                    EmployeeId: "",
                    DOB: "",
                    DOJ: "",
                    RoleId: "",
                    TeamId: "",
                    DepartmentId: "",
                    Password: "",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Signup failed. Please try again.");
        }
    };

    const selectedRole = roles.find((r) => r.id === formData.RoleId);
    const disableTeam = selectedRole && ["Admin"].includes(selectedRole.roleName);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Users</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        { label: "Name", name: "Name", type: "text" },
                        { label: "Email", name: "Email", type: "email" },
                        { label: "Phone Number", name: "PhoneNO", type: "text" },
                        { label: "Address", name: "Address", type: "text" },
                        { label: "Designation", name: "Designation", type: "text" },
                        { label: "Employee ID", name: "EmployeeId", type: "text" },
                        { label: "DOB", name: "DOB", type: "date" },
                        { label: "DOJ", name: "DOJ", type: "date" },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className="block font-medium text-gray-700">{label}:</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded-lg text-gray-900"
                            />
                        </div>
                    ))}

                    {[
                        { label: "Role", name: "RoleId", options: roles, isRequired: true },
                        { label: "Team", name: "TeamId", options: teams, isRequired: false },
                        { label: "Department", name: "DepartmentId", options: departments, isRequired: true },
                    ].map(({ label, name, options, isRequired }) => (
                        <div key={name}>
                            <label className="block font-medium text-gray-700">{label}:</label>
                            <select
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                disabled={name === "TeamId" && disableTeam}
                                className={`w-full p-3 border rounded-lg text-gray-900 ${name === "TeamId" && disableTeam ? "bg-gray-200 cursor-not-allowed" : ""
                                    }`}
                                {...(isRequired ? { required: true } : {})}
                            >
                                <option value="">Select {label}</option>
                                {options.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option[`${label.toLowerCase()}Name`]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <div>
                        <label className="block font-medium text-gray-700">Password:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="Password"
                                value={formData.Password}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded-lg text-gray-900"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
                    >
                        Register User
                    </button>
                </form>
            </div>
        </div>
    );
}
