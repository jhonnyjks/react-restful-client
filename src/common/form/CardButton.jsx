import React from 'react';
import SubmitButton from './SubmitButton';
import BackButton from './BackButton';

const CardButtons = ({ submitButtonClass = '' }) => (
    <div className="card-footer d-flex justify-content-between">
        <BackButton label='Cancelar' />
        <SubmitButton label='Salvar teste' additionalClasses={submitButtonClass} />        
    </div>
);

export default CardButtons;
