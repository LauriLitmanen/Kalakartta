import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactS3 from 'react-s3';

import { createReportEntry, getS3SecureUrl, uploadToS3Bucket } from './API';

const config = {
    bucketName: 'kalakarttabucket',
    region: 'eu-north-1',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
}
 
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */
 
 

const CatchReportForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    let photoFlag = useState(false);
    let photoFileFlag = useState(false);
    let photoUrl = useState('');
    let photoFile = useState(null);
    const  { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (photoFileFlag === true) {
                await upload();
            };
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            if (photoFlag === true) {
                data.catchPhoto = photoUrl;
            }
            console.log('data', data);
            await createReportEntry(data);
            photoFileFlag = false;
            photoFlag = false;
            onClose();
        }   
        catch (error) {
            console.log(error);
            setError(error.message);
            setLoading(false);
        }
    };

    // Upload image to S3 bucket  
    async function upload(){
        // Get a presignedUrl to upload the image to S3 bucket
        // More info here: https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
        const responseObject = await getS3SecureUrl();
        const url = responseObject.url;
        const response = await uploadToS3Bucket(url, photoFile);
        photoUrl = response.url.split('?')[0];
        photoFlag = true;
    };

    function setFile(e){
        console.log('Setting file..');
        photoFile = e.target.files[0];
        console.log('File: ', photoFile);
        photoFileFlag = true;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="report-form">
            {error ? <h3 className="error">{error}</h3> : null}
            <label htmlFor="title">Tunniste *</label>
            <input name="title" required ref={register}/>
            <label htmlFor="species">Laji *</label>
            <input name="species" required ref={register}/>
            <label htmlFor="length">Pituus (cm)</label>
            <input name="length" ref={register}/>
            <label htmlFor="weight">Paino (kg)</label>
            <input name="weight" ref={register}/>
            <label htmlFor="lure">Viehe</label>
            <input name="lure" ref={register}/>
            <label htmlFor="fishingMethod">Kalastus tapa *</label>
            <input name="fishingMethod" required ref={register}/>
            <label htmlFor="catchPhoto">Kuva</label>
            <input name="catchPhoto" type="file" onChange={setFile}/>
            <label htmlFor="date">Pvm *</label>
            <input name="date" type="date" required ref={register}/>
            <p>* Pakollinen tieto</p>
            <button disabled={loading}>{loading ? 'Loading...' : 'Save Catch Report'}</button>
        </form>
    );  
};

export default CatchReportForm;