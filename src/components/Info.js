import React from 'react';

function Info({ swaggerJson }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-xl">
      <div className="px-6 py-4">
        <div className="font-bold text-3xl mb-2">{swaggerJson?.info?.title} <span className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{swaggerJson?.info?.version}</span></div>
        <div className="font-bold text-xs mb-2">[ Base Url : <span>{swaggerJson?.host + swaggerJson?.basePath}</span> ]</div>
        <div className="text-gray-700 text-base">
          {swaggerJson?.info?.description}
        </div>
      </div>

      <div className="px-6 pt-4 pb-2 font-bold ">
        <p>Terms : <span className="underline">{swaggerJson?.info?.termsOfService}</span></p>
        <p>email : <span className="underline">{swaggerJson?.info?.contact?.email}</span></p>
      </div>
    </div>
  );
}

export default Info;
