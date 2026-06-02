import React, {
  useState,
  useMemo
} from "react";
import {
  useSelector,
  useDispatch
} from "react-redux";
import {
  toggleLayer
} from "../../store/slices/layersSlice";
import {
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiLayers,
} from "react-icons/fi";
import "../../styles/layerpanelsection.css";
import {
  toggleAssetLayer,
} from "../../store/slices/assetLayersSlice";

const LayerPanelSection = () => {
  const dispatch = useDispatch();

  const sections = useSelector(
    (state: any) =>
      state.layers.sections
  );

  const {
    enabledLayers = {},
    parentChildMap = {}
  } = useSelector(
    (state: any) =>
      state.assetLayers || {}
  );

  const [open, setOpen] =
    useState(false);

  const [collapsed,
    setCollapsed
  ] = useState<number[]>([]);

  const toggleCollapse = (
    id: number
  ) => {
    setCollapsed((prev) =>
      prev.includes(id)
        ? prev.filter(
            (i) => i !== id
          )
        : [...prev, id]
    );
  };

  /* ================= COUNTS ================= */

  const totalLayers =
    sections?.reduce(
      (
        sum: number,
        s: any
      ) =>
        sum +
        (
          s.layers?.length ??
          0
        ),
      0
    ) || 0;

  const enabledLayerCount =
    Object.values(
      enabledLayers
    ).filter(Boolean)
      .length;

  /* ================= ACTIVE PARENTS ================= */

  const activeParents =
    useMemo(() => {
      return (
        sections
          ?.flatMap(
            (s: any) =>
              s.layers
          )
          ?.filter(
            (l: any) =>
              l.isenabled
          ) || []
      );
    }, [sections]);

  const isAnyParentActive =
    activeParents.length >
    0;

  /* ================= GROUP NAME ================= */

  const getGroupName = (
    type: string
  ) => {
    switch (type) {
      case "linelayer":
        return "Railway Lines (All lines)";

      case "markerlayer":
        return "Signaling & Field Equipment";

      case "polygonlayer":
        return "Utilities & Other Assets";

      default:
        return null;
    }
  };

  /* ================= GROUPED ASSETS ================= */

  const groupedAssets =
    useMemo(() => {
      const groups:
        Record<
          string,
          string[]
        > = {};

      if (
        !isAnyParentActive
      ) {
        return {};
      }

      activeParents.forEach(
        (parent: any) => {
          const group =
            getGroupName(
              parent.type
            );

          if (!group)
            return;

          const parentKey =
            String(
              parent.type
            ).trim();

          const children =
            parentChildMap?.[
              parentKey
            ] || [];

          if (
            !Array.isArray(
              children
            )
          ) {
            return;
          }

          if (
            !groups[group]
          ) {
            groups[group] =
              [];
          }

          children.forEach(
            (
              child: any
            ) => {
              const childName =
                String(
                  child
                ).trim();

              if (
                childName &&
                !groups[
                  group
                ].includes(
                  childName
                )
              ) {
                groups[
                  group
                ].push(
                  childName
                );
              }
            }
          );
        }
      );

      return groups;
    }, [
      activeParents,
      parentChildMap,
      isAnyParentActive
    ]);

  return (
    <div className="layer-panel-wrap">

      {/* FLOAT BUTTON */}
      {!open && (
        <div
          className="floating-toggle"
          onClick={() =>
            setOpen(true)
          }
        >
          <FiLayers />

          <span>
            Layers
          </span>

          <span className="layer-count-badge">
            {
              enabledLayerCount
            }
            /
            {
              totalLayers
            }
          </span>

          <FiChevronUp />
        </div>
      )}

      {/* PANEL */}
      {open && (
        <div className="layer-card">

          {/* HEADER */}
          <div className="layer-card-header">
            <div className="layer-card-header-left">

              <FiLayers />

              <span>
                Map Layers
              </span>

              <span className="layer-count-badge">
                {
                  enabledLayerCount
                }
                /
                {
                  totalLayers
                }
              </span>
            </div>

            <FiX
              className="close-icon"
              onClick={() =>
                setOpen(false)
              }
            />
          </div>

          <div className="layer-card-body">

            {/* ================= BASE LAYERS ================= */}

            {sections
              ?.slice()
              .sort(
                (
                  a: any,
                  b: any
                ) =>
                  a.section -
                  b.section
              )
              .map(
                (
                  section: any
                ) => {
                  const isCollapsed =
                    collapsed.includes(
                      section.section
                    );

                  return (
                    <div
                      key={
                        section.section
                      }
                      className="layer-group"
                    >
                      <div
                        className="group-header"
                        onClick={() =>
                          toggleCollapse(
                            section.section
                          )
                        }
                      >
                        <span>
                          {
                            section.title
                          }
                        </span>

                        {isCollapsed ? (
                          <FiChevronDown />
                        ) : (
                          <FiChevronUp />
                        )}
                      </div>

                      {!isCollapsed &&
                        section.layers.map(
                          (
                            layer: any
                          ) => (
                            <div
                              key={
                                layer.id
                              }
                              className="layer-item"
                            >
                              <div className="left">
                                <input
                                  type="checkbox"
                                  checked={
                                    layer.isenabled
                                  }
                                  onChange={() =>
                                    dispatch(
                                      toggleLayer(
                                        layer.id
                                      )
                                    )
                                  }
                                />

                                <span>
                                  {
                                    layer.name
                                  }
                                </span>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  );
                }
              )}

            <hr
              style={{
                margin:
                  "10px 0"
              }}
            />

            {/* ================= RAILWAY ASSETS ================= */}

            <div className="layer-group">
              {!isAnyParentActive ? (
                <div
                  style={{
                    padding:
                      10,
                    color:
                      "#888"
                  }}
                >
                  No active
                  layers
                </div>
              ) : (
                Object.entries(
                  groupedAssets
                ).map(
                  ([
                    groupName,
                    items
                  ]) => {
                    const safeItems =
                      Array.isArray(
                        items
                      )
                        ? items
                        : [];

                    return (
                      <div
                        key={String(
                          groupName
                        )}
                        style={{
                          marginTop:
                            10
                        }}
                      >
                        {/* GROUP HEADER */}
                        <div className="group-header">
                          <span>
                            {String(
                              groupName
                            )}
                          </span>
                        </div>

                        {/* CHILD ITEMS */}
                        {safeItems.map(
                          (
                            layerName
                          ) => (
                            <div
                              key={String(
                                layerName
                              )}
                              className="layer-item"
                            >
                              <div className="left">
                                <input
                                  type="checkbox"
                                  checked={
                                    enabledLayers[
                                      String(
                                        layerName
                                      )
                                    ] ??
                                    false
                                  }
                                  onChange={() =>
                                    dispatch(
                                      toggleAssetLayer(
                                        String(
                                          layerName
                                        )
                                      )
                                    )
                                  }
                                />

                                <span>
                                  {String(
                                    layerName
                                  )}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerPanelSection;