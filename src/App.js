import "./index.scss";
import React, { useState, useEffect } from "react";
import { Collection } from "./components/Collection";

const cats = [
    { name: "Всі" },
    { name: "Гори" },
    { name: "Море" },
    { name: "Архітектура" },
    { name: "Міста" },
];

function App() {
    const [categoryId, setCategoryId] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        setIsLoading(true);

        const category = categoryId ? `category=${categoryId}` : "";

        fetch(
            `https://63c4ef9df3a73b34784a9eda.mockapi.io/photo_collections?page=${page}&limit=3&${category}`
        )
            .then((res) => res.json())
            .then((json) => {
                setCollections(json);
            })
            .catch((err) => {
                console.warn(err);
                alert("Помилка при отриманні данних");
            })
            .finally(() => setIsLoading(false));
    }, [categoryId, page]);

    return (
        <div className="App">
            <h1>Моя колекція фотографій</h1>
            <div className="top">
                <ul className="tags">
                    {cats.map((obj, index) => (
                        <li
                            onClick={() => setCategoryId(index)}
                            className={categoryId === index ? "active" : ""}
                            key={obj.name}
                        >
                            {obj.name}
                        </li>
                    ))}
                </ul>
                <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="search-input"
                    placeholder="Пошук за назвою"
                />
            </div>
            <div className="content">
                {isLoading ? (
                    <h2>Йде завантаження ...</h2>
                ) : (
                    collections
                        .filter((obj) => {
                            return obj.name
                                .toLowerCase()
                                .includes(searchValue.toLowerCase());
                        })
                        .map((obj, index) => (
                            <Collection
                                key={index + obj.name}
                                name={obj.name}
                                images={obj.photos}
                            />
                        ))
                )}
            </div>
            <ul className="pagination">
                {[...Array(4)].map((_, index) => (
                    <li
                        key={index}
                        onClick={() => setPage(index + 1)}
                        className={page === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
