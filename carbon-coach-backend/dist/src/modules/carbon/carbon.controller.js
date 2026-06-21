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
exports.CarbonController = void 0;
const common_1 = require("@nestjs/common");
const carbon_service_1 = require("./carbon.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let CarbonController = class CarbonController {
    carbonService;
    constructor(carbonService) {
        this.carbonService = carbonService;
    }
    async logActivity(req, body) {
        return this.carbonService.logActivity(req.user.id, body.activityType, body.quantity, body.unit);
    }
    async getHistory(req) {
        return this.carbonService.getHistory(req.user.id);
    }
    async getSummary(req) {
        return this.carbonService.getSummary(req.user.id);
    }
};
exports.CarbonController = CarbonController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Log a new daily activity emission' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully logged activity' }),
    (0, common_1.Post)('log'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CarbonController.prototype, "logActivity", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve recent logged activity history logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully retrieved history' }),
    (0, common_1.Get)('history'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarbonController.prototype, "getHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Fetch total summary footprint and categories breakdown',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully fetched summary' }),
    (0, common_1.Get)('summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarbonController.prototype, "getSummary", null);
exports.CarbonController = CarbonController = __decorate([
    (0, swagger_1.ApiTags)('Carbon Tracker'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tracking'),
    __metadata("design:paramtypes", [carbon_service_1.CarbonService])
], CarbonController);
//# sourceMappingURL=carbon.controller.js.map