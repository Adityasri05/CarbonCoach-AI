"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwinController = void 0;
const common_1 = require("@nestjs/common");
const twin_service_1 = require("./twin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let TwinController = class TwinController {
    twinService;
    constructor(twinService) {
        this.twinService = twinService;
    }
    async simulate(req, body) {
        return this.twinService.simulate(req.user.id, body.scenarioName, body.transportSlider, body.energySlider, body.foodSlider, body.flightsSlider);
    }
    async getHistory(req) {
        return this.twinService.getHistory(req.user.id);
    }
};
exports.TwinController = TwinController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Simulate a future lifestyle change scenario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully simulated scenario' }),
    (0, common_1.Post)('simulate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwinController.prototype, "simulate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve carbon twin simulations history logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully retrieved history' }),
    (0, common_1.Get)('history'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwinController.prototype, "getHistory", null);
exports.TwinController = TwinController = __decorate([
    (0, swagger_1.ApiTags)('Carbon Twin AI'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('carbon-twin'),
    __metadata("design:paramtypes", [twin_service_1.TwinService])
], TwinController);
//# sourceMappingURL=twin.controller.js.map