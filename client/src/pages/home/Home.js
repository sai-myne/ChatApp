import React, { Fragment, useEffect } from "react";
import { Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSubscription, gql  } from "@apollo/client";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";
import Users from "./Users";
import Messages from "./Messages";

const NEW_MESSAGE = gql`
  subscription newMessage{
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`

const NEW_REACTION = gql`
  subscription newReaction{
    newReaction {
      uuid
      content
      message{
        uuid from to
      }
    }
  }
`

export default function Home({ history }) {
  const authDispath = useAuthDispatch();
  const messageDisaptch = useMessageDispatch();
  const { user } = useAuthState()
  const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE)
  const { data: reactionData, error: reactionError } = useSubscription(NEW_REACTION)

  useEffect(() => {
    if(messageError) console.log(messageError)

    if(messageData) {
      const message = messageData.newMessage
      const otherUser = user.username === message.to ? message.from : message.to
      messageDisaptch({
        type: 'ADD_MESSAGE',
        payload: {
          username: otherUser,
          message: message

        }
      })
    }
  }, [messageError, messageData])

  useEffect(() => {
    if(reactionError) console.log(reactionError)

    if(reactionData) {
      const reaction = reactionData.newReaction
      const otherUser = user.username === reaction.message.to ? reaction.message.from : reaction.message.to
      messageDisaptch({
        type: 'ADD_REACTION',
        payload: {
          username: otherUser,
          reaction,

        }
      })
    }
  }, [reactionError, reactionData])

  const logout = () => {
    authDispath({ type: "LOGOUT" });
    window.location.href = '/login';
  };

  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login" style={{ width: "0px" }}>
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register" style={{ width: "0px" }}>
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout} style={{ width: "0px" }}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white">
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
}
