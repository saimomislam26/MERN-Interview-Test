import { useState } from 'react'

const useGetDrawingList = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [totalDataLength, setTotalDataLength] = useState(0)
    const [success, setSuccess] = useState("")

    const fetchData = async (api) => {
        try {
            setLoading(true)
            const res = await fetch(api, {
                method: 'GET'
            })

            if (res.status === 400) {
                const errorMessage = await res.json()
                console.log({ errorMessage });

                setError(errorMessage.message)
            } else if (res.status === 200) {
                const fetchedData = await res.json()
                setData(fetchedData.drawings)
                setTotalDataLength(fetchedData.total)
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

    const deleteData = async (api) => {
        try {
            setLoading(true)
            const res = await fetch(api, {
                method: 'DELETE'
            })

            if (res.status === 400 || res.status === 404) {
                const errorMessage = await res.json()
                console.log({ errorMessage });
                setError(errorMessage.message)
            } else if (res.status === 200) {
                const deletedData = await res.json()
                setSuccess(deletedData.message)
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

    return { fetchData, data, loading, error, setError, totalDataLength, deleteData, success, setSuccess }
}

export default useGetDrawingList