import { FastifyInstance } from 'fastify';
import {
  getRolesHandler,
  createRoleHandler,
  updateRolePermissionsHandler,
  deleteRoleHandler
} from '../controllers/rbac.controller';

export default async function (server: FastifyInstance) {
  server.get('/', getRolesHandler);
  server.post('/', createRoleHandler);
  server.put('/:name', updateRolePermissionsHandler);
  server.delete('/:name', deleteRoleHandler);
}
