"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const rbac_controller_1 = require("../controllers/rbac.controller");
async function default_1(server) {
    server.get('/', rbac_controller_1.getRolesHandler);
    server.post('/', rbac_controller_1.createRoleHandler);
    server.put('/:name', rbac_controller_1.updateRolePermissionsHandler);
    server.delete('/:name', rbac_controller_1.deleteRoleHandler);
}
