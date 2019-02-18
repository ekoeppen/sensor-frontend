# Sensor Frontend

A React based web frontend for environmental data

This web frontent uses data stored in two DynamoDB tables (sensor configuration and sensor data)
to show environmental data from temperature and temperature/humidity sensors. It uses
[Grommet](http://grommet.io/) components for the user interface, and Redux for state
management. Login is provided via Auth0.

## Example sensor hardware

The frontend is designed to work with an [STM32F0 based sensor/modem board](https://oshpark.com/shared_projects/2lZiNO17)
to provide the data. The sensor/modem board is a generic board which can be used to measure temperature via NTC
resistors, or an I2C temperature/humidity sensor.

## Example MQTT interface

The [firmware for the sensors and modems](https://github.com/ekoeppen/STM32_Generic_Ada_Drivers/tree/master/examples/stm32f0/rfm69_moter)
is designed to transmit data over serial line to a PC, which is handled by an
[interface program](https://github.com/ekoeppen/moter-modem) to transmit the data 
via MQTT to an AWS IoT backend, storing the data in a DynamoDB database.
