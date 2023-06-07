import { useState } from "react"
import "./modal.css";
import "./locationSearcher.css";


// Concealing of the API key is handled through an AWS function
const lambdaEndpoint = "https://hyt56t2jwvui25al52gvssz2aa0juxrr.lambda-url.us-east-2.on.aws/";

const sampleData = require("./sampleData.json");
const useSampleData = true;

export default function LocationSearcher({onResultSelected}) {
    const [inputText, setInputText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showResults, setShowResults] = useState(false);




    async function searchLocation(searchText) {
        // Clear the error message
        setErrorMsg("");
        setIsLoading(true);

        if(useSampleData) {
            setSearchResults(sampleData.results);
            setShowResults(true);
            return;
        }

        const response = await fetch(lambdaEndpoint, {
            headers: {
                "Access-Control-Request-Method": "POST",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                "text": searchText
            })
        });
        const responseData = await response.json();
        console.log(responseData);
       setSearchResults(responseData.results);
       setShowResults(true);
    }

    return(
        <div>
            <input value={inputText} placeholder="Enter the location address" onChange={(e) => {setInputText(e.target.value)}}></input>
            <button onClick={() => {
                searchLocation(inputText);
            }}>
                Search
            </button>

            <div className="location-search-results-container">
                {(searchResults && showResults) && <>
                    {
                        searchResults.map((data) => (
                            <button onClick={() => {
                                console.log("search result clicked")
                                setShowResults(false);
                                onResultSelected(data);
                            }}
                            className="location-search-result">
                                {data.address_line1} {data.address_line2}
                            </button>
                        ))
                    }
                </>}
            </div>

        </div>
    )
}