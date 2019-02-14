import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import AWS from 'aws-sdk';
import {
	Auth0Auth,
	AWSAuth
} from './auth';
import {
	createStore,
	applyMiddleware,
	compose
} from 'redux'

const sensorMap = {
	'01234567': 'Bedroom',
	'12345670': 'Garage',
	'6B326216': 'Indoors',
	'34567012': 'Heating'
}

const defaultState = {
	Bedroom: {Temperature: 0, Humidity: 0, Voltage: 0},
	Garage: {Temperature: 0, Humidity: 0, Voltage: 0},
	Indoors: {Temperature: 0, Humidity: 0, Voltage: 0},
	Heating: {Temperature: 0, Humidity: 0, Voltage: 0},
	credentials: {},
	awsCredentials: {},
	heartbeat: {},
	loginDone: false,
	awsLoginDone: false
}

const fetchHeartBeat = () => {
	var dynamodb = new AWS.DynamoDB();
	var queryParams = {
		ExpressionAttributeValues: {":v1": {"S": "/Modem"}},
		TableName: "moter_latest",
		KeyConditionExpression: "topic = :v1"
	};
	dynamodb.query(queryParams, function (err, data) {
		if (!err) {
			store.dispatch({
				type: 'HEARTBEAT',
				heartbeat: {
					count: data.Items[0].data.M.heartbeat.N,
					ts: data.Items[0].data.M.ts.N
				}
			});
		}
	});
}

const fetchSensorData = () => {
	var dynamodb = new AWS.DynamoDB();
	var queryParams = {
		ExpressionAttributeValues: {":v1": {"S": "/Sensor"}},
		TableName: "moter_latest",
		FilterExpression: "begins_with(topic, :v1)"
	};
	dynamodb.scan(queryParams, function (err, data) {
		if (!err) {
			for (let s of data.Items) {
				let action = {
					type: 'SENSOR_DATA',
					sensor: s.topic.S.substring(8),
					data: {}
				}
				for (let d in s.data.M) {
					let value = s.data.M[d]
					if (value.N) action.data[d] = parseFloat(value.N);
					else if (value.S) action.data[d] = value.S
				}
				store.dispatch(action)
			}
		} else {
			console.log(err)
		}
	});
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'SENSOR_DATA':
			return {...state, [sensorMap[action.sensor]]: action.data};
		case 'CREDS':
			return {...state, credentials: action.credentials, loginDone: true};
		case 'AWS_CREDS':
			return {...state, awsCredentials: action.awsCredentials, awsLoginDone: true};
		case 'HEARTBEAT':
			return {...state, heartbeat: action.heartbeat};
		default: return state
	}
}

const authMiddleware = () => {
	return next => action => {
		switch (action.type) {
			case 'LOGIN': auth0Auth.login(); break;
			case 'LOGOUT': auth0Auth.logout(); break;
			case 'CREDS': awsAuth.login(action.credentials.idToken); break;
			default: break;
		}
		return next(action)
	}
}

const dbMiddleware = () => {
	return next => action => {
		switch (action.type) {
			case 'AWS_CREDS':
			case 'REFRESH': fetchHeartBeat(); fetchSensorData(); break;
			default: break;
		}
		return next(action)
	}
}

const store = createStore(reducer, defaultState,
	compose(
		// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
		applyMiddleware(authMiddleware),
		applyMiddleware(dbMiddleware)
	))

const auth0Auth = new Auth0Auth(store);
const awsAuth = new AWSAuth(store);

auth0Auth.handleAuthentication();

ReactDOM.render(<App auth={auth0Auth} awsAuth={awsAuth} store={store}/>, document.getElementById('root'));
