import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import http_common from "../../../http_common.ts";
import {Card, Carousel} from "antd";
import {APP_ENV} from "../../../env";
import {IProd} from "./types.ts";


const ShowPage:React.FC=()=>{
    const {id}=useParams();
    const [images,setImages]=useState<string[]>([]);
    const [prod,setProduct]=useState<IProd>();
    const imagePath=`${APP_ENV.BASE_URL}/upload_products/150_`;
    const show=async()=>{
        await http_common.get(`/api/products/getById/${id}`).then(res=>{
            //console.log(`obj `,res.data.product_images);
            let imgs =[];
            res.data.product_images.forEach((element)=>{
                imgs.push(imagePath+element.name);
            })
            //console.log(`obj `,imgs)
            setImages(imgs);
            const p:IProd={
                id:res.data.id,
                name:res.data.name,
                price:res.data.price,
                description:res.data.description,
                quantity:res.data.quantity
            }

            setProduct(p);

        })
    }
    useEffect(()=>{
        show();
    },[]);
    const contentStyle: React.CSSProperties = {
        margin: 0,
        paddingTop:'30px',
        height: '260px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    const imageStyle: React.CSSProperties = {
        margin: 'auto',
    }
    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };
    return(<>
        <Card title="Продукт"  style={{ width: 300,margin:'auto' }}>
            {prod && (
                <>
                    <p># {prod.id}</p>
                    <p>Назва : {prod.name}</p>
                    <p>Ціна : {prod.price} ГРН</p>
                    <p>Опис : {prod.description}</p>
                    <p>Знижка : {prod.quantity} </p>
                </>
            )}
        </Card>
        <Carousel afterChange={onChange}>
            {images.map((element, index) =>
                <div style={contentStyle} key={index}>
                    <h3 style={contentStyle}>
                        <img style={imageStyle} src={element} alt={`Product Image ${index}`}/>
                    </h3>
                </div>
            )}
        </Carousel>
    </>)
}
export default ShowPage;

/*
{images.map((element, index) =>
                <div style={contentStyle} key={index}>
                    <img src={element} alt={`Product Image ${index}`} />
                </div>
            )}
* */


