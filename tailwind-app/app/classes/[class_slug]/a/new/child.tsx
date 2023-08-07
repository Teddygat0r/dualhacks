"use client";
import { ChangeEventHandler, useState } from "react";
import { TestCase } from "@/app/Components/types";

const Child = ({
    it,
    index,
    onChange,
    onDelete,
}: {
    it: TestCase;
    index: number;
    onChange: Function;
    onDelete: Function;
}) => {
    const [item, setItem] = useState(it);

    return (
        <div className="flex gap-4">
            <label className="m-auto">Case {index + 1}: </label>
            <input
                className="px-3 py-1 m-auto my-1 rounded-md grow"
                value={item.input}
                onChange={(e) => {
                    let newValue = e.target.value;
                    setItem((prevState) => {
                        let newItem = { ...prevState, input: newValue };

                        onChange(index, newItem);
                        return newItem;
                    });
                }}
            />
            <label className="flex gap-1 m-auto">
                <p>Hidden:</p>
                <input
                    type="checkbox"
                    className="m-auto"
                    checked={item.hidden}
                    onChange={(e) => {
                        let newValue = e.target.checked;
                        setItem((prevState) => {
                            let newItem = { ...prevState, hidden: newValue };

                            onChange(index, newItem);
                            return newItem;
                        });
                    }}
                />
            </label>
            <button
                className="px-3 py-1 m-auto text-black duration-150 bg-red-400 border rounded-md border-slate-700 hover:bg-red-500"
                onClick={() => {
                    onDelete(index, item);
                }}
            >
                Delete
            </button>
        </div>
    );
};

export default Child;
