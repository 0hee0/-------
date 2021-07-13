import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { RocketOutlined } from '@ant-design/icons';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Data';

function LandingPage() {
    const [products, setProducts] = useState([])
    const [skip, setSkip] = useState(0)
    const [limit, setLimit] = useState(3)
    const [postSize, setPostSize] = useState(0)
    const [filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        let body = {
            skip: skip,
            limit: limit
        }

        getProducts(body)
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        setProducts([...products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert("상품들을 가져오는데 실패했습니다.")
                }
            })
    }

    // 더보기를 눌렀을 때 filter 안 먹은채로 있는 데이터 모두 불러오는 문제 발생
    const loadMoreHandler = () => {
        let Skip = skip + limit

        let body = {
            skip: Skip,
            limit: limit,
            loadMore: true
        }
        
        getProducts(body)
        setSkip(skip)
    }

    const renderCards = products.map((product, index) => {
        console.log(product)

        return (
            <Col lg={6} md={8} xs={24} key={index}>
                <Card
                    cover={
                        <a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>
                    }
                >
                    <Meta 
                        title={product.title}
                        description={`$${product.price}`}
                    />
                </Card>
            </Col>
        );
    })

    const showFilteredResults = (listFilters) => {
        let body = {
            skip: 0,
            limit: limit,
            filters: listFilters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }

        return array;
    }

    const handleFilters = (listFilters, category) => {
        const newFilters = { ...filters }

        newFilters[category] = listFilters

        console.log('filters:'+listFilters)
        if (category === "price") {
            let priceValues = handlePrice(listFilters)
            newFilters[category] = priceValues      // [200, 249]
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {
        let body = {
            skip: 0,
            limit: limit,
            filters: filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        
        getProducts(body)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center '}}>
                <h2>Let's Travel Anywhere <RocketOutlined /> </h2>
            </div>
            {/* Filter */}

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <Checkbox list={continents} handleFilters={listFilters => handleFilters(listFilters, "continents")} />                
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <Radiobox list={price} handleFilters={listFilters => handleFilters(listFilters, "price")} />
                </Col>
            </Row>


            {/* Search */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
            </div>

            {/* Cards */}
            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>

            <br />
            {postSize >= limit && 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
        </div>
    )
}

export default withRouter(LandingPage)
