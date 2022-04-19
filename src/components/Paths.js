import React, { useEffect, useState } from 'react';
import JSONPretty from 'react-json-pretty';

var JSONPrettyMon = require('react-json-pretty/dist/monikai');

function Paths({ swaggerJson }) {
  const [pathsData, setPathsData] = useState([]);

  useEffect(() => {
    const getFormattedData = (swaggerdata) => {
      return {
        ...swaggerdata,
        pathGroups: getPathGroups(swaggerdata)
      };
    }

    //todo create function for group by paths
    const updatedData = getFormattedData(swaggerJson)
    setPathsData(updatedData.pathGroups)
  }, [swaggerJson])

  const getPathGroups = (swaggerdata = {}) => {
    return swaggerdata.tags.map(tag => {
      return Object.keys(swaggerdata.paths).reduce((acc, path) => {
        if (!Object.hasOwn(acc, tag.name)) acc[tag.name] = [];
        if (path.includes(tag.name, 1)) {
          acc[tag.name].push({ ...swaggerdata.paths[path], path: path })
          acc['name'] = tag.name
          acc['desc'] = tag.description
        }
        return acc;
      }, {})
    })
  }

  const getMethodColor = (property, deprecated) => {
    if (deprecated) { 
      return { buttonColor: "bg-gray-300", rowColor: "!bg-gray-100", borderColor: "border-gray-500",textStrike: "line-through" } 
    }
    switch(property) {
      case 'post':
        return { buttonColor: "bg-green-500", rowColor: "!bg-green-100", borderColor: "border-green-500" }
      case 'put':
        return { buttonColor: "bg-orange-500", rowColor: "!bg-orange-100", borderColor: "border-orange-500" }
      case 'get':
        return { buttonColor: "bg-blue-500", rowColor: "!bg-blue-100", borderColor: "border-blue-500" }
      case 'delete':
        return { buttonColor: "bg-red-500", rowColor: "!bg-red-100", borderColor: "border-red-500" }
      case 'patch':
          return { buttonColor: "bg-yellow-500", rowColor: "!bg-yellow-100", borderColor: "border-yellow-500" }
      case 'head':
        return { buttonColor: "bg-brown-500", rowColor: "!bg-brown-100", borderColor: "border-brown-500" }
      case 'options':
        return { buttonColor: "bg-voilet-500", rowColor: "!bg-voilet-100", borderColor: "border-voilet-500" }
      default:
        return { buttonColor: "bg-blue-500", rowColor: "bg-blue-100", borderColor: "!border-blue-500" }
    }
  }

  function findVal(object, key) {
    var value;
    if (object) {
      Object.keys(object).some((k) => {
        if (k === key) {
          value = object[k];
          return true;
        }
        if (object[k] && typeof object[k] === 'object') {
          value = findVal(object[k], key);
          return value !== undefined;
        }
        return value
      });
    }
    return value;
  }

  const generate = (array) => {
    if (array[0]?.hasOwnProperty('schema')) {
      const isArray = array[0]?.schema.type === 'array'
      const ref = findVal(array[0], '$ref')
      const arr = ref.split('/')
      arr.shift()
      var defination = swaggerJson[arr[0]][arr[1]]
      return <JSONPretty id="json-pretty" theme={JSONPrettyMon} data={isArray ? [defination.properties] : defination.properties}></JSONPretty>
    }
    else {
      return array.map((param) => {
        return (<div className="m-2 grid grid-cols-6 " key={param.name}>
          <span>{param.name} {param.required ? <sup className='text-red-500'>* required</sup> : ""}</span>
          <input className="border border-black" type={param.type} />
        </div>)
      })
    }
  }

  const accordionButtonClass = "accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left border-0 rounded-none transition focus:outline-none"
  const selectClass = "form-select appearance-none block w-96 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
  const titleClass = "font-bold text-lg w-full bg-gray-50 text-md mb-2 mr-4 text-black"

  return (
    <div className="accordion" id="accordionExample">
      {
        pathsData.map(pathObject => {
          const tagname = pathObject.name
          return (
            <div key={tagname} className="accordion-item bg-white border border-gray-200">
              <h2 className="accordion-header mb-0" id={`heading${tagname}`}>
                <button className={`${accordionButtonClass}`}
                  type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${tagname}`} aria-expanded="true"
                  aria-controls={`collapse${tagname}`}>
                  <span className="font-bold text-xl mb-2 mr-4">{tagname} </span>
                  <span className="text-xs mb-2 text-black">{pathObject.desc}</span>
                </button>
              </h2>
              <div id={`collapse${tagname}`} className="accordion-collapse collapse show" aria-labelledby={`heading${tagname}`}
                data-bs-parent="#accordionExample">
                <div className="accordion-body py-4 px-5">
                  {
                    pathObject[tagname].map(endpoint => {
                      return Object.keys(endpoint).map((property) => {
                        if (property !== 'path' && property !== 'desc') {
                          const uniqueStr = (endpoint.path + property).replace(/[^a-zA-Z ]/g, "")
                          return (
                            <div key={endpoint.path + property} class="accordion" id={`accordionSummary`}>
                              <div class={`accordion-item mb-2 ${getMethodColor(property, endpoint[property].deprecated).rowColor}  border ${getMethodColor(property, endpoint[property].deprecated).borderColor}`}>
                                <h2 class="accordion-header" id={`heading${uniqueStr}`}>
                                  <button class={`
                                    ${getMethodColor(property, endpoint[property].deprecated).rowColor}
                                    collapsed
                                    ${accordionButtonClass}
                                    py-1 px-1
                                    `}
                                    type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${uniqueStr}`} aria-expanded="false"
                                    aria-controls={`collapse${uniqueStr}`}>

                                    <span className={`inline-block rounded-md px-3 py-1 text-sm font-semibold mr-2 uppercase text-white ${getMethodColor(property, endpoint[property].deprecated).buttonColor}`}> {property}</span>
                                    <span className={`font-bold text-md mb-2 mr-4 text-black ${getMethodColor(property, endpoint[property].deprecated).textStrike}`}>{endpoint.path}</span>
                                    <span className="text-xs mb-2 text-black">{endpoint[property].summary}</span>

                                  </button>
                                </h2>
                                <div id={`collapse${uniqueStr}`} class="accordion-collapse collapse" aria-labelledby={`heading${uniqueStr}`}
                                  data-bs-parent={`#accordionSummary`}>
                                  <div class="accordion-body py-4 px-5">
                                    <div>
                                      <div className={`${titleClass}`}> Parameters:</div>
                                      {generate(endpoint[property].parameters)}
                                      <div className={`${titleClass} mt-5`}>Parameter content type:</div>
                                      <select class={`${selectClass}`} aria-label="Default select example">
                                        {
                                          endpoint[property]?.produces.map(prod => {
                                            return (
                                              <option>{prod}</option>
                                            )
                                          })
                                        }
                                      </select>
                                    </div>
                                    <div>
                                      <div className={`${titleClass} mt-5`}>Responses:</div>
                                      <JSONPretty id="json-pretty" theme={JSONPrettyMon} data={endpoint[property]?.responses}></JSONPretty>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      });
                    })
                  }
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  );
}

export default Paths;
