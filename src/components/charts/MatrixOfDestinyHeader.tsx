/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface MatrixOfDestinyHeaderProps {
  personName?: string;
}

const MatrixOfDestinyHeader: React.FC<MatrixOfDestinyHeaderProps> = ({ personName }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
        Russian Matrix of Destiny {personName && `for ${personName}`}
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Based on Natalia Ladini's system (Moscow, 2006). An octagram structure revealing 
        your life's energy patterns through 22 Major Arcana positions calculated from your birth date.
      </p>
    </div>
  );
};

export default MatrixOfDestinyHeader;