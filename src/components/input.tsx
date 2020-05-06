import React, { DetailedHTMLProps, InputHTMLAttributes } from "react"

export const Input = (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
    return (
        <input className="border border-gray-200 p-2" {...props}></input>
    )
}