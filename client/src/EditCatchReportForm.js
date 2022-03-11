import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { updateReportEntry } from './API';

//TODO edit image and update to s3 bucket

const EditCatchReportForm = ({ entryToEdit, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const  { register, handleSubmit } = useForm();
    const entryDate = new Date(entryToEdit.date);
    const entryId = entryToEdit._id;

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await updateReportEntry(entryId, data);
            onClose();
        }   
        catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="report-form">
            {error ? <h3 className="error">{error}</h3> : null}
            <label htmlFor="title">Tunniste *</label>
            <input name="title" defaultValue={entryToEdit.title} required ref={register}/>
            
            <label htmlFor="species">Laji *</label>
            <input name="species" defaultValue={entryToEdit.species} required ref={register}/>

            <label htmlFor="length">Pituus (cm)</label>
            <input name="length" defaultValue={entryToEdit.length} ref={register}/>

            <label htmlFor="weight">Paino (kg)</label>
            <input name="weight" defaultValue={entryToEdit.weight} ref={register}/>

            <label htmlFor="lure">Viehe</label>
            <input name="lure" defaultValue={entryToEdit.lure} ref={register}/>

            <label htmlFor="fishingMethod">Kalastus tapa *</label>
            <input name="fishingMethod" defaultValue={entryToEdit.fishingMethod} required ref={register}/>

            <label htmlFor="catchPhoto">Kuva</label>
            <input name="catchPhoto" type="file" />

            <label htmlFor="date">Pvm *</label>
            <input name="date" type="date" defaultValue={entryDate.toISOString().split('T')[0]} required ref={register}/>

            <p>* Pakollinen tieto</p>
            <button disabled={loading}>{loading ? 'Loading...' : 'Save Catch Report'}</button>
        </form>
    );  
};

export default EditCatchReportForm;