import React, { useState, useEffect} from "react"

const Test = () => {

    const  [state, setState] = useState("");

    useEffect(() => {
        const requestOptions = {
            method: "GET"
          }
      
        fetch("/api/test", requestOptions)
        .then(res => res.json())
        .then(data => {
            setState(data["message"])
            console.log(data)
            console.log("Done")
        })
    }, [])

        
    return <div>{state}</div>
}

export default Test