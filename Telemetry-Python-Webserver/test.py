import asyncio
import serial_asyncio

"""
class InputChunkProtocol(asyncio.Protocol):
    def connection_made(self, transport):
        self.transport = transport

    def data_received(self, data):
        print('data received', repr(data))

        # stop callbacks again immediately
        self.pause_reading()

    def pause_reading(self):
        # This will stop the callbacks to data_received
        self.transport.pause_reading()

    def resume_reading(self):
        # This will start the callbacks to data_received again with all data that has been received in the meantime.
        self.transport.resume_reading()


async def reader():
    transport, protocol = await serial_asyncio.create_serial_connection(loop, InputChunkProtocol, 'COM3', baudrate=115200)

    while True:
        await asyncio.sleep(0.3)
        protocol.resume_reading()


loop = asyncio.get_event_loop()
loop.run_until_complete(reader())
loop.close()
"""

from asyncio import get_event_loop
from serial_asyncio import open_serial_connection

async def run():
    reader, writer = await open_serial_connection(url='COM3', baudrate=115200)
    while True:
        line = await reader.readline()
        print(str(line, 'utf-8'))

loop = get_event_loop()
loop.run_until_complete(run())