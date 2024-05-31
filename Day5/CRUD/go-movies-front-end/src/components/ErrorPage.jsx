import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    return(
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="mt-3">Oops!</h1>
                    <p>Sorry, an unexpected error has occurred</p>
                    <p>
                        <em>{error.statusTest || error.message}</em>
                    </p>
                </div>
            </div>
        </div>
    )
}