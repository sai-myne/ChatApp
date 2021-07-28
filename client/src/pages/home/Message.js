import React, { useState } from "react";
import { useAuthState } from "../../context/auth";
import classNames from "classnames";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import moment from "moment";
import { gql, useMutation } from "@apollo/client";

const REACT_TO_MESSAGE = gql`
    mutation reactToMessage($uuid: String! $content: String!){
      reactToMessage(uuid: $uuid, content: $content){
        uuid
      }
    }
  `

export default function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;
  const [showPopover, setShowpopover] = useState(false);
  const reactionIcons = [...new Set(message.reactions.map(r => r.content))]

  const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: err => console.log(err),
    onCompleted: (data) => {
      setShowpopover(false)
      // console.log(data)
    }
  })

  const react = (reaction) => {
    // console.log(`Reacting ${reaction} to message: ${message.uuid}`);
    reactToMessage({ variables: {uuid: message.uuid, content: reaction }})
  };
  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={setShowpopover}
      transition={false}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="d-flex px-0 py-1 align-items-center react-button-popover">
            {reactions.map((reaction) => (
              <Button
                variant="link"
                className="react-icon-button"
                key={reaction}
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  );

  return (
    <div
      className={classNames("d-flex my-3", {
        "ms-auto": sent,
        "me-auto": received,
      })}
    >
      {sent && reactButton}
      <OverlayTrigger
        placement={sent ? "right" : "left"}
        overlay={
          <Tooltip>
            {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
          </Tooltip>
        }
        transition={false}
      >
        <div
          className={classNames("py-2 px-3 rounded-pill position-relative", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          {message.reactions.length > 0 && (
            <div className="reactions-div bg-secondary p-1 rounded-pill">
              {reactionIcons} {message.reactions.length}
            </div>
          )}
          <p className={classNames({ "text-white": sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
      </OverlayTrigger>
      {received && reactButton}
    </div>
  );
}
