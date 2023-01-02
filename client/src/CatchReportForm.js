import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './styles/catchReportForm.css';

import { createReportEntry, getS3SecureUrl, uploadToS3Bucket } from './API';
 

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
        <div className="report">
            <form onSubmit={handleSubmit(onSubmit)} className="report-form">
                {error ? <h3 className="error">{error}</h3> : null}
                <label htmlFor="title">Tunniste *</label>
                <input name="title" required {...register('title', { required: true })}/>
                <label htmlFor="species">Laji *</label>
                <input name="species" required {...register('species', { required: true })}/>
                <label htmlFor="length">Pituus (cm)</label>
                <input name="length" {...register ('length')}/>
                <label htmlFor="weight">Paino (kg)</label>
                <input name="weight" {...register ('weight')}/>
                <label htmlFor="lure">Viehe</label>
                <input name="lure" {...register ('lure')}/>
                <label htmlFor="fishingMethod">Kalastus tapa *</label>
                <input name="fishingMethod" required {...register ('fishingMethod', { required: true })}/>
                <label htmlFor="catchPhoto">Kuva</label>
                <input name="catchPhoto" type="file" onChange={setFile}/>
                <label htmlFor="date">Pvm *</label>
                <input name="date" type="date" required {...register ('date', { required: true })}/>
                <p>* Pakollinen tieto</p>
                <button disabled={loading}>{loading ? 'Loading...' : 'Save'}</button>
            </form>
        </div>
    );  
};

export default CatchReportForm;