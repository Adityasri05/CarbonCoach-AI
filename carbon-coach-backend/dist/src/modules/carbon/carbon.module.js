"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarbonModule = void 0;
const common_1 = require("@nestjs/common");
const carbon_service_1 = require("./carbon.service");
const carbon_controller_1 = require("./carbon.controller");
let CarbonModule = class CarbonModule {
};
exports.CarbonModule = CarbonModule;
exports.CarbonModule = CarbonModule = __decorate([
    (0, common_1.Module)({
        providers: [carbon_service_1.CarbonService],
        controllers: [carbon_controller_1.CarbonController],
        exports: [carbon_service_1.CarbonService],
    })
], CarbonModule);
//# sourceMappingURL=carbon.module.js.map