const allianceCountries = {
    NATO: ["US", "CA", "GB", "FR", "DE", "IT", "PL"],
    BRICS: ["BR", "RU", "IN", "CN", "ZA"],
    SCO: ["CN", "IN", "RU", "PK", "KZ"],
    QUAD: ["US", "IN", "JP", "AU"]
};


const map = new jsVectorMap({
    selector: "#map",

    map: "world",

    zoomButtons: true,

    regionStyle: {
        initial: {
            fill: "#4a4a4a",
            stroke: "#111"
        },

        hover: {
            fill: "#00ffff"
        }
    },

    onRegionClick(event, code) {

        const countryName = map.getRegionName(code);

        console.log(countryName);

        fetch(`/country/${countryName}`)
            .then(response => response.json())
            .then(data => {

                document.getElementById("country-info").innerHTML = `
                    <img src="${data.flag}" width="100">

                    <h2>${data.name}</h2>

                    <p><b>Capital:</b> ${data.capital}</p>

                    <p><b>Population:</b> ${data.population.toLocaleString()}</p>

                    <p><b>Region:</b> ${data.region}</p>

                    <p><b>Alliances:</b> ${data.alliances.join(", ") || "None"}</p>

                    <a href="${data.maps}" target="_blank">
                        Open Map
                    </a>
                `;

            })

            .catch(error => {
                console.log(error);
            });


        fetch(`/news/${countryName}`)
            .then(response => response.json())
            .then(news => {

                const newsList = document.getElementById("news-list");

                newsList.innerHTML = "";

                news.forEach(article => {

                    newsList.innerHTML += `
                        <li>
                            <a href="${article.url}" target="_blank">
                                ${article.title}
                            </a>
                        </li>
                    `;

                });

            })

            .catch(error => {
                console.log(error);
            });

    }
});


function highlightBloc(bloc) {

    resetMap();

    const countries = allianceCountries[bloc];

    countries.forEach(code => {

        map.setFocus({
            regions: countries,
            animate: true
        });

        map.regions[code].element.setStyle(
            "fill",
            getBlocColor(bloc)
        );

    });

}



function getBlocColor(bloc) {

    if (bloc === "NATO") return "#0066ff";

    if (bloc === "BRICS") return "#ff3333";

    if (bloc === "SCO") return "#ffcc00";

    if (bloc === "QUAD") return "#0fb425";

    return "#888";
}

function showAlliance(bloc) {

    highlightBloc(bloc);

    fetch(`/alliance/${bloc}`)
        .then(response => response.json())
        .then(data => {

            document.getElementById("alliance-about").innerHTML = `

                <h2>${data.title}</h2>

                <p><b>Founded:</b> ${data.year}</p>

                <p><b>Members:</b> ${data.members}</p>

                <p><b>Purpose:</b> ${data.purpose}</p>

                <p>${data.description}</p>

            `;

        });

}


function resetMap() {

    Object.values(map.regions).forEach(region => {

        region.element.setStyle(
            "fill",
            "#4a4a4a"
        );

    });

}

function searchCountry() {

    const input = document
        .getElementById("country-search")
        .value;

    if (!input) return;

    fetch(`/country/${input}`)
        .then(response => response.json())
        .then(data => {

            document.getElementById("country-info").innerHTML = `

                <img src="${data.flag}" width="">

                <h2>${data.name}</h2>

                <p><b>Capital:</b> ${data.capital}</p>

                <p><b>Population:</b>
                ${data.population.toLocaleString()}</p>

                <p><b>Region:</b> ${data.region}</p>

                <p><b>Alliances:</b>
                ${data.alliances.join(", ") || "None"}</p>

                <a href="${data.maps}" target="_blank">
                   
                </a>

            `;

        });

}

