import React from "react";

interface Props {
  projects: any[];
}

const ProjectsOverviewTable: React.FC<Props> = ({ projects }) => {

  return (
    <div className="overview-table-wrapper">

      <div className="overview-table-header">

        <h3 className="section-title">
          All Projects
          <span className="section-title-count">
            {projects.length}
          </span>
        </h3>

      </div>


      <div className="overview-table">

        {/* TABLE HEADER */}

        <div className="overview-row header">
          <div>#</div>
          <div>Project Name</div>
          <div>Code</div>
          <div>From</div>
          <div>To</div>
          <div>Track Length</div>
          <div>Stations</div>
          <div>Map Center</div>
        </div>


        {/* TABLE ROWS */}

        {projects.map((p: any, i: number) => (

          <div key={p.id} className="overview-row">

            <div className="row-index">{i + 1}</div>

            <div className="overview-row-name">
              {p.name}
            </div>

            <div>
              <span className="code-badge">
                {p.code}
              </span>
            </div>

            <div>{p.from_station}</div>

            <div>{p.to_station}</div>

            <div className="track-length">
              {p.track_length_km} km
            </div>

            <div className="stations-count">
              {p.station_count}
            </div>

            <div className="map-center">
              {p.map_view_center}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ProjectsOverviewTable;