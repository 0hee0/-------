import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {
    const [images, setImages] = useState([])

    useEffect(() => {
        if (props.detail.images && props.detail.images.length > 0) {
            let imageList = []

            props.detail.images.map(item => (
                imageList.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            ))
            setImages(imageList)
        } 
    }, [props.detail])

    return (
        <div>
            <ImageGallery items={images} />
        </div>
    )
}

export default ProductImage
