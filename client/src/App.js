import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import mmlBasemap from './mml-basemap';
import moment from 'moment';

import { listReportEntries } from './API';
import { deleteReportEntry } from './API';
import CatchReportForm from './CatchReportForm';

const App = () => {
  const [reportEntries, setReportEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 60.193665,
    longitude: 24.928380,
    zoom: 6,
    minZoom: 6,
    maxZoom: 18,
  });

  const getEntries = async () => {
    console.log('getting reports..');
    const freshReportEntries = await listReportEntries();
    console.log('got report entries, setting them... ', freshReportEntries);
    setReportEntries(freshReportEntries);
  };

  // Delete report entry by id
  // returns remaining entries and sets them
  const deleteCatchReport = async (id) => {
    console.log('Deleting report with id: ' + id);
    const data = {id: id};
    const remainingReportEntries = await deleteReportEntry(data);
    setReportEntries(remainingReportEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const transformRequest = (url, resourceType) => {
    if (resourceType === 'Tile' && url.match(
        'https://avoin-karttakuva.maanmittauslaitos.fi/vectortiles/tilejson/taustakartta/1.0.0/taustakartta/default/v20/WGS84_Pseudo-Mercator/tilejson.json'
        )
      ) {
        return {
            url: url,
            headers: { 'Authorization': 'Basic ' + process.env.REACT_APP_MML_TOKEN }
        }
    }
  }

  const showAddMarkerPopup = (event) => {
    const [  longitude, latitude ] = event.lngLat;
    setAddEntryLocation({
     latitude,
     longitude,
    });
  };


  // Display each report entry on the map
  // Marker = marker that is displayed on the map
  // Popup = displayed when the marker is clicked (i.e. the report form)
  const displayEntries = function () {
    return (
      reportEntries.map(entry => (
        <React.Fragment key={entry._id}>
          <Marker latitude={entry.latitude} longitude={entry.longitude}>
            <div className="marker-wrapper" onClick={() => setShowPopup({[entry._id]: true})}>
              <img className="popup-icon" src={process.env.PUBLIC_URL + "/images/" + "fish.png"} alt="species icon"/>
            </div>
          </Marker>
          {
            showPopup[entry._id] ? (
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                anchor="top" >
                <div className="popup">
                  <img className="popup-img" src={entry.catchPhoto ? entry.catchPhoto : process.env.PUBLIC_URL + "/images/" + "stencil.png"} alt=""/>
                  <p className="date entry">{moment(entry.date).format('LL')}</p>
                        {
                          <h3 className="title">{entry.title}</h3> 
                        }
                        <p className="species entry"><img className="popup-icon" src={process.env.PUBLIC_URL + "/images/" + "trout.png"} alt="species icon"/> {entry.species}</p>
                        <p className="length entry"><img className="popup-icon" src={process.env.PUBLIC_URL + "/images/" + "length.png"} alt="length icon"/> {entry.length}{entry.length ? "cm" : "-"}</p>
                        <p className="weight entry"><img className="popup-icon" src={process.env.PUBLIC_URL + "/images/" + "weight.png"} alt="weight icon"/> {entry.weight}{entry.weight ? "kg" : "-"}</p>
                        <p className="lure entry"><img className="popup-icon" src={process.env.PUBLIC_URL + "/images/" + "lure.png"} alt="lure icon"/> {entry.lure}</p>
                        <p className="fishing-method entry"><img className="popup-icon" src={process.env.PUBLIC_URL + "/images/" + "fishing-rod.png"} alt="fishing rod icon"/> {entry.fishingMethod}</p>
                        <button className="deleteButton" onClick={() => deleteCatchReport(entry._id)}><i className="fa fa-trash-o"></i></button>
                </div>
            </Popup>
            ) : null
          }
        </React.Fragment>
      ))
    )
    
  };

  const createEntry = function() {
    return(
      <>
        <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            
            >
            <div>
              
            <img className="popup-icon" src={process.env.PUBLIC_URL + "/images/" + "fish.png"} alt="fish icon"/>
            </div>
          </Marker>
        <Popup
          latitude={addEntryLocation.latitude}
          longitude={addEntryLocation.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setAddEntryLocation(null)}
          anchor="top" >
          <div className="popup">
            <CatchReportForm 
              onClose={() => {
                setAddEntryLocation(null);
                getEntries();
              }} 
              location={addEntryLocation}/>
          </div>
        </Popup>
        </>
    );
  };

  // MAIN RETURN
  return (
    <ReactMapGL {...viewport} transformRequest={transformRequest} mapStyle = {mmlBasemap} onViewportChange={setViewport} onDblClick={showAddMarkerPopup}> 
      {(displayEntries())}
      {addEntryLocation ? (createEntry()) : null}
    </ReactMapGL>
  );
}

export default App;

/** 
 * https://gitlab.labranet.jamk.fi/data-analysis-and-ai/lam-station-visualization/blob/master/doc/maps/README.md
 * 
 *  API-avain voidaan välittää rajapintapalveluun myös URL-parametrina
    jos rajapintapalvelun tietty resurssi palauttaa URL-linkin toiseen resurssiin,
    niin tämä linkki ei sisällä API-avainta, vaan käyttäjän on itse lisättävä
    API-avain URL-parametrina myös viitatun resurssin URL-linkkiin
    URL-parametrin muoto:
    api-key=<oma-api-avain>

   
 */

 //https://www.maanmittauslaitos.fi/rajapinnat/api-avaimen-ohje
 //https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens