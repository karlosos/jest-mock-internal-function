import { useEffect, useState, useRef, useCallback } from "react"
import { getData } from "./utils"

export const WelcomeMessage = ({ name }) => {
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(undefined);

    const mountedRef = useRef(true);

    const fetchData = async () => {
        try {
            const data = await getData(name);

            if (mountedRef.current) {
                setWelcomeMessage(data);
            }
        } catch (e) {
            setErrorMessage(e.message);
        }
    };

    useEffect(() => {
        fetchData();

        return () => {
            mountedRef.current = false
        }
    }, [])

    return (
        <>
            {welcomeMessage}
            { errorMessage !== undefined && <>Error: { errorMessage }</> }
        </>
    )
}