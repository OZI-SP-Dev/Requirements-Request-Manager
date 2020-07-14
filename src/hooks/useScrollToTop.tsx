import { useEffect } from "react";


export function useScrollToTop(): void {

    // Scroll to the top of the page
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, []);
}