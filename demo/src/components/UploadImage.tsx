import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload, Spin, Flex } from 'antd';
import axios from 'axios';
import fileDownload from 'js-file-download';


const props: UploadProps = {
    name: 'file',
    action: 'http://127.0.0.1:8000/uploadfile/',
    method: 'post',
    // headers: {
    //     authorization: 'authorization-text',
    // },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    progress: {
        strokeColor: {
            '0%': '#108ee9',
            '100%': '#87d068',
        },
        strokeWidth: 3,
        format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
};

const SLEEP = 15000

import helper from './helpers/helper';

const UploadImage = () => {
    const [isSpinning, setIsSpinning] = useState(false)

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));



    const on_upload_image = async (file: any) => {

        try {
            setIsSpinning(true)
            const form = new FormData();
            form.append('file', file.file.originFileObj);
            form.append('user_id',helper.get_user_identification())

            await axios.post('http://127.0.0.1:8001/uploadfile/', form)

            await sleep(SLEEP)
            console.log('====================================');
            console.log("RELOAD PAGE: ", SLEEP);
            console.log('====================================');
            window.location.reload();

        } catch (error) {
            console.log('====================================');
            console.log("ERROR: ", error);
            console.log('====================================');
        } finally {
            setIsSpinning(false)
        }
    }

    const onButtonClick = () => {


        // helper.set_user_identification()
        setIsSpinning(true)

        axios.get("http://127.0.0.1:8001/download_file", {
            responseType: 'blob'
        })
            .then((res) => {
                console.log('====================================');
                console.log("RES: ", res);
                console.log('====================================');
                fileDownload(res.data, "downloadTest")
            })
            .catch((err) => {
                console.log('====================================');
                console.log("ERROR: ", err);
                console.log('====================================');
            })
            .finally(()=>{
                setIsSpinning(false)
            })
    };


    return (
        <Flex gap="middle" vertical style={{ marginTop: 50 }}>
            <Upload onChange={on_upload_image} style={{ alignSelf: 'center' }} >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>

            <Button icon={<UploadOutlined />} onClick={onButtonClick}>Click to Download</Button>

            <Spin style={{ marginTop: 50, marginBottom: 50 }} spinning={isSpinning} />
        </Flex>
    )

}

export default UploadImage;