import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createReportEntry } from './API';

const CatchReportForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const  { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createReportEntry(data);
            onClose();
        }   catch (error) {
            console.log(error);
            setError(error.message);
            setLoading(false);
        }
    };


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
            <label htmlFor="image">Kuva</label>
            <input name="image" ref={register}/>
            <label htmlFor="catchDate">Pvm *</label>
            <input name="catchDate" type="date" required ref={register}/>
            <p>* Pakollinen tieto</p>
            <button disabled={loading}>{loading ? 'Loading...' : 'Save Catch Report'}</button>
        </form>
    );  
};

export default CatchReportForm;