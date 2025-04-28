import React, { useContext, useEffect, useState } from "react";
import { Ratings } from "./Nomination";

const StarTable = ({UserRole}) => {
    const alphabets = [
        "Performance",
        "Excellence",
        "Innovation and Creativity",
        "Leadership and Initiative",
        "Teamwork and Collaboration",
        "Customer Focus",
        "Adaptability",
        "Learning and Development",
        "Timely"
    ];
    const {ratings, setRatings}=useContext(Ratings)
    // const [ratings, setRatings] = useState({});
    const handleRating = (letter, index) => {
        setRatings((prev) => ({ ...prev, [letter]: index + 1 }));
    };

    return (
        <div className="p-6">
            <table className="table-auto w-full border border-gray-300">
                <thead className="bg-black">
                    <tr>
                        <th className="border px-4 py-2 text-left">Key Parameters</th>
                        <th className="border px-4 py-2 text-left">{`${UserRole} Ratings`}</th>
                    </tr>
                </thead>
                <tbody>
                    {alphabets.map((letter) => (
                        <tr key={letter}>
                            <td className="border px-4 py-2 font-semibold text-black">{letter}</td>
                            <td className="border px-4 py-2">
                                {[...Array(5)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleRating(letter, i)}
                                        className={`text-2xl ${i < (ratings[letter] || 0) ? "text-yellow-500" : "text-gray-400"
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}<span className="ml-2 text-sm text-gray-700">
                                    {ratings[letter] || 0}/5
                                </span>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StarTable;

