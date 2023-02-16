import { useEffect, useState } from "react";
import NewsItems from "./NewsItems"
import InfiniteScroll from 'react-infinite-scroller'



function News(props) {

    const [newsItem, setNewsItem] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0);

    const fetchData = async () => {
        props.setProgress(10)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=4cf1589e91014a629f236166b279d209&pageSize=${props.pageSize}&page=${page}`;
        setLoading(true)
        const data = await fetch(url);
        props.setProgress(30);
        const parsedData = await data.json()
        // console.log(parsedData.totalResults)
        props.setProgress(70);
        setNewsItem(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        // console.log(parsedData.TotalResults)
        setLoading(false)
        props.setProgress(100);
        // console.log(newsItem.length)
    }

    useEffect(() => {
        fetchData();
    }, [])   // eslint-disable-line react-hooks/exhaustive-deps

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=4cf1589e91014a629f236166b279d209&pageSize=${props.pageSize}&page=${page + 1}`;
        setPage(page + 1)
        const data = await fetch(url);
        const parsedData = await data.json()
        setNewsItem(newsItem.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
    };

    return (
        <>
            <h1>Today's News HeadLines</h1>
            {loading}
            <InfiniteScroll
                dataLength={newsItem.length}
                next={fetchMoreData}
                hasMore={newsItem.length !== totalResults}
                loader={<h3>Loading...</h3>}
            >
                <div className="conatiner my-3">
                    <div className="row">
                        {newsItem.map(({ title, description, urlToImage, id, url }) => {
                            return (<div className="col-md-4" key={id}>
                                <NewsItems title={title ? title.slice(0, 45) : ""}
                                    description={description ? description.slice(0, 88) : ""} imageUrl={urlToImage}
                                    newsUrl={url} />
                            </div>
                            )
                        })}
                    </div>
                </div>
            </InfiniteScroll>

        </>
    );
}

export default News;