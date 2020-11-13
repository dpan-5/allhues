import React, { useContext } from "react";
import "./SingleKit.css";
import UserContext from "../../utils/UserContext";

const Kit = (props) => {
  const { id } = useContext(UserContext);

  if (id === "") {
    return (
      <div className="card">
        <img
          src={
            props.src === undefined
              ? "http://via.placeholder.com/200"
              : props.src
          }
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title" style={{ textAlign: "center" }}>
            {props.info.kitName ? props.info.kitName : ""}
          </h5>
          <p className="card-text" style={{ textAlign: "center" }}>
            {props.info.kitDescription ? props.info.kitDescription : ""}
          </p>
          <p className="card-text">
            <small className="text-muted">
              Unique Visits: {props.info.uniqueVisits + 1}
            </small>
          </p>
        </div>
      </div>
    );
  }

  if (id === props.info.creatorId) {
    return (
      <div className="card">
        <img
          src={
            props.src === undefined
              ? "http://via.placeholder.com/200"
              : props.src
          }
          className="card-img-top crop"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title" style={{ textAlign: "center" }}>
            {props.info.kitName ? props.info.kitName : ""}
          </h5>
          <p className="card-text" style={{ textAlign: "center" }}>
            {props.info.kitDescription ? props.info.kitDescription : ""}
          </p>

          {props.info.kitItems.map((item) => (
            <a
              key={item.affiliateLink}
              href={item.affiliateLink}
              className="card-text"
              target="_blank"
              rel="noreferrer"
              style={{ textAlign: "center", display: "block" }}
            >
              {item.affiliateLink}
            </a>
          ))}

          <p className="card-text">
            <small className="text-muted">
              Unique Visits: {props.info.uniqueVisits + 1}
            </small>
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="buttons" onClick={props.onClickUpdate}>
            Update
          </button>
          <button className="buttons" onClick={props.onClickDelete}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <img
        src={
          props.src === undefined ? "http://via.placeholder.com/200" : props.src
        }
        className="card-img-top"
        alt="..."
      />
      <div className="card-body">
        <h5 className="card-title" style={{ textAlign: "center" }}>
          {props.info.kitName ? props.info.kitName : ""}
        </h5>
        <p className="card-text" style={{ textAlign: "center" }}>
          {props.info.kitDescription ? props.info.kitDescription : ""}
        </p>
        <p className="card-text">
          <small className="text-muted">
            Unique Visits: {props.info.uniqueVisits + 1}
          </small>
        </p>
      </div>
    </div>
  );
};

export default Kit;
