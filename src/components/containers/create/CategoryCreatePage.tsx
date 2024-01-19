import {Button, Divider, Form, Input, Upload, message, Alert} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import type {UploadChangeParam} from 'antd/es/upload';
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import {ICategoryCreate} from "./types.ts";
import http_common from "../../../http_common.ts";

const CategoryCreatePage = () => {

    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);


    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', file);
        if(file==null) {
            setErrorMessage("Оберіть фото!");
            return;
        }
        const model : ICategoryCreate = {
            name: values.name,
            price:values.price,
            image: file,

        };
        try {
            await http_common.post("/api/categories/create", model,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorize":`Bearer${localStorage.getItem('authToken')}`
                }
            }).catch(ex1=>console.log(ex1));

            navigate("/");
        }
        catch (ex) {
            message.error('Помилка створення категорії!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
        price?:number;
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };



    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {    // не зрозумів де саме передається файл в функцію
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File;
            setLoading(false);
            setFile(file);
            setErrorMessage("");
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    const beforeUpload = (file: RcFile) => { // не зрозумів де саме передається файл в функцію
        const isImage = /^image\/\w+/.test(file.type); // не знаю що за функція test
        if (!isImage) {
            message.error('Оберіть файл зображення!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        console.log("is select", isImage && isLt2M);
        return isImage && isLt2M;
    };

    return (
        <>
            <Divider style={customDividerStyle}>Додати категорію</Divider>
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

                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    accept={"image/*"}
                >
                    {file ? <img src={URL.createObjectURL(file)} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                </Upload>

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

export default CategoryCreatePage;