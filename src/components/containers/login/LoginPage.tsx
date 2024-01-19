import {Button, Divider, Form, Input, message, Alert} from "antd";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import http_common from "../../../http_common.ts";
import {ILogin} from "./types..ts";
import {AuthContext} from "../../../contexts/AuthContext.tsx";

const LoginPage = () => {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const {UserLogin} = useContext(AuthContext);

    const onFinish = async (values: ILogin) => {
        console.log('Success:', values);
        const user:ILogin = {
            email:values.email,
            password:values.password
        }
        console.log(user);
        try {
            await http_common.post("/api/login", user).then((res)=>{
                localStorage.setItem(res.data.token,'authToken');

                UserLogin();
            });

            navigate("/");
        }
        catch (ex) {
            message.error('Помилка!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };






    return (
        <>
            <Divider style={customDividerStyle}>Реєстрація</Divider>
            {errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" />}
            <Form
                name="basic"
                style={{maxWidth: "100%"}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Емейл"
                    name="email"
                    htmlFor="email"
                    rules={[{required: true, message: 'Вкажіть емейл!'},
                        {type:'email', message:"Формат електронної пошти не вірний!"},
                        {min:2,message:'Електронна пошта повинна містити мінімум 2 символа!'}]}
                >
                    <Input autoComplete="email" id={"email"}/>
                </Form.Item>
                <Form.Item
                    label="Пароль"
                    name="password"
                    htmlFor={"password"}
                    rules={[
                        {required: true, message: 'Вкажіть Ваш пароль!',},
                        {min: 6, message: 'Пароль має мати мінімум 6 символів!',},
                    ]}
                    hasFeedback
                >
                    <Input.Password id={"password"}/>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Увійти
                    </Button>
                    <Button type="primary" htmlType="button" style={{background:"black",color:"white",marginLeft:30}} onClick={()=>{navigate(-1)}}>
                        Повернутися
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default LoginPage;