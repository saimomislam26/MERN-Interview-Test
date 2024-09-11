import React from 'react'
import BeatLoader from "react-spinners/BeatLoader";

const Loader = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh" }}>
            <BeatLoader
                color={"#3c43e0"}
                size={80}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}

export default Loader