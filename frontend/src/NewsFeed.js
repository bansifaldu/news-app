import React, { useEffect, useState, useRef } from "react";
import axios from "./axiosConfig";
import AuthService from "./AuthService";
import Header from "./Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Loader from "./Loader";

function NewsFeed() {
    const [newsFeed, setNewsFeed] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState(null);
    const [filterCategory, setFilterCategory] = useState("");
    const [filterSource, setFilterSource] = useState("");
    const [categories, setCategories] = useState([]);
    const [sourceOptions, setSourceOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [useUserPreferences, setUseUserPreferences] = useState(true);
    const [noDataFound, setNoDataFound] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalPage, setTotalPage] = useState("");
    const loadMoreData = async () => {

        if (page <= totalPage) {

            setPage((prevPage) => prevPage + 1);
        }
    };
    const observer = useRef();
    const fetchNewsFeed = async () => {
        try {
            if (!AuthService.isAuthenticated()) {
                console.log("User not authenticated. Redirecting to login page.");
                return;
            }

            setLoading(true);
            let apiEndpoint = "/api/user-preference-articles";

            if (!useUserPreferences) {
                apiEndpoint = "/api/articles";
            }

            const response = await axios.get(apiEndpoint, {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`,
                },
                params: {
                    searchTerm,
                    filterDate: filterDate ? filterDate.toISOString() : "",
                    filterCategory,
                    filterSource,
                    page,
                },
            });

            setTotalPage(response.data.articles.last_page);
            const articles = response.data.articles.data;

            if (page === 1) {
                setNewsFeed(articles);
            } else {
                // Append new data to the existing newsFeed
                setNewsFeed((prevNewsFeed) => [...prevNewsFeed, ...articles]);
            }

            setNoDataFound(articles.length === 0);
        } catch (error) {
            console.error("Failed to fetch news feed", error);
        } finally {
            setLoading(false);
        }
    };
    const clearAllFilters = () => {
        setSearchTerm("");
        setFilterDate(null);
        setFilterCategory("");
        setFilterSource("");
    };

    useEffect(() => {
        fetchNewsFeed();
    }, [
        searchTerm,
        filterDate,
        filterCategory,
        filterSource,
        useUserPreferences,
        page
    ]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/api/categories", {
                    headers: {
                        Authorization: `Bearer ${AuthService.getToken()}`,
                    },
                });
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        const fetchSourceOptions = async () => {
            try {
                const response = await axios.get("/api/sources", {
                    headers: {
                        Authorization: `Bearer ${AuthService.getToken()}`,
                    },
                });
                setSourceOptions(response.data.sourceName);
            } catch (error) {
                console.error("Failed to fetch source options", error);
            }
        };

        fetchCategories();
        fetchSourceOptions();
    }, []);
    useEffect(() => {
        const fetchInitialNewsFeed = async () => {
            // Fetch initial data when the component mounts
            await fetchNewsFeed();
        };

        fetchInitialNewsFeed();
    }, []);
    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (entry.isIntersecting && page <= totalPage) {
                    setLoadingMore(true);
                    loadMoreData();
                } else {
                    setLoadingMore(false);
                    setNoDataFound(false)
                }
            },
            {
                threshold: 0.6
            }
        );


        const lastArticleCard = document.querySelector(".news-feed .article-card:last-child");
        if (lastArticleCard) {
            observer.current.observe(lastArticleCard);
        }

        // Cleanup the observer when the component is unmounted
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [loadingMore, loadMoreData]);
    const handleToggleChange = () => {
        setPage(1)
        setUseUserPreferences((prev) => !prev);
    };

    const handleSearchChange = (e) => {
        setPage(1)
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <Header />
            <div className="background-image">
                <h2 className="section-title">News Feed</h2>

                <div className="user-preference-message">
                    <p className="preference-message">
                        For change your preference please click on this link..
                        <a href="/profile">Change your preferences here</a>
                    </p>
                    <div className="preference-block">
                        <p className="preference-toggle-message">
                            Enable Personalized News Feed
                        </p>

                        <label className="toggle-switch">
                            <input
                                className="toggleInput"
                                type="checkbox"
                                checked={useUserPreferences}
                                onChange={handleToggleChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <div className="search-filters">
                    <input
                        className="searchInput"
                        type="text"
                        placeholder="Search by keyword"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <DatePicker
                        selected={filterDate}
                        onChange={(date) => {
                            setFilterDate(date);
                            setPage(1);
                        }}
                        placeholderText="Select Date"
                        dateFormat="yyyy-MM-dd"
                        clearButton={
                            <button
                                className="clear-button"
                                onClick={() => setFilterDate(null)}
                            >
                                <FaTimes />
                            </button>
                        }
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => {
                            setFilterCategory(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">Filter by Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterSource}
                        onChange={(e) => {
                            setFilterSource(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">Filter by Source</option>
                        {sourceOptions.map((source, index) => (
                            <option key={index} value={source}>
                                {source}
                            </option>
                        ))}
                    </select>
                    <button className="clear-filter-button" onClick={clearAllFilters}>
                        Clear All Filters
                    </button>
                </div>
                {loading && <Loader />}
                <div className="news-feed">
                    {newsFeed.map((article, index) => (
                        <div key={article.id} className="article-card">
                            <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="article-image"
                            />
                            <div className="article-content">
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <p>
                                    <strong>Source:</strong> {article.sourceName}
                                </p>
                                <p>
                                    <strong>Category:</strong> {article.category}
                                </p>
                                <p>
                                    <strong>Author:</strong> {article.author}
                                </p>
                                <p>
                                    Published on:{" "}
                                    {new Date(article.publishedAt).toLocaleDateString()}
                                </p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                    Read more
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                {loadingMore && <Loader />}
                {noDataFound && (
                    <div className="no-data">
                        <h1>No any data found</h1>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NewsFeed;
