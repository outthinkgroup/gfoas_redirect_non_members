import React from 'react'

export default function({value, options, label, update }){
    return (
        <>
        <label>{label}</label>
        <select name="types" value={value} onChange={e=>update(e.target.value)}>
            {options.map((option,index)=> 
                <option key={index} value={option}>{option}</option>
                )}
        </select>   
        </>         
    )
}