
import appDataSource from '../infra/data-source';
import { Router } from "express";
import { PhysicalRoomServices, VirtualRoomServices } from '../services/room.service';
import { PhysicalRoom, VirtualRoom } from '../infra/entities/room.entity';
import { Meeting } from 'infra/entities/meeting.entity';
import { PhysicalRoomController, VirtualRoomController } from 'controllers';

const PhysicalRoomRouter = Router()
const VirtualRoomRouter = Router()

const physicalRoomRepository = appDataSource.getRepository(PhysicalRoom)
const physicalMeetingRepository = appDataSource.getRepository(Meeting);

const service = new PhysicalRoomServices(physicalRoomRepository, physicalMeetingRepository)
const controller = new PhysicalRoomController(service)

const virtualRoomRepository = appDataSource.getRepository(VirtualRoom)
const virtualMeetingRepository = appDataSource.getRepository(Meeting);

const virtualService = new VirtualRoomServices(virtualRoomRepository, virtualMeetingRepository)
const virtualController = new VirtualRoomController(virtualService)


// ROTAS DA SALA FISICA
PhysicalRoomRouter.post('/create', async (req, res) => {
    await controller.createRoomController(req, res)
})

PhysicalRoomRouter.get('/get', async (req, res) => {
    await controller.getAllRoomsController(req, res)
})

PhysicalRoomRouter.get('/get/:id', async (req, res) => {
    await controller.getRoomController(req, res)
})

PhysicalRoomRouter.delete('/delete', async (req, res) => {
    await controller.deletePhysicalRoomController(req, res)
})

PhysicalRoomRouter.patch('/update', async (req, res) => {
    await controller.updateRoomController(req, res)
})

// ROTAS DA SALA Virtual
VirtualRoomRouter.post('/create', async (req, res) => {
    await virtualController.createRoomController(req, res)
})

VirtualRoomRouter.get('/get', async (req, res) => {
    await virtualController.getAllRoomsController(req, res)
})

VirtualRoomRouter.get('/getById', async (req, res) => {
    await virtualController.getRoomController(req, res)
})

VirtualRoomRouter.delete('/delete', async (req, res) => {
    await virtualController.deleteVirtualRoomController(req, res)
})

VirtualRoomRouter.patch('/update', async (req, res) => {
    await virtualController.updateRoomController(req, res)
})

export { PhysicalRoomRouter, VirtualRoomRouter }