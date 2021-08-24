import React from 'react';
import { Diagnosis, OccupationalHealthCareEntry } from '../types';
import { Icon } from "semantic-ui-react";

import { filteredDiagnosisName } from './helper';

const OccupationalHealthcare = ({ entry, diagnoses }: { entry: OccupationalHealthCareEntry, diagnoses: Diagnosis[] }) => {
  return (
    <div key={entry.id} className="ui segment">
      <h2>{entry.date} <Icon name="building" /></h2>
      <em style={{ color: 'grey' }}>{entry.description}</em>
      <h4>Diagnoses:</h4>
      <div className="ui bulleted list">
        {Object.keys(diagnoses).length > 0 && entry.diagnosisCodes?.map(code =>
          <div key={code} className="item">
            {filteredDiagnosisName(code, diagnoses)}
          </div>
        )}
      </div>
      {entry.sickLeave &&
        <p>DERP</p>
      }
      <strong>Sick leave:</strong> {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate}
    </div>
  );
};

export default OccupationalHealthcare;