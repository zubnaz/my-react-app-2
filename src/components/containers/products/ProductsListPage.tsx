import React, {useEffect, useState} from "react";
import {Button, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import http_common from "../../../http_common.ts";
import {Link} from "react-router-dom";
import {IProductItem} from "./IProductItem.ts";

const ProductsListPage:React.FC=()=>{
    const[list,setList]=useState<IProductItem[]>([

    ]);
    const columns:ColumnsType<IProductItem>=[
        {
            title:"#",
            dataIndex:"id"
        },

        {
            title:"Назва",
            dataIndex: "name",
        },
        {
            title:"Ціна",
            dataIndex: "price",
        },
        {
            title:"Опис",
            dataIndex: "description",
        },
        {
            title:"Кількість",
            dataIndex: "quantity",
        },
        {
            title:"Категорія",
            dataIndex: "category",
        },
        {
            render:(item:IProductItem)=>{
                return(<Link to={`show/${item.id}`}><Button type="primary" style={{margin:"13px"}}>Переглянути</Button></Link> );
            }
        },

    ]
    const showPage = async ()=>{
        await http_common.get("/api/products")
            .then(resp=>{
                let list_=[];
                for (let i = 0; i<resp.data.length;i++)
                {
                    const itm:IProductItem={
                        id:resp.data[i].id,
                        name:resp.data[i].name,
                        price:resp.data[i].price,
                        description:resp.data[i].description,
                        quantity:resp.data[i].quantity,
                        category:resp.data[i].category.name
                    };
                    //console.log(resp.data[i]);
                    list_.push(itm);

                }
                setList(list_);
            })
    }


    useEffect(()=>{
        showPage();
    },[]);

    return (
        <div className="list">
            <h1>Список продуктів</h1>
            <Table columns={columns} rowKey={"id"} dataSource={list} size={"middle"}/>
        </div>
    )
}
export default ProductsListPage;