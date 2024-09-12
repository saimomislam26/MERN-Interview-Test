import  { useState } from 'react'

const useSingleDrawing = () => {
    const [drawings, setDrawings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [title, setTitle] = useState("")
    const [success, setSuccess] = useState("")

    const fetchData = async (api) => {
        try {
            setLoading(true)
            const res = await fetch(api, {
                method: 'GET'
            })

            if (res.status === 400 || res.status === 404) {
                const errorMessage = await res.json()
                setError(errorMessage.message)
            } else if (res.status === 200) {
                const fetchedData = await res.json()
                setDrawings(fetchedData.shapes)
                setTitle(fetchedData.title)
            } else {
                const errorMessage = await res.json()
                setError(errorMessage.message)
            }

        } catch (e) {
            setError("Error Occured While Fetching Data")
        } finally {
            setLoading(false)
        }

    }

    const updateData = async (api, body) => {
        try {
            setLoading(true)
            const res = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                  },
                body: JSON.stringify(body)
            })

            if (res.status === 400 || res.status === 404) {
                const errorMessage = await res.json()
                setError(errorMessage.message)
            } else if (res.status === 200) {
                const fetchedData = await res.json()
                // setDrawings(fetchedData.shapes)
                // setTitle(fetchedData.title)
                setSuccess(fetchedData.message)
            } else {
                const errorMessage = await res.json()
                setError(errorMessage.message)
            }

        } catch (e) {
            setError("Error Occured While Fetching Data")
        } finally {
            setLoading(false)
        }
    }

    return { fetchData, updateData, drawings, setDrawings, loading, error, setError, title, setTitle, success, setSuccess }
}

export default useSingleDrawing