import React, { useContext, useEffect, useState } from "react";
import { Ratings } from "./ApprovalBox";

const ApprovalStarTable = ({ UserRole }) => {
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
    const { ratings, setRatings, hrRating, setHrRating, managerRating, setManagerRating } = useContext(Ratings)
    const handleRating = (letter, index) => {
        setRatings((prev) => ({ ...prev, [letter]: index + 1 }));
    };
    
    return (
        <div className="p-6">

            {/* star of the month selected by leader And Send to Admin */}
            {(Object.keys(managerRating).length != 0 && hrRating!=null) ?
                (<table className="table-auto w-full border border-gray-300">
                    <thead className="bg-black">
                        <tr>
                            <th className="border px-4 py-2 text-left">Key Parameters</th>
                            <th className="border px-4 py-2 text-left">{`Manager Ratings`}</th>
                            <th className="border px-4 py-2 text-left">{`HR Ratings`}</th>
                            <th className="border px-4 py-2 text-left">{`Admin Ratings`}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alphabets.map((letter) => (
                            <tr key={letter}>
                                <td className="border px-4 py-2 font-semibold text-black">{letter}</td>
                                {/* is Part Me Changes */}
                                <td className="border px-4 py-2">
                                    {[...Array(5)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={`text-2xl ${i < (managerRating[letter] || 0) ? "text-yellow-500" : "text-gray-400"
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}<span className="ml-2 text-sm text-gray-700">
                                        {managerRating[letter] || 0}/5
                                    </span>
                                </td>
                                <td className="border px-4 py-2">
                                    {[...Array(5)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={`text-2xl ${i < (hrRating[letter] || 0) ? "text-yellow-500" : "text-gray-400"
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}<span className="ml-2 text-sm text-gray-700">
                                        {hrRating[letter] || 0}/5
                                    </span>
                                </td>
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
                </table>)
                : (Object.keys(managerRating).length == 0 && Object.keys(hrRating).length != 0) ? (
                    <table className="table-auto w-full border border-gray-300">
                        <thead className="bg-black">
                            <tr>
                                <th className="border px-4 py-2 text-left">Key Parameters</th>
                                <th className="border px-4 py-2 text-left">{`HR Ratings`}</th>
                                <th className="border px-4 py-2 text-left">{`Admin Ratings`}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alphabets.map((letter) => (
                                <tr key={letter}>
                                    <td className="border px-4 py-2 font-semibold text-black">{letter}</td>
                                    {/* is Part Me Changes */}
                                    <td className="border px-4 py-2">
                                        {[...Array(5)].map((_, i) => (
                                            <button
                                                key={i}
                                                className={`text-2xl ${i < (hrRating[letter] || 0) ? "text-yellow-500" : "text-gray-400"
                                                    }`}
                                            >
                                                ★
                                            </button>
                                        ))}<span className="ml-2 text-sm text-gray-700">
                                            {hrRating[letter] || 0}/5
                                        </span>

                                    </td>
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
                )
                    : (Object.keys(managerRating).length != 0 && hrRating==null) ? (
                        <table className="table-auto w-full border border-gray-300">
                            <thead className="bg-black">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Key Parameters</th>
                                    <th className="border px-4 py-2 text-left">{`Manager Ratings`}</th>
                                    <th className="border px-4 py-2 text-left">{`HR Ratings`}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alphabets.map((letter) => (
                                    <tr key={letter}>
                                        <td className="border px-4 py-2 font-semibold text-black">{letter}</td>
                                        {/* is Part Me Changes */}
                                        <td className="border px-4 py-2">
                                            {[...Array(5)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    className={`text-2xl ${i < (managerRating[letter] || 0) ? "text-yellow-500" : "text-gray-400"
                                                        }`}
                                                >
                                                    ★
                                                </button>
                                            ))}<span className="ml-2 text-sm text-gray-700">
                                                {managerRating[letter] || 0}/5
                                            </span>

                                        </td>
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
                    ) : null}

        </div>
    );
};

export default ApprovalStarTable;

