const LayersScreen = () => {
  const layers = [
    { id: 1, name: "Main Railway Line", type: "Line" },
    { id: 2, name: "Bridges", type: "Polygon" },
    { id: 3, name: "Stations", type: "Point" },
  ];

  return (
    <div>

      <div className="admin-header">
        <h2>Layers Information</h2>
        <button className="primary-btn">+ Add Layer</button>
      </div>

      <div className="admin-table">
        <div className="admin-table-row header">
          <div>Layer Name</div>
          <div>Type</div>
          <div>Actions</div>
        </div>

        {layers.map(layer => (
          <div key={layer.id} className="admin-table-row">
            <div>{layer.name}</div>
            <div>{layer.type}</div>
            <div>
              <button className="danger-btn">Delete</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

 export default LayersScreen;