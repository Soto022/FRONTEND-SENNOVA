import React from 'react';
import './Table.css';

const Table = ({ headers, data, renderRow }) => {
  return (
    <table className="table">
      <thead className="table__header">
        <tr className="table__row">
          {headers.map((header) => (
            <th key={header} className="table__cell table__cell--header">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="table__body">
        {data.map((item) => renderRow(item))}
      </tbody>
    </table>
  );
};

export default Table;
