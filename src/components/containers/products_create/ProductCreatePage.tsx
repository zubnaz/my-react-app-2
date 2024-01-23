//@ts-ignore
import {
    Button,
    Divider,
    Form,
    Input,
    UploadFile,
    Alert,
    GetProp,
    UploadProps,
    Upload,
    Modal,
    Select,
    message, SelectProps
} from "antd";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {IProductCreate} from "./IProductCreate.ts";
import http_common from "../../../http_common.ts";


const ProductCreatePage = () => {

    type FileType = Parameters<GetProp<UploadProps,'beforeUpload'>>[0];
    const navigate = useNavigate();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [source, setSource] = useState<SelectProps[]>([]!);
    const [category, setCategory] = useState(0);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleCancel = ()=>setPreviewOpen(false);

    const getBase64 = (file:FileType):Promise<string>=>
        new Promise((resolve,reject)=>{
            const reader=new FileReader();

            reader.readAsDataURL(file);
            reader.onload=()=>resolve(reader.result as string);
            reader.onerror=(error)=>reject(error);
        })

    const handlePreview = async (file:UploadFile)=>{
        if(!file.url && !file.preview){
            file.preview=await  getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name||file.url!.substring(file.url!.lastIndexOf('/')+1));

    }
    const handleChange:UploadProps['onChange']=({fileList:newFileList})=>setFileList(newFileList);

    const uploadButton=(
        <button style={{border:0,background:'none'}} type="button">
            <PlusOutlined/>
            <div style={{marginTop:8}}>Upload</div>
        </button>
    );

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        let imgs:File[]=[];
        fileList.forEach((element)=>{
            imgs.push(element.originFileObj as File);
        })
        const model : IProductCreate = {
            name: values.name,
            price:values.price,
            description:values.description,
            quantity:values.quantity,
            category_id:category,
            images: imgs
        };
        try {
            await http_common.post("/api/product", model,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).catch(ex1=>console.log(ex1));

            navigate("/");
        }
        catch (ex) {
            message.error('Помилка створення продукту!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
        price?:number;
        description?:string;
        quantity?:number;
    };
    const takeCateg=async()=>{
        await http_common.get("/api/categories")
            .then(resp=>{
                if(source.length==0){
                resp.data.forEach((element)=>{
                    setSource(prevSource => [...prevSource, { value: element.id, label: element.name }]);
                })}

            })
    }

    useEffect(()=>{
        takeCateg();
    },[])

    const takeCategory = (value:number)=>{setCategory(value)}




    return (
        <>
            <Divider>Додати продукт</Divider>
            {errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" />}
            <Form
                name="basic"
                style={{maxWidth: "100%"}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Назва"
                    name="name"
                    rules={[{required: true, message: 'Вкажіть назву категорії!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Ціна"
                    name="price"
                    rules={[{required: true, message: 'Вкажіть ціну!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Опис"
                    name="description"
                    rules={[{required: true, message: 'Вкажіть ціну!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item<FieldType>
                    label="Знижка"
                    name="quantity"
                    rules={[{required: true, message: 'Вкажіть ціну!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Категорія"
                    rules={[{required: true, message: 'Вкажіть категорію!'}]}
                >

                    <Select
                        placeholder="Категорія"
                        onChange={takeCategory}
                        options={source}

                    />
                </Form.Item>


                <Upload
                    beforeUpload={()=>false}
                    listType="picture-card"
                    fileList={fileList}
                    multiple
                    onPreview={handlePreview}
                    onChange={handleChange}
                    accept="image/*">
                    {fileList.length>=8?null:uploadButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{width:'100%'}} src={previewImage}/>
                </Modal>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Додати
                    </Button>
                    <Button type="primary" htmlType="button" style={{background:"black",color:"white",marginLeft:30}} onClick={()=>{navigate(-1)}}>
                        Повернутися
                    </Button>
                </Form.Item>


            </Form>
        </>
    );
}
/*
* <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Tags Mode"
                    onChange={handleChange}
                    options={source}
                />*/
export default ProductCreatePage;