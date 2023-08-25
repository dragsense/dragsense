import { Form, Checkbox, Select, Input, Button, message } from "antd";
const { Option } = Select;
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetch";


export default function AddTheme({ project, setProject, setThemes }) {


    const [isLoading, setIsLoading] = useState(false);
    const [themePaths, setThemePaths] = useState([]);

    const [state, setState] = useState(
        {
            name: '', isDemo: false
        });

    useEffect(async () => {

        const response = await fetcher('/api/projects/' + project, {
            method: 'GET'
        });

        const url = `http://${response.project.domain}:${response.project.port}`;
        const apikey = response.project.apikey;


        const themePaths = await fetcher(`${url}/api/themes/path`, {
            method: 'GET',
            headers: { 'x-api-key': apikey },
        })


        setThemePaths(themePaths);


    }, [project])



    const onChange = (value) => {
        if(!value)
        return;
        
        setState({ ...state, name: value.trim() })
    }

    const onChangeIsDemo = (value) => {


        setState({ ...state, isDemo: value })
    }



    const onSubmit = async (values) => {


        if (!project) {
            message.error("Please select the project.");
            return;
        }

        try {
            setIsLoading(true);

          

            const response = await fetcher(`/api/themes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ ...state }),
            });
    
           
            setThemes(themes => {
                const index = themes.findIndex(com => com._id === response.newtheme._id);
                if (index > -1) {
                    themes[index] = response.newtheme;
                    return themes;
                }
                return [...themes, response.newtheme]
            });




        } catch (e) {
            message.error(e?.message || "Something was wrong!");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>

            <div className="wrapper">

                <Form.Item label="Name" className="font-500">
                    <Select onChange={onChange}
                        value={state.name}
                        style={{ width: 500 }}
                        placeholder="Select Theme">
                        {themePaths.map(theme =>
                            <Option value={theme}>
                                {theme}
                            </Option>
                        )}

                    </Select>
                </Form.Item>

                <h5>With Demo:  <Checkbox onChange={() => onChangeIsDemo(!state?.isDemo)}
                    checked={state?.isDemo} /></h5>

                    <span><span style={{color: 'red'}}>*</span> With Demo it's Highly recommend to make Backup. it will replace everything.</span>


            </div>

            <div style={{ textAlign: 'right' }}>
                <Button type="default" onClick={() => setProject(null)}>Cancel</Button> <Button type="primary" loading={isLoading} onClick={onSubmit}>Install</Button>
            </div>

        </>

    );
};

