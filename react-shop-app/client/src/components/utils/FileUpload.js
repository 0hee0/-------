import React, { useState } from 'react';
import DropZone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons'; 
import axios from 'axios';

function FileUpload(props) {
    const [images, setImages] = useState([]);

    const dropHandler = (files) => {
        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append('file', files[0])

        axios.post('/api/product/image', formData, config)
        .then(response => {
            if (response.data.success) {
                setImages([...images, response.data.filePath])
                props.refreshFunction([...images, response.data.filePath])
            } else {
                alert('파일을 저장하는데 실패했습니다.')
            }
        })
    }

    const deleteHandler = (image) => {
        const currentIndex = images.indexOf(image)

        let newImages = [...images]
        newImages.splice(currentIndex, 1)    // currentIndex 부터 1개 삭제

        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <DropZone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <PlusOutlined style={{ fontSize: '3rem' }} />
                    </div>
                )}
            </DropZone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
                {images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`} 
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileUpload
