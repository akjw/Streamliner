import React, {useState, useEffect} from 'react'
import {Alert, Container, Row, Col, InputGroup, FormControl, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom';
import { Card, Tooltip, Popconfirm, Collapse } from 'antd';
import { EditOutlined, DeleteFilled, PlusSquareTwoTone } from '@ant-design/icons';
import Axios from 'axios';
import moment from 'moment'

export default function UserProfile({user}) {

  return (
    <div className="mt-4">
      <Container>
        <Row>
          <Col>
          <Card extra={<h4> 
                      <Tooltip title="Edit Profile">
                        <Link to={`/users/edit`} className="mx-2">
                          <EditOutlined  />
                        </Link>
                      </Tooltip>
                    </h4>}
                  className="mt-2 mb-2">
                  <h1>User Profile</h1>
                  <p><b>Name:</b> {user.firstname} {user.lastname}</p>
                  <p><b>Email:</b> {user.email}</p>
                  <p><b>Organization:</b> {user.organization.name}</p>
                  <p><b>Account created:</b> {moment(user.createdAt).format('MMMM Do YYYY')}</p>
                </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
