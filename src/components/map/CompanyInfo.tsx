import { useNavigate } from "react-router-dom";

const CompanyInfo = () => {

  const navigate = useNavigate();

  return (

    <div className="company-info-page">

      <div className="company-info-container">

        <h1 className="company-heading">
          WELCOME TO GEOSPATIAL CONSULTING SERVICES!
        </h1>

        <div className="company-grid">

          <div className="company-left">
            <h2>ABOUT OUR COMPANY</h2>
             <a href="https://www.dharanigeospatialtechnologies.com/">Dharni Geospatial</a>

            <p>
              Based on the rich experience in delivering geospatial solutions across
              varied geographical and industrial domains, our company has a
              knowledge base that runs wide and deep.
            </p>

            <p>
              We bring this expertise to enable clients to successfully execute
              projects with our specialized staff and strategic partners.
            </p>

          </div>

          <div className="company-right">

            <div className="service-item">
              <h3>AERIAL LIDAR</h3>
              <p>
                LiDAR collection systems use powerful laser sensors with GPS
                and INS units for accurate terrain mapping.
              </p>
            </div>

            <div className="service-item">
              <h3>UAV</h3>
              <p>
                UAV mapping captures high resolution spatial data used for
                monitoring infrastructure and planning.
              </p>
            </div>

            <div className="service-item">
              <h3>MOBILE LIDAR</h3>
              <p>
                Mobile LiDAR enables rapid and accurate ground survey data
                collection.
              </p>
            </div>

            <div className="service-item">
              <h3>ORTHO PHOTOGRAPHY</h3>
              <p>
                Orthophotos are georeferenced aerial images used for precise
                GIS analysis.
              </p>
            </div>

          </div>

        </div>

        <div className="company-bottom">

          <button
            className="explore-map-btn"
            onClick={() => navigate("/map")}
          >
            Explore Map View
          </button>

        </div>

      </div>

    </div>
  );
};

 export default CompanyInfo