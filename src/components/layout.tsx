import {Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header>
                <h1>Twitter Clone</h1>
            </header>
            <Outlet /> 
        </>
    )
}