import React from 'react';
import SchemaCard from '../SchemaCard.jsx';

const SchemaList = ({ schemas, onEdit, onDelete }) => {
  if (!schemas || schemas.length === 0) {
    return (
      <div style={{ color: '#4B5563', gridColumn: '1/-1', padding: '5vh' }}>
        NO SAVED PROFILES LOCATED.
      </div>
    );
  }

  return schemas.map((s) => (
    <SchemaCard
      key={s.id}
      schema={s}
      onEdit={(schema) => onEdit(schema)}
      onDelete={() => onDelete(s.id)}
    />
  ));
};

export default SchemaList;

